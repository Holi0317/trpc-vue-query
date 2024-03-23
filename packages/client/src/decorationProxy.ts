import type { AnyRouter, ProcedureType } from "@trpc/server";
import type { CreateVueQueryHooks } from "./createHooksInternal";
import type { DecorateProcedure } from "./types/client";
import { createRecursiveProxy } from "@trpc/server/unstable-core-do-not-import";

export function createVueDecoration<TRouter extends AnyRouter>(
  name: string,
  hooks: CreateVueQueryHooks<TRouter>,
) {
  return createRecursiveProxy(({ path, args }) => {
    const pathCopy = [name, ...path];

    // The last arg is for instance `.useMutation` or `.useQuery()`
    const lastArg = pathCopy.pop()!;
    const pathJoin = pathCopy.join(".");

    // Internal property for getting the definition (currently, only the path).
    // Get this value via `getProcedureDef` function
    if (lastArg === "_def") {
      return {
        path: pathJoin,
      } satisfies ReturnType<typeof getProcedureDef>;
    }

    return (hooks as any)[lastArg](pathJoin, ...args);
  });
}

/**
 * Definition of the procedure.
 *
 * @internal
 */
export function getProcedureDef(
  procedure: DecorateProcedure<ProcedureType, any>,
): { path: string } {
  return (procedure as any)._def;
}
