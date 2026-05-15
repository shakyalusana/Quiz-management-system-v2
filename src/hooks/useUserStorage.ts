const USER_INFO_KEY = "userInfo";

export const setUserInfo = <T extends object>(user: T): void => {
  localStorage.setItem(USER_INFO_KEY, JSON.stringify(user));
};

export const getUserInfo = <T>(): T | null => {
  const data = localStorage.getItem(USER_INFO_KEY);
  if (!data) return null;

  try {
    return JSON.parse(data) as T;
  } catch {
    return null;
  }
};

export const removeUserInfo = (): void => {
  localStorage.removeItem(USER_INFO_KEY);
};
