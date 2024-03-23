/* eslint-disable @typescript-eslint/no-unused-vars */
import type { TRPCClientErrorLike } from "@trpc/client";
import type { ResolverDef } from "../shared";
import type { QueryClient } from "@tanstack/vue-query";

export interface DecorateMutation<TDef extends ResolverDef> {
  useMutation: <TContext = unknown>(
    opts?: UseTRPCMutationOptions<
      TDef["input"],
      TRPCClientErrorLike<TDef>,
      TDef["output"],
      TContext
    >,
    queryClient?: QueryClient,
  ) => unknown;
}

export interface UseTRPCMutationOptions<
  TInput,
  TError,
  TOutput,
  TContext = unknown,
> {
  // TODO
  // extends UseMutationOptions<TOutput, TError, TInput, TContext>,
  //    TRPCUseQueryBaseOptions {}
}
