import type { TRPCUntypedClient } from "@trpc/client";
import type { AnyRouter } from "@trpc/server";
import { inject } from "vue";

/**
 * Symbol for trpc-vue-query context/inject
 *
 * The content is declared in {@link TRPCProviderContent}
 *
 * @internal
 */
export const ProviderSymbol = Symbol();

/**
 * Content of the context/inject for trpc-vue-query
 *
 * @internal
 */
export interface TRPCProviderContent<TRouter extends AnyRouter> {
  client: TRPCUntypedClient<TRouter>;
}

/**
 * Get the injected context/provider for trpc-vue-query
 *
 * If the provider is not available (not running in setup function, or didn't
 * have inject above the component tree), this will throw an error.
 */
export function injectTrpc<TRouter extends AnyRouter>() {
  const context = inject<TRPCProviderContent<TRouter>>(ProviderSymbol);
  if (context == null) {
    throw new Error(
      "Unable to find tRPC Context. Did you forget to wrap your App inside `withTRPC` HoC?",
    );
  }

  return context;
}
