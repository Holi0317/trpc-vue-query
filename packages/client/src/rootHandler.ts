import type { QueryKeyFactory } from "./types/client";

/**
 * Default query key factory.
 */
export const defaultQueryKeyFactory: QueryKeyFactory = (path, input) => {
  return [{ subsystem: "trpc", path, input }];
};
