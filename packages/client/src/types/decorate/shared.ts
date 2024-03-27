import type { TRPCRequestOptions } from "@trpc/client";

/**
 * Shared options for query and mutation call.
 */
export interface TRPCUseQueryBaseOptions {
  /**
   * TRPC-specific options for this query
   */
  trpc?: Omit<TRPCRequestOptions, "signal">;
}

/**
 * Additional data for the query or mutation call.
 */
export interface TRPCHookResult {
  trpc: {
    path: string;
  };
}
