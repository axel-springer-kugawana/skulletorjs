import formatCSSAnimation from './formatCSSAnimation'

export const findAnimationName = (cssObject) => Object.keys(cssObject).find((p) => p.match('@keyframes'))

export default function createCSSAnimation(cssObject) {
  const animationName = findAnimationName(cssObject)

  if (animationName && typeof window !== undefined) {
    const animation = formatCSSAnimation(cssObject[animationName], animationName)
    const id = animationName.replace('@keyframes ', '')
    return { animation, id }
  }
}
