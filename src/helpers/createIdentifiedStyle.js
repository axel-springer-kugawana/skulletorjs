export default function createIdentifiedStyle(content, id) {
  const style = document.createElement('style')
  style.setAttribute('id', id)
  style.innerHTML = content
  return style
}
