export const getDynamicBaseURL = (
  protocol: string = window.location.protocol,
) => {
  const config = useRuntimeConfig();
  let baseURL = config.public.baseURL;

  if (!baseURL) {
    const host = window.location.host;
    baseURL = `${protocol}//${host}`;
  }
  return baseURL;
};
