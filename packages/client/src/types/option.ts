import type { QueryKey } from "@tanstack/query-core";

export interface CreateTRPCVueOptions {
  /**
   * `onServerPrefetch` on suspense. Default to false. Set this to true in nuxt.
   *
   * Can override in per-procedure level.
   *
   * @default false
   */
  serverPrefetch?: boolean;

  queryKeyFactory?: (path: string, input: unknown) => QueryKey;
}
