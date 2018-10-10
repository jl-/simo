<template>
    <div :class="$.root">
        <div ref="editor"
            :class="$.editor"
            class="simo"
            data-gramm="false"
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
        }
    };
</script>

<style lang="scss" module="$">
    .editor {
        border: 1px solid #eee;
    }
</style>
