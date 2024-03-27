import type { AnyRouter } from "@trpc/server";
import type { QueryKeyFactory, TRPCVueRoot } from "./types/client";
import type { CreateTRPCVueOptions } from "./types/option";
import { getProcedureDef } from "./decorationProxy";
import { ProviderSymbol } from "./provider";

/**
 * Default query key factory.
 */
const defaultQueryKeyFactory: QueryKeyFactory = (path, input) => {
  return [{ subsystem: "trpc", path, input }];
};

/**
 * Create the root handler.
 *
 * Methods in here will be available on the root of the trpc-vue-query client.
 *
 * WARNING: Property in the return value **must** be functions. Other value type
 * won't work.
 *
 * @internal
 */
export function createRootHandler<TRouter extends AnyRouter>(
  opts: CreateTRPCVueOptions,
): TRPCVueRoot<TRouter> {
  const queryKeyFactory = opts.queryKeyFactory ?? defaultQueryKeyFactory;

  return {
    queryKeyFactory,
    queryKey(procedure, input) {
      const { path } = getProcedureDef(procedure);
      return queryKeyFactory(path, input);
    },
    install(app, opts) {
      app.provide(ProviderSymbol, {
        client: opts.client,
      });
    },
  };
}
