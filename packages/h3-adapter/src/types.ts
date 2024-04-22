import type { AnyRouter, inferRouterContext } from "@trpc/server";
import type {
  HTTPBaseHandlerOptions,
  TRPCRequestInfo,
} from "@trpc/server/http";
import type { H3Event } from "h3";

export interface H3CreateContextFnOptions {
  /**
   * Event (aka request) from H3
   */
  event: H3Event;

  resHeaders: Headers;
  info: TRPCRequestInfo;
}

export type H3CreateContextFn<TRouter extends AnyRouter> = (
  opts: H3CreateContextFnOptions,
) => inferRouterContext<TRouter> | Promise<inferRouterContext<TRouter>>;

export type H3CreateContextOption<TRouter extends AnyRouter> =
  object extends inferRouterContext<TRouter>
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
