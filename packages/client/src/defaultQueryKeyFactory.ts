import type { QueryKey } from "@tanstack/query-core";

export type QueryKeyFactory = (path: string, input: unknown) => QueryKey;

/**
 * Default query key factory.
 */
export const defaultQueryKeyFactory: QueryKeyFactory = (path, input) => {
  return [{ subsystem: "trpc", path, input }];
};
