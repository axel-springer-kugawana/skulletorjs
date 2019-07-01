import camelToNodeCase from './camelToNodeCase'

export default function formatCSSAnimation(animation, animationName) {
  let result = `${animationName} {\n`
  for (let step in animation) {
    result += `${step} {\n`
    for (let rule in animation[step]) {
      result += `${camelToNodeCase(rule)}: ${animation[step][rule]}`
    }
    result += '\n}'
  }
  result += '\n}'
  return result
}
