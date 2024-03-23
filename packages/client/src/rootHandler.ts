import type { AnyRouter } from "@trpc/server";
import type { QueryKeyFactory, TRPCVueRoot } from "./types/client";
import type { CreateTRPCVueOptions } from "./types/option";
import { getProcedureDef } from "./decorationProxy";

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
    queryKeyFactory,
    queryKey(procedure, input) {
      const { path } = getProcedureDef(procedure);
      return queryKeyFactory(path, input);
    },
  };
}
