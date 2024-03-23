import type { AnyRouter } from "@trpc/server";
import type { QueryKeyFactory, TRPCVueRoot } from "./types/client";
import type { CreateTRPCVueOptions } from "./types/option";

/**
 * Default query key factory.
 */
export const defaultQueryKeyFactory: QueryKeyFactory = (path, input) => {
  return [{ subsystem: "trpc", path, input }];
};

export function createRootHandler<TRouter extends AnyRouter>(
  opts: CreateTRPCVueOptions<TRouter>,
): TRPCVueRoot {
  const queryKeyFactory = opts.queryKeyFactory ?? defaultQueryKeyFactory;

  return {
    queryKeyFactory: queryKeyFactory,
  };
}
