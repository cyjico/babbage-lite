export type valueof<T> = T[keyof T];

export type KeyOfMap<M extends Map<unknown, unknown>> =
  M extends Map<infer K, unknown> ? K : never;
