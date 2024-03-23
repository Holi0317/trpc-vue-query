import type { MaybeRef } from "vue";
import type { ResolverDef } from "../shared";
import type { TRPCClientErrorLike } from "@trpc/client";
import type { QueryClient } from "@tanstack/vue-query";

export interface DecorateSubscription<TDef extends ResolverDef> {
  /**
   * @link https://trpc.io/docs/v11/subscriptions
   */
  useSubscription: (
    input: TDef["input"],
    opts?: UseTRPCSubscriptionOptions<
      TDef["output"],
      TRPCClientErrorLike<TDef>
    >,
    queryClient?: QueryClient,
  ) => void;
}

export interface UseTRPCSubscriptionOptions<TOutput, TError> {
  enabled?: MaybeRef<boolean>;
  onStarted?: () => void;
  onData: (data: TOutput) => void;
  onError?: (err: TError) => void;
}
