export default defineEventHandler((event) => {
  const responseHeaders = event.node.res.getHeaders();

  // Set CORS headers
  responseHeaders['Access-Control-Allow-Origin'] = '*'; // Replace '*' with specific origin if needed
  responseHeaders['Access-Control-Allow-Methods'] =
    'GET, POST, PUT, DELETE, OPTIONS';
  responseHeaders['Access-Control-Allow-Headers'] =
    'Content-Type, Authorization';

  // Handle preflight requests
  if (event.node.req.method === 'OPTIONS') {
    event.node.res.statusCode = 204;
    event.node.res.end();
  }
});
