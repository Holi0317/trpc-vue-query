import type { TRPCClientErrorLike, TRPCRequestOptions } from "@trpc/client";
import type { MaybeRef } from "vue";
import type { QueryKey, SkipToken } from "@tanstack/query-core";
import type {
  QueryClient,
  UseQueryDefinedReturnType,
  UseQueryOptions,
  UseQueryReturnType,
} from "@tanstack/vue-query";
import type { ResolverDef, NonUndefinedGuard } from "../shared";
import type { MaybeRefDeep } from "../../cloneDeepUnref";

/**
 * @internal
 */
export interface DecorateQuery<TProcedure extends ResolverDef> {
  // TODO: Remove this. Move to root. Also link to trpc issue/pr
  getQueryKey(input: TProcedure["input"]): QueryKey;

  useQuery: ProcedureUseQuery<TProcedure>;
  // TODO: Add infinite query
  // TODO: Add suspense query
}

/**
 * Options object for query procedure.
 * @internal
 */
export type UseTRPCQueryOptions<
  TQueryFnData = unknown,
  TError = Error,
  TData = TQueryFnData,
  TQueryData = TQueryFnData,
> = Omit<
  UseQueryOptions<TQueryFnData, TError, TData, TQueryData, QueryKey>,
  // We will generate a queryKey. But allow caller to override. So this will not
  // be required.
  "queryKey"
> & {
  /**
   * Override query key for this query. If not provided, we will use the
   * configured query key factory to generate query key.
   */
  queryKey?: MaybeRef<QueryKey>;

  /**
   * TRPC-specific options for this query
   */
  trpc?: Omit<TRPCRequestOptions, "signal"> & {
    /**
     * `onServerPrefetch` on suspense. Default to false. Set this to true in nuxt.
     *
     * Can override in per-procedure level.
     * TODO: Docs
     *
     * @default false
     */
    serverPrefetch?: boolean;
  };
};

type UndefinedInitialTRPCQueryOptions<
  TQueryFnData = unknown,
  TError = Error,
  TData = TQueryFnData,
  TQueryData = TQueryFnData,
> = UseTRPCQueryOptions<TQueryFnData, TError, TData, TQueryData> & {
  initialData?: undefined;
};

type DefinedInitialTRPCQueryOptions<
  TQueryFnData = unknown,
  TError = Error,
  TData = TQueryFnData,
  TQueryData = TQueryFnData,
> = UseTRPCQueryOptions<TQueryFnData, TError, TData, TQueryData> & {
  initialData:
    | NonUndefinedGuard<TQueryFnData>
    | (() => NonUndefinedGuard<TQueryFnData>);
};

export interface TRPCHookResult {
  trpc: {
    path: string;
  };
}

/**
 * @internal
 */
export type UseTRPCQueryReturnType<TData, TError> = UseQueryReturnType<
  TData,
  TError
> &
  TRPCHookResult;

type UseTRPCQueryDefinedReturnType<TData, TError> = UseQueryDefinedReturnType<
  TData,
  TError
> &
  TRPCHookResult;

/**
 * Implementation of `useQuery` function on a query procedure
 *
 * @internal
 */
export interface ProcedureUseQuery<TDef extends ResolverDef> {
  // Variant 1: `initialData` is not defined
  <TQueryFnData extends TDef["output"] = TDef["output"], TData = TQueryFnData>(
    input: MaybeRefDeep<TDef["input"]> | SkipToken,
    opts?: UndefinedInitialTRPCQueryOptions<
      TQueryFnData,
      TRPCClientErrorLike<TDef>,
      TData,
      TDef["output"]
    >,
    queryClient?: QueryClient,
  ): UseTRPCQueryReturnType<TData, TRPCClientErrorLike<TDef>>;

  // Variant 2: `initialData` is defined
  <TQueryFnData extends TDef["output"] = TDef["output"], TData = TQueryFnData>(
    input: MaybeRefDeep<TDef["input"]> | SkipToken,
    opts?: DefinedInitialTRPCQueryOptions<
      NoInfer<TQueryFnData>,
      TRPCClientErrorLike<TDef>,
      TData,
      TDef["output"]
    >,
    queryClient?: QueryClient,
  ): UseTRPCQueryDefinedReturnType<TData, TRPCClientErrorLike<TDef>>;

  // Variant 3: `initialData` might be defined. Should be the fallback overload
  <TQueryFnData extends TDef["output"] = TDef["output"], TData = TQueryFnData>(
    input: MaybeRefDeep<TDef["input"]> | SkipToken,
    opts?: UseTRPCQueryOptions<
      TQueryFnData,
      TRPCClientErrorLike<TDef>,
      TData,
      TDef["output"]
    >,
    queryClient?: QueryClient,
  ): UseTRPCQueryReturnType<TData, TRPCClientErrorLike<TDef>>;
}
