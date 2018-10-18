import { editorEvents } from '../meta/events';

export default class Module {
    constructor (editor, options) {
        this.editor = editor;
        this.options = options;
    }

    handle (change, event, editor) {
        const action = editorEvents.get(event.type);
        if (typeof this[action] === 'function') {
            return this[action](change, event, editor);
        }
        return false;
    }
}
