import type {
  AnyProcedure,
  AnyRouter,
  ProcedureType,
  inferProcedureInput,
  inferTransformedProcedureOutput,
} from "@trpc/server";
import type { DecorateQuery } from "./decorate/query";
import type { DecorateMutation } from "./decorate/mutation";
import type { DecorateSubscription } from "./decorate/subscription";
import type { ResolverDef, ProtectedIntersection } from "./shared";
import type {
  AnyRootTypes,
  RouterRecord,
} from "@trpc/server/unstable-core-do-not-import";
import type { QueryKey } from "@tanstack/query-core";
import type { ObjectPlugin } from "vue";
import type { TRPCProviderContent } from "../provider";

/**
 * Query factory type.
 *
 * Query key factory is only used by query procedures only. Mutations and
 * subscriptions will always use the query path as the query key.
 *
 * Default implementation is in `rootHandler.ts`.
 */
export type QueryKeyFactory = (path: string, input: unknown) => QueryKey;

/**
 * Methods available on the trpc-vue-query client root.
 *
 * WARNING: Property in the return value **must** be functions. Other value type
 * won't work.
 *
 * @internal
 */
export type TRPCVueRoot<TRouter extends AnyRouter> = ObjectPlugin<
  TRPCProviderContent<TRouter>
> & {
  queryKeyFactory: QueryKeyFactory;
  queryKey: <TDef extends ResolverDef>(
    procedure: DecorateProcedure<ProcedureType, TDef>,
    input: TDef["input"],
  ) => QueryKey;
  // TODO: Add useQueries
  // TODO: Add useSuspenseQueries
};

export type DecorateProcedure<
  TType extends ProcedureType,
  TDef extends ResolverDef,
> = TType extends "query"
  ? DecorateQuery<TDef>
  : TType extends "mutation"
    ? DecorateMutation<TDef>
    : TType extends "subscription"
      ? DecorateSubscription<TDef>
      : never;

type DecorateRouterRecord<
  TRoot extends AnyRootTypes,
  TRecord extends RouterRecord,
> = {
  [TKey in keyof TRecord]: TRecord[TKey] extends infer $Value
    ? $Value extends RouterRecord
      ? DecorateRouterRecord<TRoot, $Value>
      : $Value extends AnyProcedure
        ? DecorateProcedure<
            $Value["_def"]["type"],
            {
              input: inferProcedureInput<$Value>;
              output: inferTransformedProcedureOutput<TRoot, $Value>;
              transformer: TRoot["transformer"];
              errorShape: TRoot["errorShape"];
            }
          >
        : never
    : never;
};

export type CreateTRPCVue<TRouter extends AnyRouter> = ProtectedIntersection<
  TRPCVueRoot<TRouter>,
  DecorateRouterRecord<
    TRouter["_def"]["_config"]["$types"],
    TRouter["_def"]["record"]
  >
>;
