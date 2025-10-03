import axios from 'axios'

// Get API base URL from runtime config or fall back to build-time env var
const getApiBaseUrl = () => {
  // @ts-ignore - Runtime config injected by docker-entrypoint.sh
  if (window.__RUNTIME_CONFIG__?.API_BASE_URL) {
    // @ts-ignore
    return window.__RUNTIME_CONFIG__.API_BASE_URL
  }
  return import.meta.env.VITE_APP_API_BASE_URL || 'http://localhost:8010'
}

const APILinks = axios.create({
  baseURL: getApiBaseUrl(),
  headers: {
    'Content-Type': 'application/json'
  }
})

console.log('API Base URL:', getApiBaseUrl())

function ConvertKeysToCamelCase(obj: Record<string, any>): Record<string, any> {
  const newObj: Record<string, any> = {};
  Object.keys(obj).forEach((key) => {
    const newKey = key.replace(/([-_][a-z])/gi, ($1) => {
      return $1.toUpperCase().replace(/[-_]/g, '');
    });
    newObj[newKey] = obj[key];
  });
  return newObj;
}

export { APILinks, ConvertKeysToCamelCase }
