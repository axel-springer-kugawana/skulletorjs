import React, { useState, useEffect } from 'react'

export default function applyFadeOut({ time = '0.3s', timingFunction = 'ease-in-out' } = {}) {
  return ({ render }) => {
    const augmentRender = (skeletonArray, finish) => {
      const { Skulletor, ...remain } = render(skeletonArray, finish)

      const AugmentedSkulletor = ({ end, ...props }) => {
        const [fadeout, setFadeout] = useState(false)
        const [opacity, setOpacity] = useState(1)
        const onTransitionEnd = () => setFadeout(true)

        useEffect(() => {
          if (end) setOpacity(0)
        }, [end])

        return (
          <Skulletor
            {...{
              onTransitionEnd,
              style: {
                transition: `opacity ${time} ${timingFunction}`,
                opacity,
              },
              end: fadeout,
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
