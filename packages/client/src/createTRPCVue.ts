import type { AnyRouter } from "@trpc/server";
import type { CreateTRPCVueOptions } from "./types/option";
import type { CreateTRPCVue } from "./types/client";
import { createFlatProxy } from "@trpc/server/unstable-core-do-not-import";
import { createVueDecoration } from "./decorationProxy";
import { createVueQueryHooks } from "./createHooksInternal";
import { createRootHandler } from "./rootHandler";

export function createTRPCVue<TRouter extends AnyRouter>(
  opts: CreateTRPCVueOptions = {},
): CreateTRPCVue<TRouter> {
  const rootHandler = createRootHandler(opts);

  const hooks = createVueQueryHooks({ root: rootHandler, opts });

  const rootProxy = createFlatProxy<CreateTRPCVue<TRouter>>((key) => {
    if (Object.prototype.hasOwnProperty.call(rootHandler, key)) {
      return (rootHandler as any)[key];
    }

    return createVueDecoration(key, hooks);
  });

  return rootProxy;
}
