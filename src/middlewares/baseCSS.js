import mergeDeepLeft from 'ramda/src/mergeDeepLeft'

export default function applyBaseCSS() {
  return ({ transform }) => {
    const augmentTransform = (cssObject) => {
      return transform(
        mergeDeepLeft(
          {
            skeleton: {
              '&:after': {
                content: '""',
                display: 'block',
                width: '100%',
                height: '100%',
                backgroundRepeat: 'no-repeat',
              },
            },
          },
          cssObject,
        ),
      )
    }
    return { transform: augmentTransform }
  }
}
