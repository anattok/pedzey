export function localStorageLoadUser(key: string) {
  try {
    const userData = localStorage.getItem(key);
    if (!userData) {
      return undefined;
    }
    return JSON.parse(userData);
  } catch (error) {
    console.log(error);
    return undefined;
  }
}

export function localStorageSaveUser<T>(state: T, key: string) {
  const stringState = JSON.stringify(state);
  localStorage.setItem(key, stringState);
}

export function clearUserData() {
  localStorage.removeItem("userData");
}
