import React from 'react'
import styled from 'styled-components'

const Skeleton = styled.div`
  ${({ sheet }) => sheet};
`

export function css(sheet) {
  return sheet
}

export function transform(sheet) {
  return sheet
}

export function render(sheet, apply) {
  return <Skeleton sheet={sheet} />
}

export function destroy(element) {
  return null
}
