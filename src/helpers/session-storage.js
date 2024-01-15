export const ErrorSafeSessionStorage = {
  setItem: (key, value) => {
    try {
      sessionStorage.setItem(key, value);
    } catch {
      return;
    }
  },
  getItem: (key) => {
    try {
      return sessionStorage.getItem(key);
    } catch {
      return null;
    }
  },
  removeItem: (key) => {
    try {
      sessionStorage.removeItem(key);
    } catch {
      return;
    }
  },
};
