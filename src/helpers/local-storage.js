export const ErrorSafeLocalStorage = {
  setItem: (key, value) => {
    try {
      localStorage.setItem(key, value);
    } catch {
      return;
    }
  },
  getItem: (key) => {
    try {
      return localStorage.getItem(key);
    } catch {
      return null;
    }
  },
  removeItem: (key) => {
    try {
      localStorage.removeItem(key);
    } catch {
      return;
    }
  },
};
