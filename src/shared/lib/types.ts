export type valueof<T> = T[keyof T];

export type KeyOfMap<M extends Map<unknown, unknown>> =
  M extends Map<infer K, unknown> ? K : never;

export type ValueOfMap<M extends Map<unknown, unknown>> =
  M extends Map<unknown, infer V> ? V : never;
