import React, { useState, useEffect } from 'react'

export default function applyInterrupt({ after = 3000, fallback } = {}) {
  return ({ render }) => {
    const augmentRender = (skeletonArray, finish) => {
      const { Skulletor, ...remain } = render(skeletonArray, finish)

      const AugmentedSkulletor = ({ end, ...props }) => {
        const [forcedEnd, setForceEnd] = useState(false)

        useEffect(() => {
          setTimeout(() => {
            setForceEnd(true)
            fallback && fallback()
          }, after)
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
