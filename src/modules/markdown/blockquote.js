import { VOID_CHAR } from '../../meta/node';
import * as actions from '../../meta/actions';

export function handleInput (change, meta, editor) {
    // proceed only if cursor is at the front of current block,
    // and current block is not already a blockquote,
    // and text before cursor point matches pattern /^> /
    if (meta.first !== meta.node ||
        meta.block[0].type === 'blockquote' ||
        !/^> $/.test(meta.node.text.slice(0, meta.offset))) return false;

    // 1. normalize: remove pattern text before the cursor point.
    const at = meta.keys.slice(0, meta.blocks.length);
    const text = meta.node.text.length > meta.offset ? '' : VOID_CHAR;
    change[actions.REPLACE_TEXT]({ keys: meta.keys, offset: 0 }, text, meta.offset);

    // 2. delegate to schema for instructing the blockquote operation.
    editor.schema.instruct('blockquote', change, at);
    return true;
}
