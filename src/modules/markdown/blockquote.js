import { VOID_CHAR } from '../../meta/node';
import * as actions from '../../meta/actions';
import { isEdgeBranch } from '../../utils/node';

export function handleInput (change, editor) {
    const focus = change.selection.focus;
    // proceed only if cursor is at the front of current block,
    // and current block is not already a blockquote,
    // and text before cursor point matches pattern /^> /
    if (!isEdgeBranch(focus.block) ||
        focus.block[0].type === 'blockquote' ||
        !/^> $/.test(focus.nodes[0].text.slice(0, focus.offset))) return false;

    // 1. normalize: remove pattern text before the cursor point.
    const text = focus.nodes[0].text.length > focus.offset ? '' : VOID_CHAR;
    change[actions.REPLACE_TEXT]({ keys: focus.keys, offset: 0 }, text, focus.offset);

    // 2. delegate to schema for instructing the blockquote operation.
    const at = focus.keys.slice(0, focus.blocks.length);
    editor.schema.format('blockquote', change, at);
    return true;
}
