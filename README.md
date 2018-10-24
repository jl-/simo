# [Simo](https://jl-.github.io/simo/)

<!-- Badges -->
![licence](https://badgen.net/badge/licence/MIT/blue)
[![npm version](https://badgen.net/npm/v/simo)](https://www.npmjs.com/package/simo)
[![npm downloads](https://badgen.net/npm/dm/simo)](https://www.npmjs.com/package/simo)

##### [Features](#features) | [Documentation](#docs) | [Examples](#examples)

> Next semantic rich text editor.

## Features
- small code base with a module system
- framework agnostic
- ...

## Examples

### General
```html

<!-- Simo itself is framework agnostic. -->
<!-- mount it with any view renderer you want, or write your own. Demo here using Vue with built-in renderer -->
<template>
    <div data-gramm="false" />
</template>

<script>
    import Editor from 'simo';

    export default {
        mounted () {
            const initState = {};
            this.editor = new Editor({ readonly: false });
            this.editor.mount(this.$el, initState);
        }
    };
</script>
```

### Customization
```javascript
// editor core
import Editor from 'simo/core';

// your custom renderer
import Renderer from 'my-custom-renderer';

// modules that enhance your editor
// for example: use the builtin history module
import History from 'simo/modules/history';

const editor = new Editor({
    // schema: {},
    // modules: options for modules
});

// create a renderer instance the way(|options) you want,
// for example: it needs a dom, and holds editor for future call.
const renderer = new Renderer(
    document.querySelector('#editor'), editor
);

// add module instances to enhance your editor with more functionality
editor.module('history', History/*, options*/);

// finally, mount your editor with initial state
editor.mount(renderer, {/* init state object */});
```

![untitled](https://user-images.githubusercontent.com/6291986/47406636-f1adf100-d789-11e8-9c7a-b553f291a134.png)
