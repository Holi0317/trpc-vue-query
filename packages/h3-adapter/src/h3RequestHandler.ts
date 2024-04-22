import type { AnyRouter } from "@trpc/server";
import {
  resolveHTTPResponse,
  getBatchStreamFormatter,
  type HTTPRequest,
  TRPCRequestInfo,
} from "@trpc/server/http";
import type { H3HandlerOptions } from "./types";
import {
  defineEventHandler,
  getHeader,
  getHeaders,
  getQuery,
  getRouterParam,
  isMethod,
  readBody,
} from "h3";

// HTTPResponse from @trpc/server/http/internals/types.ts
// Obviously they didn't put internals in export map so I can't figure out a way
// to import them.
interface HTTPResponse {
  status: number;
  headers?: Record<string, string[] | string | undefined>;
  body?: string;
}

// Same deal with HTTPResponse
type ResponseChunk = [procedureIndex: number, responseBody: string];

export type H3HandlerRequestOptions<TRouter extends AnyRouter> =
  H3HandlerOptions<TRouter> & {
    /**
     * Route parameter (`:trpc` part in h3, `[trpc].ts` in nitro and nuxt).
     *
     * @default trpc
     */
    routeParam?: string;
  };

const trimSlashes = (path: string): string => {
  path = path.startsWith("/") ? path.slice(1) : path;
  path = path.endsWith("/") ? path.slice(0, -1) : path;

  return path;
};

export function h3RequestHandler<TRouter extends AnyRouter>(
  opts: H3HandlerRequestOptions<TRouter>,
) {
  return defineEventHandler(async (event): Promise<Response> => {
    const resHeaders = new Headers();

    const createContext = async (innerOpt: { info: TRPCRequestInfo }) => {
      return opts.createContext?.({
        event: event,
        resHeaders,
        info: innerOpt.info,
      });
    };

    const path = trimSlashes(
      getRouterParam(event, opts.routeParam ?? "trpc") ?? "",
    );

    const req: HTTPRequest = {
      query: new URLSearchParams(getQuery(event)),
      method: event.method,
      headers: getHeaders(event),
      body:
        isMethod(event, ["PATCH", "POST", "PUT", "DELETE"]) &&
        getHeader(event, "content-type")?.startsWith("application/json")
          ? await readBody(event)
          : "",
    };

    let resolve: (value: Response) => void;
    const promise = new Promise<Response>((r) => (resolve = r));
    let status = 200;

    let isStream = false;
    let controller: ReadableStreamController<any>;
    let encoder: TextEncoder;
    let formatter: ReturnType<typeof getBatchStreamFormatter>;
    const unstable_onHead = (head: HTTPResponse, isStreaming: boolean) => {
      for (const [key, value] of Object.entries(head.headers ?? {})) {
        /* istanbul ignore if -- @preserve */
        if (typeof value === "undefined") {
          continue;
        }
        if (typeof value === "string") {
          resHeaders.set(key, value);
          continue;
        }
        for (const v of value) {
          resHeaders.append(key, v);
        }
      }
      status = head.status;
      if (isStreaming) {
        resHeaders.set("Transfer-Encoding", "chunked");
        resHeaders.append("Vary", "trpc-batch-mode");
        const stream = new ReadableStream({
          start(c) {
            controller = c;
          },
        });
        const response = new Response(stream, {
          status,
          headers: resHeaders,
        });
        resolve(response);
        encoder = new TextEncoder();
        formatter = getBatchStreamFormatter();
        isStream = true;
      }
    };

    const unstable_onChunk = ([index, string]: ResponseChunk) => {
      if (index === -1) {
        // full response, no streaming
        const response = new Response(string || null, {
          status,
          headers: resHeaders,
        });
        resolve(response);
      } else {
        controller.enqueue(encoder.encode(formatter(index, string)));
      }
    };

    resolveHTTPResponse({
      req,
      createContext,
      path,
      router: opts.router,
      batching: opts.batching,
      responseMeta: opts.responseMeta,
      onError(o) {
        opts?.onError?.({ ...o, req: event });
      },
      unstable_onHead,
      unstable_onChunk,
    })
      .then(() => {
        if (isStream) {
          controller.enqueue(encoder.encode(formatter.end()));
          controller.close();
        }
      })
      .catch(() => {
        if (isStream) {
          controller.close();
        }
      });

    return await promise;
  });
}
