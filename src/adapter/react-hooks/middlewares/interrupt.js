import React, { useState, useEffect } from 'react'

export default function applyInterrupt({ after = 3000, fallback } = {}) {
  return ({ render }) => {
    const augmentRender = (skeletonArray, finish) => {
      const { Skulletor, ...remain } = render(skeletonArray, finish)

      const AugmentedSkulletor = ({ end, onInterrupt, ...props }) => {
        const [forcedEnd, setForceEnd] = useState(false)

        useEffect(() => {
          const timer = setTimeout(() => {
            setForceEnd(true)
            fallback && fallback()
            onInterrupt && onInterrupt()
          }, after)

          return () => {
            clearTimeout(timer)
          }
        }, [end])

        return (
          <Skulletor
            {...{
              end: forcedEnd || end,
              ...props,
            }}
          />
        )
      }

      return { Skulletor: AugmentedSkulletor, ...remain }
    }
    return { render: augmentRender }
  }
}
