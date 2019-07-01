import createIdentifiedStyle from './createIdentifiedStyle'

export default function injectStyleToHead(content, id) {
  if (typeof window !== undefined) {
    const style = createIdentifiedStyle(content, id)
    document.getElementsByTagName('head')[0].appendChild(style)
    return style
  }
  return null
}
