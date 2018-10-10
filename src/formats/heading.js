import Format from './format';
import { h } from '../utils/dom';
import * as actions from '../meta/actions';

export const Options = {
    name: 'heading',
    title: 'Heading',
    desc: 'heading',
    shortcut: 'cmd+[',
    $control: h('span', { class: 'toolbar__icon icon-bold' })
};

export class Heading extends Format {
    constructor (options, editor) {
        super({ ...Options, ...options });
    }

    handle (active, change, editor) {
        console.log('// heading!', active, change, editor);
    }

    toggle (change, at, level) {
        // if current block is a list-item, wrap its content with normal block
        let block = change.state.find(at);
        if (block.type === 'li') {
            block = change[actions.EXTEND_NODE](at, block, 'block').data[0];
            at = at.concat(block.key);
        }

        const type = `h${level}`;
        const target = block.clone(false);
        target.type = target.type === type ? 'block' : type;
        change[actions.REPLACE_NODES]({ at, data: [target] });
    }
}

export default { ...Options, Ctor: Heading };
