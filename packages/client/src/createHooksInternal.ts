import type { TRPCUntypedClient } from "@trpc/client";
import type { AnyRouter } from "@trpc/server";
import type { CreateTRPCVueOptions } from "./types/option";
import { type QueryClient, useQuery } from "@tanstack/vue-query";
import type {
  UseTRPCQueryOptions,
  UseTRPCQueryReturnType,
} from "./types/decorate/query";
import { onServerPrefetch } from "vue";
import { cloneDeepUnref } from "./cloneDeepUnref";
import type { TRPCVueRoot } from "./types/client";

interface HookContext<TRouter extends AnyRouter> {
  client: TRPCUntypedClient<TRouter>;
  root: TRPCVueRoot;
  opts: CreateTRPCVueOptions<TRouter>;
}

/**
 * Main logic here.
 *
 * Really not much types here. Good luck.
 *
 * @internal
 */
export function createVueQueryHooks<TRouter extends AnyRouter>(
  context: HookContext<TRouter>,
) {
  const queryDeco = useQueryProc(context);
  useMutationProc();
  useSubscriptionProc();

  return {
    ...queryDeco,
  };
}

function useQueryProc<TRouter extends AnyRouter>(
  context: HookContext<TRouter>,
) {
  function useQueryDeco(
    path: string,
    input: unknown,
    opts?: UseTRPCQueryOptions,
    queryClient?: QueryClient,
  ): UseTRPCQueryReturnType<unknown, Error> {
    const queryKey =
      opts?.queryKey ?? context.root.queryKeyFactory(path, input);

    const queryHook = useQuery(
      {
        ...opts,
        queryKey,
        queryFn: ({ signal }) =>
          context.client.query(path, cloneDeepUnref(input), {
            ...opts?.trpc,
            signal,
          }),
      },
      queryClient,
    );

    const serverPrefetch =
      context.opts.serverPrefetch ?? opts?.trpc?.serverPrefetch ?? false;
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
