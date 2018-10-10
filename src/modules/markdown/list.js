import { VOID_CHAR } from '../../meta/node';
import * as actions from '../../meta/actions';

export function match (meta) {
    return meta.first === meta.node &&
        !/^(un)?ordered-list$/.test(meta.block[0].type) &&
        /^(-|1\.) $/.test(meta.node.text.slice(0, meta.offset));
}

export function handle (change, { node, offset, keys, blocks }, editor) {
    const at = keys.slice(0, blocks.length);
    const text = node.text.length > offset ? '' : VOID_CHAR;
    const type = `${/^- /.test(node.text) ? 'un' : ''}ordered-list`;
    change[actions.REPLACE_TEXT]({ keys, offset: 0 }, text, offset);
    editor.formatter.toggle('list', change, at, change.state.find(at), type);
}
