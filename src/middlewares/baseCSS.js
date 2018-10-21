import mergeDeepLeft from 'ramda/es/mergeDeepLeft'

export default function applyBaseCSS({ transform }) {
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
              borderRadius: '6px',
              boxShadow: '0 10px 45px rgba(0, 0, 0, 0.1)',
            },
          },
        },
        cssObject,
      ),
    )
  }
  return { transform: augmentTransform }
}
