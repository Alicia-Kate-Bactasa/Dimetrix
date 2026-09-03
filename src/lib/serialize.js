/**
 * Convert an object's keys from camelCase to snake_case.
 * Used when sending data from Prisma (camelCase) to the frontend (snake_case).
 */
export function toSnake(obj) {
  if (obj === null || obj === undefined || typeof obj !== "object") return obj;
  if (Array.isArray(obj)) return obj.map(toSnake);
  const result = {};
  for (const [key, value] of Object.entries(obj)) {
    const snakeKey = key.replace(/[A-Z]/g, (m) => "_" + m.toLowerCase());
    result[snakeKey] = value instanceof Date ? value.toISOString() : toSnake(value);
  }
  return result;
}

/**
 * Convert an object's keys from snake_case to camelCase.
 * Used when receiving data from the frontend (snake_case) to Prisma (camelCase).
 */
export function toCamel(obj) {
  if (obj === null || obj === undefined || typeof obj !== "object") return obj;
  if (Array.isArray(obj)) return obj.map(toCamel);
  const result = {};
  for (const [key, value] of Object.entries(obj)) {
    const camelKey = key.replace(/_([a-z])/g, (_, c) => c.toUpperCase());
    result[camelKey] = toCamel(value);
  }
  return result;
}
