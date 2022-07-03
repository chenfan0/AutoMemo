function isUpperCase(str) {
  if (typeof str !== 'string') return false
  return /[A-X]/.test(str.slice(0, 1))
}



module.exports = {
  isUpperCase
}