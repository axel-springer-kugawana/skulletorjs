import React, { useState, useEffect } from 'react'

export default function applyShowDelay({ after = 300 } = {}) {
  return ({ render }) => {
    const augmentRender = (skeletonArray, finish) => {
      const { Skulletor, ...remain } = render(skeletonArray, finish)
      const AugmentedSkulletor = ({ end, onDisapear, ...props }) => {
        const [delayResolved, setDelayResolved] = useState(false)
        const [shouldDisplay, updateDisplay] = useState(false)

        useEffect(() => {
          const timer = setTimeout(() => {
            setDelayResolved(true)
          }, after)

          return () => {
            clearTimeout(timer)
          }
        }, [])

        useEffect(() => {
          if (end && !delayResolved) {
            onDisapear()
          }

          if (!end && delayResolved) {
            updateDisplay(true)
          }
        }, [end, delayResolved])

        return shouldDisplay && <Skulletor {...{ end, onDisapear, ...props }} />
      }
      return { Skulletor: AugmentedSkulletor, ...remain }
    }

    return { render: augmentRender }
  }
}
