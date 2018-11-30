# SkulletorJS

## Motivation

SkulletorJS is a Javascript library that allows you to ease your skeleton loading screen creation. It uses predefined shapes you can configure and compose to create more complex skeletons.

The created skeletons are CSS based. SkulletorJS also provides control capabilities such as end, disappear.

### Simple example

This basic script produces a vanilla javascript skeleton. Easy to create, it simply uses some basic shapes and appends the result to the DOM.

```javascript
const bluePrint = () => [
  {
    width: [35, '%'],
    height: [365, 'px'],
  },
  circle({ radius: 35, left: 15, top: 15, color: { r: 255, g: 255, b: 255, a: 1 } }),
  rectangle({ height: [185, 'px'] }),
  line({ fontSize: 22, width: [180, 'px'], topGap: 20, left: 20 }),
  line({ fontSize: 22, width: [120, 'px'], topGap: 20, left: 20 }),
  line({ fontSize: 36, width: [150, 'px'], topGap: 20, left: 20 }),
]

const { Skulletor } = skulletor([bluePrint(), bluePrint()], [applyBaseCSS])
const dom = document.getElementById('root')
dom.appendChild(Skulletor)
```

The result :
![enter image description here](https://raw.githubusercontent.com/axel-springer-kugawana/skeletor/master/doc/screen1.JPG)

## Installation

    npm install skulletorjs

## How to use ?

First of all, you need to choose between two adapters : Vanilla or React adapter. It will define what kind of skulletor you're going to use, but the call remains similar.

#### Vanilla adapter :

```javascript
import skulletor from 'skulletorjs/adapter/vanilla'

// Here, 'Skeletor' is a domNode ready to be injected inside the document ...
const { Skulletor } = skulletor([bluePrint()], [...middlewares])

dom.appendChild(Skulletor)
```

#### React adapter :

```javascript
import React from 'react'
import skulletor from 'skulletorjs/adapter/react'

// ... while here, 'Skeletor' is a react Component.
const { Skulletor } = skulletor([bluePrint()], [...middlewares])

ReactDOM.render(
  <div>
    <Skulletor />
  </div>,
  dom,
)
```

### Shapes

SkulletorJS provide some basic shapes sufficient to satisfy common needs. (To implement custom shapes, please refer to chapter 'Raw CSS' or 'Going further')
Shape creation is very simple, each of them are functions with predefined and comprehensive parameters (fontSize, width etc.).

They are four shapes : rectangle, line, circle and square (square is equal to rectangle but use only size instead of width / height params).

```javascript
import { rectangle, line, circle, square } from 'skulletorjs/shapes'
const white = { r: 255, g: 255, b: 255, a: 1 }

const authorIcon = circle({ radius: 35, left: 15, top: 15, color: white })
const photo = rectangle({ height: [185, 'px'] })
const title = line({ fontSize: 22, width: [180, 'px'], topGap: 20, left: 20 })

const bluePrint = [authorIcon, photo, title]
```

The blueprint **order** is important :

- the stack will be displayed from first to last shape : In the following example, the `whiteIcon` shape will overlap the `greyRectangle`.

```javascript
const bluePrint = [
	whiteIcon, // Will be on top if shapes should overlap.
	greyRectangle,
	...
]
```

- Gap handling is possible with the use of `topGap` and/or `leftGap` properties. Those values are relative to the previous object defined in the blueprint.

```javascript
const bluePrint = [
	rectangle({ height: [185, 'px'] }),
	line({ fontSize: 22, topGap: 20 }), //  Will be positioned 20px after the rectangle.
	...
]
```

### Middlewares

SkulletorJS uses a simple middleware system to improve itself.

Some of them are adapter-specific like `applyFadeOut` while others are generic.

```javascript
import skulletor, { applyFadeOut } from 'skulletorjs/adapter/vanilla'
import { applyBaseCSS, applyAnimation } from 'skulletorjs/middlewares'

const { Skulletor } = skulletor([bluePrint()], [applyBaseCSS, applyAnimation, applyFadeOut])
```

When applying the middleware `applyAnimation`, the laser ray style animation is applied on our skeleton :

![enter image description here](https://raw.githubusercontent.com/axel-springer-kugawana/skeletor/master/doc/screen2.gif)

It's possible to provide your own middlewares (refer to "going further" section).

### Control

SkulletorJS provide control capabilites which can differ greatly between the Vanilla and the React adapter.
This chapter focus on the Vanilla version (the React version will be explained in the next chapter with a full example).

```javascript
import skulletor, { applyFadeOut } from 'skulletorjs/adapter/vanilla'
import { applyBaseCSS, applyAnimation } from 'skulletorjs/middlewares'

const { Skulletor, end } = skulletor([bluePrint()], [applyBaseCSS, applyAnimation, applyFadeOut])

const dom = document.getElementById('root')
dom.appendChild(Skulletor)

// The skeleton will end after 2 seconds, and when disapear, display a text.
setTimeout(() => {
  end().then(() => {
    dom.innerText = 'Loading finish !'
  })
}, 2000)
```

**Be careful**, `end` and `disapear` are two different concepts.
When `end` is called, the skeletor is asked to finish, but the promise will only be resolved when all middlewares release.
For instance, with `applyFadeOut` middleware, the skeletor could end but will disapear only when fadeout is terminated.

### Example with React adapter

```javascript
import React, { Fragment, Component } from 'react'
import ReactDOM from 'react-dom'

import skulletor, { applyFadeOut } from 'skulletorjs/adapter/react'
import { applyBaseCSS, applyAnimation } from 'skulletorjs/middlewares'
import { rectangle, line, circle } from 'skulletorjs/shapes'

const bluePrint = () => [
  {
    width: [35, '%'],
    height: [365, 'px'],
  },
  circle({ radius: 35, left: 15, top: 15, color: { r: 255, g: 255, b: 255, a: 1 } }),
  rectangle({ height: [185, 'px'] }),
  line({ fontSize: 22, width: [180, 'px'], topGap: 20, left: 20 }),
  line({ fontSize: 22, width: [120, 'px'], topGap: 20, left: 20 }),
  line({ fontSize: 36, width: [150, 'px'], topGap: 20, left: 20 }),
]

const { Skulletor } = skulletor([bluePrint()], [applyBaseCSS, applyAnimation, applyFadeOut])

class App extends Component {
  state = {
    isLoading: true,
    displayFinishMessage: false,
  }

  componentDidMount() {
    setTimeout(() => this.setState({ isLoading: false }), 2000)
  }

  render() {
    const { isLoading, displayFinishMessage } = this.state
    return (
      <Fragment>
        <Skulletor end={!isLoading} onDisapear={() => this.setState({ displayFinishMessage: true })} />
        {displayFinishMessage && 'Loading finish !'}
      </Fragment>
    )
  }
}

ReactDOM.render(<App />, document.getElementById('root'))
```

### Responsive

You can provide media queries in order to handle responsive skeletons :

```javascript
const bluePrintSmall = () => [ ... ]
const bluePrintLarge = () => [ ... ]

const { Skulletor } = skulletor({
  'max-width: 639px': [bluePrintSmall(), bluePrintSmall()],
  'min-width: 640px': [bluePrintLarge(), bluePrintLarge()],
}, [applyBaseCSS, applyAnimation, applyFadeOut])
```

# TODO

- [x] Create a basic documentation.
- [ ] Improve documentation and add following titles :
- API
- Raw CSS
- Going further - Create new shapes - Create middlewares - Adapter system for compatibility
- [ ] Add unit tests
- [ ] Configure CI
- [ ] Provide an umd builded lib file
