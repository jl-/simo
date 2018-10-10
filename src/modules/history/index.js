import Record from './record';
import { editorHooks } from '../../meta/events';

export default class History {
    constructor (options, editor) {
        this.stack = [];
        editor.hook(editorHooks.UPDATED, ::this.update);
    }

    update (change) {
        this.stack.push(new Record(change));
    }
}
