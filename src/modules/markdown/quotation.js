import { VOID_CHAR } from '../../meta/node';
import * as actions from '../../meta/actions';

export function match (meta) {
    return meta.first === meta.node &&
        meta.block[0].type !== 'blockquote' &&
        meta.offset === 2 && /^> /.test(meta.node.text);
}

export function handle (change, { first, offset, blocks, keys }, editor) {
    const text = first.text.length > offset ? '' : VOID_CHAR;
    change[actions.REPLACE_TEXT]({ keys, offset: 0 }, text, offset);
    editor.formatter.toggle('quotation', blocks, change, editor);
}
