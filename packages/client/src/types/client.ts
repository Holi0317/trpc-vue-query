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

export type QueryKeyFactory = (path: string, input: unknown) => QueryKey;

/**
 * @internal
 */
export interface TRPCVueRoot {
  queryKeyFactory: QueryKeyFactory;
  // TODO: Add useQueries
  // TODO: Add useSuspenseQueries
}

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
  TRPCVueRoot,
  DecorateRouterRecord<
    TRouter["_def"]["_config"]["$types"],
    TRouter["_def"]["record"]
  >
>;
