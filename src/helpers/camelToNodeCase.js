export default function camelToNodeCase(text) {
  var upperChars = text.match(/([A-Z])/g)
  if (!upperChars) {
    return text
  }

  var str = text.toString()
  for (let i = 0, n = upperChars.length; i < n; i++) {
    str = str.replace(new RegExp(upperChars[i]), '-' + upperChars[i].toLowerCase())
  }

  if (str.slice(0, 1) === '-') {
    str = str.slice(1)
  }

  return str
}
