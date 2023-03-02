// return a fix length string end with '...'
export function truncate(str, length) {
  if (str.length > length) {
    return str.substring(0, length) + '...'
  }
  return str
}
