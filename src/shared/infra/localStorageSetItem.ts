interface LocalStorageEventPayload<T> {
  key: string;
  value: T;
}

export type LocalStorageEvent<T> = CustomEvent<LocalStorageEventPayload<T>>;

export function localStorageSetItem<T>(key: string, value: T) {
  localStorage.setItem(key, JSON.stringify(value));

  window.dispatchEvent(
    new CustomEvent<LocalStorageEventPayload<T>>("localstoragechange", {
      detail: { key, value },
    }),
  );
}
