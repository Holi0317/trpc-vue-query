import type { TRPCUntypedClient } from "@trpc/client";
import type { AnyRouter } from "@trpc/server";
import { inject } from "vue";

export const ProviderSymbol = Symbol();

export interface TRPCProviderContent<TRouter extends AnyRouter> {
  client: TRPCUntypedClient<TRouter>;
}

export function injectTrpc<TRouter extends AnyRouter>() {
  const context = inject<TRPCProviderContent<TRouter>>(ProviderSymbol);
  if (context == null) {
    throw new Error(
      "Unable to find tRPC Context. Did you forget to wrap your App inside `withTRPC` HoC?",
    );
  }

  return context;
}
