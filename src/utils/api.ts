import axios from 'axios'

const APILinks = axios.create({
  baseURL: import.meta.env.VITE_APP_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
})

console.log(import.meta.env.VITE_APP_API_BASE_URL)

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
