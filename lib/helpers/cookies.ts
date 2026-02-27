export const getCookie = (name: string) => {
  const cookieValue = document.cookie.split("; ").reduce((acc, cookie) => {
    const [key, value] = cookie.split("=");
    return key === name ? decodeURIComponent(value) : acc;
  }, "");
  return cookieValue;
};

export const deleteCookie = (name: string) => {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
};
