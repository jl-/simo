import { VOID_CHAR } from '../../meta/node';
import * as actions from '../../meta/actions';

export function match (meta) {
    return meta.first === meta.node &&
        !/^h[1-6]$/.test(meta.block[0].type) &&
        /^#{1,6} $/.test(meta.node.text.slice(0, meta.offset));
}

export function handle (change, { node, blocks, offset, keys }, editor) {
    let at = keys.slice(0, blocks.length);
    const text = node.text.length > offset ? '' : VOID_CHAR;
    change[actions.REPLACE_TEXT]({ keys, offset: 0 }, text, offset);
    if (blocks[0].type === 'li') {
        const block = change.state.find(at);
        const op = change[actions.EXTEND_NODE](at, block, 'block');
        at = at.concat(op.data[0].key);
    }
    const block = change.state.find(at);
    editor.formatter.toggle('heading', change, at, block, offset - 1);
}
