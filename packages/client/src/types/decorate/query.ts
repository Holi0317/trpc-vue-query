import type { TRPCClientErrorLike } from "@trpc/client";
import type { MaybeRef, Ref } from "vue";
import type { QueryKey, SkipToken } from "@tanstack/query-core";
import type {
  QueryClient,
  UseQueryDefinedReturnType,
  UseQueryOptions,
  UseQueryReturnType,
} from "@tanstack/vue-query";
import type { ResolverDef, NonUndefinedGuard } from "../shared";
import type { MaybeRefDeep } from "../../cloneDeepUnref";
import type { TRPCHookResult, TRPCUseQueryBaseOptions } from "./shared";

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
> = TRPCUseQueryBaseOptions &
  Omit<
    // Not sure how to support ref here. So not supporting it for now
    Exclude<
      UseQueryOptions<TQueryFnData, TError, TData, TQueryData, QueryKey>,
      Ref<any>
    >,
    // We will generate a queryKey. But allow caller to override. So this will not
    // be required.
    "queryKey"
  > & {
    /**
     * Override query key for this query. If not provided, we will use the
     * configured query key factory to generate query key.
     */
    queryKey?: MaybeRef<QueryKey>;
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
