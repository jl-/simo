import { VOID_CHAR } from '../../meta/node';
import * as actions from '../../meta/actions';
import { isEdgeBranch } from '../../utils/node';

export function handleInput (change, editor) {
    const focus = change.selection.focus;
    // proceed only if cursor is at the front of current block,
    // and current block is not already a list-item,
    // and text before cursor point matches pattern for ul/ol
    if (!isEdgeBranch(focus.block) ||
        focus.blocks[0].type === 'li' ||
        !/^(-|1\.) $/.test(focus.nodes[0].text.slice(0, focus.offset))) return false;

    // 1. normalize: remove pattern text before the cursor point.
    const text = focus.nodes[0].text.length > focus.offset ? '' : VOID_CHAR;
    change[actions.REPLACE_TEXT]({ keys: focus.keys, offset: 0 }, text, focus.offset);

    // 2. delegate to schema for instructing the list operation.
    const at = focus.keys.slice(0, focus.blocks.length);
    editor.schema.format('list', change, at, /^1\. /.test(focus.nodes[0].text));
    return true;
}
