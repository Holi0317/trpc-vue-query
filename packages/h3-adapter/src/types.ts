import type { AnyRouter, inferRouterContext } from "@trpc/server";
import type { HTTPBaseHandlerOptions } from "@trpc/server/http";
import type { H3Event } from "h3";

export interface H3CreateContextFnOptions {
  req: H3Event;
  resHeaders: Headers;
}

export type H3CreateContextFn<TRouter extends AnyRouter> = (
  opts: H3CreateContextFnOptions,
) => inferRouterContext<TRouter> | Promise<inferRouterContext<TRouter>>;

export type H3CreateContextOption<TRouter extends AnyRouter> =
  unknown extends inferRouterContext<TRouter>
    ? {
        /**
         * @link https://trpc.io/docs/context
         **/
        createContext?: H3CreateContextFn<TRouter>;
      }
    : {
        /**
         * @link https://trpc.io/docs/context
         **/
        createContext: H3CreateContextFn<TRouter>;
      };

export type H3HandlerOptions<TRouter extends AnyRouter> =
  H3CreateContextOption<TRouter> & HTTPBaseHandlerOptions<TRouter, H3Event>;
