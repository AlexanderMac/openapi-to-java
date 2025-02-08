export function padLine(line: string, level: number): string {
  return ' '.repeat(level) + line
}

// **********************
// Lodash native replaces
export const isUndefined = (value: unknown): boolean => {
  return value === undefined
}

export const isNil = (value: unknown): boolean => {
  return value == null
}

export const isString = (value: unknown): boolean => {
  return typeof value === 'string'
}

export const isNumber = (value: unknown): boolean => {
  return typeof value === 'number'
}

export const isArray = (value: unknown): boolean => {
  return Array.isArray(value)
}

export const isError = (value: unknown): boolean => {
  return value instanceof Error
}

export const isPlainObject = (value: unknown): boolean => {
  if (typeof value !== 'object' || value === null) {
    return false
  }
  if (Object.prototype.toString.call(value) !== '[object Object]') {
    return false
  }
  const proto = Object.getPrototypeOf(value) as object | null
  if (proto === null) {
    return true
  }

  const Ctor = Object.prototype.hasOwnProperty.call(proto, 'constructor') && proto.constructor
  return (
    typeof Ctor === 'function' &&
    Ctor instanceof Ctor &&
    Function.prototype.call(Ctor) === Function.prototype.call(value)
  )
}

export const capitalize = (value: string): string => {
  return value ? value.charAt(0).toUpperCase() + value.slice(1).toLowerCase() : ''
}
