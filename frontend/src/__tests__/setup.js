// Setup global localStorage mock for jsdom / vitest environment
if (typeof globalThis.localStorage === "undefined" || !globalThis.localStorage.getItem) {
  const store = {};
  globalThis.localStorage = {
    getItem: (key) => store[key] ?? null,
    setItem: (key, val) => {
      store[key] = String(val);
    },
    removeItem: (key) => {
      delete store[key];
    },
    clear: () => {
      Object.keys(store).forEach((k) => delete store[k]);
    },
  };
}
