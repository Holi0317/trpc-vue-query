import type { TRPCUntypedClient } from "@trpc/client";
import type { AnyRouter } from "@trpc/server";
import type { CreateTRPCVueOptions } from "./types/option";
import { type QueryClient, useQuery } from "@tanstack/vue-query";
import type {
  UseTRPCQueryOptions,
  UseTRPCQueryReturnType,
} from "./types/decorate/query";
import { defaultQueryKeyFactory } from "./defaultQueryKeyFactory";
import { onServerPrefetch } from "vue";
import { cloneDeepUnref } from "./cloneDeepUnref";

/**
 * Main logic here.
 *
 * Really not much types here. Good luck.
 *
 * @internal
 */
export function createVueQueryHooks<TRouter extends AnyRouter>(
  client: TRPCUntypedClient<TRouter>,
  opts: CreateTRPCVueOptions<TRouter>,
) {
  const queryDeco = useQueryProc(client, opts);
  useMutationProc();
  useSubscriptionProc();

  return {
    ...queryDeco,
  };
}

function useQueryProc<TRouter extends AnyRouter>(
  client: TRPCUntypedClient<TRouter>,
  rootOpts: CreateTRPCVueOptions<TRouter>,
) {
  function useQueryDeco(
    path: string,
    input: unknown,
    opts?: UseTRPCQueryOptions,
    queryClient?: QueryClient,
  ): UseTRPCQueryReturnType<unknown, Error> {
    const queryKey =
      opts?.queryKey ??
      rootOpts?.queryKeyFactory?.(path, input) ??
      defaultQueryKeyFactory(path, input);

    const queryHook = useQuery(
      {
        ...opts,
        queryKey,
        queryFn: ({ signal }) =>
          client.query(path, cloneDeepUnref(input), { ...opts?.trpc, signal }),
      },
      queryClient,
    );

    const serverPrefetch =
      rootOpts.serverPrefetch ?? opts?.trpc?.serverPrefetch ?? false;
    if (serverPrefetch) {
      onServerPrefetch(() => {
        return queryHook.suspense();
      });
    }

    return {
      ...queryHook,
      trpc: {
        path,
      },
    };
  }

  return {
    useQuery: useQueryDeco,
  };
}

function useMutationProc() {}

function useSubscriptionProc() {}

/**
 * Infer the type of a `createReactQueryHooks` function
 * @internal
 */
export type CreateVueQueryHooks<TRouter extends AnyRouter> = ReturnType<
  typeof createVueQueryHooks<TRouter>
>;
