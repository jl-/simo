import Module from '../base';
import * as List from './list';
import * as Heading from './heading';
import * as Quotation from './quotation';
import * as actions from '../../meta/actions';
import * as hyperkit from '../../core/hyperkit';
import { VOID_CHAR } from '../../meta/node';
import { editorEvents, keyCodes } from '../../meta/events';
import { isEdgeBranch, adjacentLeafOf, adjacentPoint } from '../../utils/node';

export default class Hypergen extends Module {
    [editorEvents.get('keydown')] (change, event, editor) {
        switch (event.keyCode) {
            case keyCodes.ENTER:
                return this.onEnterKeydown(change, event, editor);
            case keyCodes.DELETE:
                event.preventDefault();
                return this.deleteBackwards(change, change.selection);
        }
        return false;
    }

    [editorEvents.get('beforeinput')] (change, event) {
        if (!event.isComposing && !change.selection.isCollapsed) {
            hyperkit.removeSelection(change, change.selection);
        }
    }

    [editorEvents.get('input')] (change, event) {
        const selection = change.selection;
        change[actions.REPLACE_TEXT]({
            keys: selection.focus.keys,
            offset: selection.focus.offset - event.data.length
        }, event.data, selection.focus.offset - selection.anchor.offset);
    }

    onEnterKeydown (change, event) {
        event.preventDefault();
        const selection = change.selection;

        // 1. remove selection if not collapsed
        if (!selection.isCollapsed) {
            return hyperkit.removeSelection(change, selection);
        }

        const focus = selection.focus;

        // 2. if current block is li|h1~h6|blockquote,
        // treat as linefeeding. and respect their rules
        if (focus.blocks[0].type === 'li') {
            return List.lineFeedLeaf(change, focus, selection);
        }
        if (/^h[1-6]$/.test(focus.blocks[0].type)) {
            return Heading.lineFeedLeaf(change, focus, selection);
        }
        if (focus.blocks[0].type === 'blockquote') {
            return Quotation.lineFeedLeaf(change, focus, selection);
        }

        // 3. TODO

        // last. treat as normal linefeeding, as splitting the focus node.
        return change[actions.SPLIT_NODE](focus, 1), false;
    }

    deleteBackwards (change, selection) {
        // 1. remove selection if not collapsed
        if (!selection.isCollapsed) {
            return hyperkit.removeSelection(change, selection);
        }

        const { keys, nodes, offset, block, blocks } = selection.focus;

        // 2. if the current leaf node is frozen, remove it
        if (change.state.schema.isFrozen(nodes[0])) {
            return hyperkit.removeNodeAtPoint(change, selection.focus, true);
        }

        // 3. if the leaf node has one char to be removed,
        // and still remains non-empty, then remove one char
        if (offset >= 1 && nodes[0].text.length > 1) {
            change[actions.REPLACE_TEXT]({ keys, offset: offset - 1 }, '', 1);
            return;
        }

        // 4. for offset >= 1
        // which means the current leaf node has no more than one char,
        // and the cursor is at the back of its content.

        // 4.1 if the current leaf node is not the first leaf of its block,
        // remove it backwards
        if (offset >= 1 && !isEdgeBranch(block, false)) {
            return hyperkit.removeNodeAtPoint(change, selection.focus, true);
        }

        // 4.2 if the current leaf node is not the last leaf of its block,
        // remove it forwards
        if (offset >= 1 && !isEdgeBranch(block, true)) {
            return hyperkit.removeNodeAtPoint(change, selection.focus, false);
        }

        // 4.3 this means the current block has only one leaf node,
        // 4.3.1 if its text is not VOID_CHAR, then set it to VOID_CHAR.
        if (offset >= 1 && nodes[0].text !== VOID_CHAR) {
            change[actions.REPLACE_TEXT]({ keys, offset: offset - 1 }, VOID_CHAR, 1);
            return;
        }

        // 4.3.2 if its text is VOID_CHAR, and has a previous adjacent leaf,
        // then remove current block backwards
        if (offset >= 1 && nodes[0].text === VOID_CHAR && adjacentLeafOf(
            change.state, nodes.slice(0).reverse(), { after: false }
        )) {
            return hyperkit.removeNodeAtPoint(change, selection.focus, true);
        }

        // 5. if offset === 0
        // 5.1 if focus is not at the front of block,
        // reset selection to previous leaf, and then start again.
        if (offset === 0 && !isEdgeBranch(block, false)) {
            const n = nodes.slice(0).reverse();
            const point = adjacentPoint(change.state, n, false);
            selection.digest(change.state, point, point);
            return this.deleteBackwards(change, selection);
        }

        // 5.2 if focus is at the front of li|heading|blockquote,
        // treat as block-wide backwards, in their own rules.
        if (offset === 0 && blocks[0].type === 'li') {
            return List.backwardsBlock(change, selection.focus);
        }
        if (offset === 0 && /^h[1-6]$/.test(blocks[0].type)) {
            return Heading.backwardsBlock(change, selection.focus);
        }
        if (offset === 0 && blocks[0].type === 'blockquote') {
            return Quotation.backwardsBlock(change, selection.focus);
        }

        // TODO
        // 5.3 otherwise, if focus is at the front of other blocks,
        // if it has a previous block, merge with it
    }
}
