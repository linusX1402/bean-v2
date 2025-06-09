export const getDynamicBaseURL = () => {
  const config = useRuntimeConfig();
  let baseURL = config.public.baseURL;

  if (!baseURL) {
    const protocol = window.location.protocol;
    const host = window.location.host;
    baseURL = `${protocol}//${host}`;
  }

  return baseURL;
};
