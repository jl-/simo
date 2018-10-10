# Simo

![licence](https://badgen.net/badge/licence/MIT/blue)

## Vue
```html
<template>
    <editor-shell ref="editor" />
</template>

<script>
    import Editor from 'simo';
    import EditorShell from 'simo/renderer/shell';

    export default {
        components: {
            EditorShell
        },
        mounted () {
            const initState = {};
            this.editor = new Editor({ readonly: false });
            this.editor.mount(this.$refs.editor.$el, initState);
        }
    };
</script>
```

## React
