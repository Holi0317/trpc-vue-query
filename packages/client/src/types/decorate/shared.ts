import type { TRPCRequestOptions } from "@trpc/client";

export interface TRPCUseQueryBaseOptions {
  /**
   * TRPC-specific options for this query
   */
  trpc?: Omit<TRPCRequestOptions, "signal"> & {
    /**
     * `onServerPrefetch` on suspense. Default to false. Set this to true in nuxt.
     *
     * Can override in per-procedure level.
     * TODO: Docs
     *
     * @default false
     */
    serverPrefetch?: boolean;
  };
}

export interface TRPCHookResult {
  trpc: {
    path: string;
  };
}
