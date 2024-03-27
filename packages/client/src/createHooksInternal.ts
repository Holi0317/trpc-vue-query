import type { AnyRouter } from "@trpc/server";
import type { CreateTRPCVueOptions } from "./types/option";
import { type QueryClient, useQuery, useMutation } from "@tanstack/vue-query";
import type {
  UseTRPCQueryOptions,
  UseTRPCQueryReturnType,
} from "./types/decorate/query";
import { onServerPrefetch } from "vue";
import { cloneDeepUnref } from "./cloneDeepUnref";
import type { TRPCVueRoot } from "./types/client";
import type {
  UseTRPCMutationOptions,
  UseTRPCMutationResult,
} from "./types/decorate/mutation";
import { injectTrpc } from "./provider";

interface HookContext<TRouter extends AnyRouter> {
  root: TRPCVueRoot<TRouter>;
  opts: CreateTRPCVueOptions;
}

/**
 * Main composable implementation.
 *
 * Each function will receive an additional `path: string` as the first
 * parameter. The type declaration is done in types/decorate files.
 *
 * Really not much types here. Good luck.
 *
 * @internal
 */
export function createVueQueryHooks<TRouter extends AnyRouter>(
  context: HookContext<TRouter>,
) {
  const queryDeco = useQueryProc<TRouter>(context);
  const mutationDeco = useMutationProc<TRouter>();
  useSubscriptionProc();

  return {
    ...queryDeco,
    ...mutationDeco,
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

    const { client } = injectTrpc<TRouter>();

    const queryHook = useQuery(
      {
        ...opts,
        queryKey,
        queryFn: ({ signal }) =>
          client.query(path, cloneDeepUnref(input), {
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

function useMutationProc<TRouter extends AnyRouter>() {
  const useMutationDeco = (
    path: string,
    opts?: UseTRPCMutationOptions<unknown, unknown, unknown, unknown>,
    queryClient?: QueryClient,
  ): UseTRPCMutationResult<unknown, unknown, unknown, unknown> => {
    // ?: Do we need to move generation of mutation key to config?
    const mutationKey = [path];

    const { client } = injectTrpc<TRouter>();

    const mutationHook = useMutation(
      {
        ...opts,
        mutationKey,
        mutationFn: (input) => {
          return client.mutation(path, input, opts?.trpc);
        },
      },
      queryClient,
    );

    return {
      ...mutationHook,
      trpc: {
        path,
      },
    };
  };

  return {
    useMutation: useMutationDeco,
  };
}

function useSubscriptionProc() {}

/**
 * Infer the type of a `createReactQueryHooks` function
 *
 * @internal
 */
export type CreateVueQueryHooks<TRouter extends AnyRouter> = ReturnType<
  typeof createVueQueryHooks<TRouter>
>;
