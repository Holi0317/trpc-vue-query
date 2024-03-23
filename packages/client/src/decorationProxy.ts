import type { AnyRouter } from "@trpc/server";
import type { CreateVueQueryHooks } from "./createHooksInternal";
import { createRecursiveProxy } from "@trpc/server/unstable-core-do-not-import";

export function createVueDecoration<TRouter extends AnyRouter>(
  name: string,
  hooks: CreateVueQueryHooks<TRouter>,
) {
  return createRecursiveProxy(({ path, args }) => {
    const pathCopy = [name, ...path];

    // The last arg is for instance `.useMutation` or `.useQuery()`
    const lastArg = pathCopy.pop()!;

    if (lastArg === "_def") {
      return {
        path: pathCopy,
      };
    }

    return (hooks as any)[lastArg](pathCopy.join("."), ...args);
  });
}
