// FIXME: Either use trpc's implementation or use ts-toolbelt U.strict
export type ProtectedIntersection<A, B> = A & B;

export type NonUndefinedGuard<T> = T extends undefined ? never : T;

export interface ResolverDef {
  input: any;
  output: any;
  transformer: boolean;
  errorShape: any;
}
