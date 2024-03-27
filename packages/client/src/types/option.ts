import type { QueryKeyFactory } from "./client";

export interface CreateTRPCVueOptions {
  /**
   * If true, run `await .suspense()` for queries on `onServerPrefetch`.
   *
   * Default to false. Set this to true in SSR environment (eg nuxt).
   *
   * Can override in per-procedure level.
   *
   * @default false
   */
  serverPrefetch?: boolean;

  /**
   * Override the default query key factory for queries.
   */
  queryKeyFactory?: QueryKeyFactory;
}
