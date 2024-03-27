import type { TRPCClientErrorLike } from "@trpc/client";
import type { ResolverDef } from "../shared";
import type {
  QueryClient,
  UseMutationOptions,
  UseMutationReturnType,
} from "@tanstack/vue-query";
import type { TRPCHookResult, TRPCUseQueryBaseOptions } from "./shared";

/**
 * Mutation decoration
 */
export interface DecorateMutation<TDef extends ResolverDef> {
  useMutation: <TContext = unknown>(
    opts?: UseTRPCMutationOptions<
      TDef["input"],
      TRPCClientErrorLike<TDef>,
      TDef["output"],
      TContext
    >,
    queryClient?: QueryClient,
  ) => UseTRPCMutationResult<
    TDef["output"],
    TRPCClientErrorLike<TDef>,
    TDef["input"],
    TContext
  >;
}

export type UseTRPCMutationOptions<
  TInput,
  TError,
  TOutput,
  TContext = unknown,
> = UseMutationOptions<TOutput, TError, TInput, TContext> &
  TRPCUseQueryBaseOptions;

export type UseTRPCMutationResult<TData, TError, TVariables, TContext> =
  TRPCHookResult & UseMutationReturnType<TData, TError, TVariables, TContext>;
