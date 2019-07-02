# SkulletorJS
[![CircleCI](https://circleci.com/gh/axel-springer-kugawana/skulletorjs.svg?style=svg)](https://circleci.com/gh/axel-springer-kugawana/skulletorjs)

## Table of contents
1. [Motivation](#motivation)
2. [Installation](#installation)
3. [How to use ?](#how-to-use)
4. [Key concepts](#key-concepts)
    1. [Shapes](#shapes)
    2. [Middlewares](#middlewares)
    3. [Controls](#controls)
    4. [Responsive](#responsive)
5. [TODO](#todo)

## Motivation

SkulletorJS is a Javascript library that allows you to ease your skeleton loading screen creation. It uses predefined shapes you can configure and compose to create more complex skeletons.

The created skeletons are CSS based. SkulletorJS also provides control capabilities such as end, disappear.

### Simple example

This basic script produces a vanilla javascript skeleton. Easy to create, it simply uses some basic shapes and appends the result to the DOM.

```javascript
const bluePrint = () => [
  {
    width: '35%',
    height: '365px',
  },
  circle({ radius: 35, left: 15, top: 15, color: { r: 255, g: 255, b: 255, a: 1 } }),
  rectangle({ height: '185px' }),
  line({ fontSize: 22, width: '180px', topGap: 20, left: 20 }),
  line({ fontSize: 22, width: '120px', topGap: 20, left: 20 }),
  line({ fontSize: 36, width: '150px', topGap: 20, left: 20 }),
]

const { Skulletor } = skulletor([bluePrint(), bluePrint()])
const dom = document.getElementById('root')
dom.appendChild(Skulletor)
```

The result :
![enter image description here](https://raw.githubusercontent.com/axel-springer-kugawana/skeletor/master/doc/screen1.JPG)

## Installation

    npm install --save skulletor

## How to use

First of all, you need to choose your adapter.

In the library you have 3 adapters available : Vanilla, React (Hooks) or React. It will define what kind of skulletor you're going to use, but the call remains similar.

#### Vanilla adapter :

```javascript
import skulletor from 'skulletor/lib/adapter/vanilla'

// Here, 'Skeletor' is a domNode ready to be injected inside the document ...
const { Skulletor } = skulletor([bluePrint()])

dom.appendChild(Skulletor)
```

#### React Hooks adapter :

```javascript
import React from 'react'
import skulletor from 'skulletor/lib/adapter/react-hooks'

// ... while here, 'Skeletor' is a React Component.
const { Skulletor } = skulletor([bluePrint()])

ReactDOM.render(
  <div>
    <Skulletor />
  </div>,
  dom,
)
```

#### React adapter :

```javascript
import React from 'react'
import skulletor from 'skulletor/lib/adapter/react'

// Same as React Hooks, this Skulletor is a React Component.
const { Skulletor } = skulletor([bluePrint()])

ReactDOM.render(
  <div>
    <Skulletor />
  </div>,
  dom,
)
```

## Key concepts
### Shapes

SkulletorJS provides some basic shapes sufficient to satisfy common needs. (To implement custom shapes, please refer to chapter 'Raw CSS' or 'Going further').
Shape creation is very simple, each of them are functions with predefined and comprehensive parameters (fontSize, width etc.).

There are four basic shapes : rectangle, line, circle and square (square is equal to rectangle but use only size instead of width / height params).

```javascript
import { rectangle, line, circle, square } from 'skulletor/lib/shapes'
const white = { r: 255, g: 255, b: 255, a: 1 }

const authorIcon = circle({ radius: 35, left: 15, top: 15, color: white })
const photo = rectangle({ height: '185px' })
const title = line({ fontSize: 22, width: '180px', topGap: 20, left: 20 })

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
	rectangle({ height: '185px' }),
	line({ fontSize: 22, topGap: 20 }), //  Will be positioned 20px after the rectangle.
	...
]
```

```javascript
const bluePrint = [
	rectangle({ height: '185px' }),
	line({ fontSize: 22, topGap: -22, leftGap: 20 }), //  Will be positioned 20px next to the rectangle. Note the use of topGap with a negative number so the line removes its heights in the gaping 
	...
]
```

### Middlewares

SkulletorJS uses a simple middleware system to improve itself. 

Some of them are adapter-specific like `applyFadeOut` while others are generic.

N.B. : The base skulletor function uses 3 middlewares, but you can change this by calling the `skulletorFactory` function used to generate your own "skulletor" function.

```javascript
import { skulletorFactory, applyFadeOut } from 'skulletor/lib/adapter/vanilla'
import { applyBaseCSS, applyAnimation } from 'skulletor/lib/middlewares'

// Generate your own skulletor function with some middlewares.
const mySkulletor = skulletorFactory([applyBaseCSS(), applyAnimation(), applyFadeOut()])
const { Skulletor } = mySkulletor([bluePrint()])
```

When applying the middleware `applyAnimation`, the laser ray style animation is applied on our skeleton :

![enter image description here](https://raw.githubusercontent.com/axel-springer-kugawana/skeletor/master/doc/screen2.gif)

It's possible to provide your own middlewares (refer to "going further" section).

**N.B.** : Middlewares are functions that will be handlded by the middlewareHandler. Provided middlewares are generators so you can custom them as follows.

```javascript
// Custom fadeOut duration and timing function
const mySkulletor = skulletorFactory([applyBaseCSS(), applyAnimation(), applyFadeOut({ time: '0.8s', timingFunction: 'ease-out' })])
```

### Controls

SkulletorJS provides control capabilites which can differ greatly between the Vanilla and the React adapter.
This chapter focuses on the Vanilla version (the React version will be explained in the next chapter with a full example).

```javascript
import skulletor from 'skulletor/lib/adapter/vanilla'

const { Skulletor, end } = skulletor([bluePrint()])

const dom = document.getElementById('root')
dom.appendChild(Skulletor)

// The skeleton will end after 2 seconds, and when it disapears, display a text.
setTimeout(() => {
  end().then(() => {
    dom.innerText = 'Loading finish !'
  })
}, 2000)
```

![enter image description here](https://raw.githubusercontent.com/axel-springer-kugawana/skulletorjs/master/doc/screen3.gif)

**Be careful**, `end` and `disapear` are two different concepts.
When `end` is called, the skeletor is asked to finish, but the promise will only be resolved when all middlewares release.
For instance, with `applyFadeOut` middleware, the skeleton loader could end but will disapear only when fadeout is terminated.

### Example with React adapter

```javascript
import React, { Fragment, Component } from 'react'
import ReactDOM from 'react-dom'

import skulletor from 'skulletor/lib/adapter/react'
import { rectangle, line, circle } from 'skulletor/lib/shapes'

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

const { Skulletor } = skulletor([bluePrint()])

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
})
```

# TODO

- [x] Create a basic documentation.
- [ ] Improve documentation and add following titles :
  - API
  - Raw CSS
  - Going further
    - Create new shapes
    - Create middlewares
    - Adapter system for compatibility
- [ ] Add unit tests
- [ ] Configure CI
- [ ] Provide an umd builded lib file
