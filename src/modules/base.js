import * as hyperkit from '../core/hyperkit';
import { editorEvents } from '../meta/events';

export default class Module {
    constructor (options, editor) {
        this.editor = editor;
        this.options = options;
    }

    handle (change, event, editor) {
        const action = editorEvents.get(event.type);
        if (typeof this[action] === 'function') {
            return this[action](change, event, editor);
        }
        if (!change.state.nodes.length) {
            // hyperkit.insertNormalBlockBefore();
        }
        return false;
    }
}
