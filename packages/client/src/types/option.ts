import type { QueryKey } from "@tanstack/query-core";
import type { CreateTRPCClientOptions } from "@trpc/client";
import type { AnyRouter } from "@trpc/server";

export type CreateTRPCVueOptions<TRouter extends AnyRouter> =
  CreateTRPCClientOptions<TRouter> & {
    /**
     * `onServerPrefetch` on suspense. Default to false. Set this to true in nuxt.
     *
     * Can override in per-procedure level.
     *
     * @default false
     */
    serverPrefetch?: boolean;

    queryKeyFactory?: (path: string, input: unknown) => QueryKey;
  };
