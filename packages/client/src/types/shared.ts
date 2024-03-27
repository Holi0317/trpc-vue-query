export type IntersectionError<TKey extends string> =
  `The property '${TKey}' in your router collides with a built-in method, rename this router or procedure on your backend.`;

export type ProtectedIntersection<TType, TWith> = keyof TType &
  keyof TWith extends never
  ? TType & TWith
  : IntersectionError<string & keyof TType & keyof TWith>;

export type NonUndefinedGuard<T> = T extends undefined ? never : T;

export interface ResolverDef {
  input: any;
  output: any;
  transformer: boolean;
  errorShape: any;
}
