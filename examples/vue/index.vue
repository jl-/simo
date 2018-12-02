<template>
    <div :class="$.root">
        <div ref="editor"
            :class="$.editor"
            class="simo"
            data-gramm="false"
            spellcheck="false"
        />
    </div>
</template>

<script>
    import Editor from '../../src';
    import initState from './state';

    export default {
        mounted () {
            this.editor = new Editor({ readonly: false });
            this.editor.mount(this.$refs.editor, initState);
            window.editor = this.editor;
        }
    };
</script>

<style lang="scss" module="$">
    .editor:global(.simo) {
        margin: 1em;
        padding: 1em;
        border: 1px solid #eee;
        blockquote {
            border-left: 3px solid #ddd;
        }
    }
</style>
