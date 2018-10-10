import { llcs } from '../utils/logic';
import { keysOf } from '../utils/node';
import { positions } from '../meta/node';
import * as actions from '../meta/actions';

export default class Selection {
    native = document.getSelection();

    get rangeCount () {
        return this.native.rangeCount;
    }

    get range () {
        return this.rangeCount ? this.native.getRangeAt(0) : null;
    }

    get start () {
        return this.isBackwards ? this.focus : this.anchor;
    }

    get end () {
        return this.isBackwards ? this.anchor : this.focus;
    }

    get isCollapsed () {
        const { anchor, focus } = this;
        return !anchor || !focus ? true :
            anchor.offset === focus.offset &&
            anchor.keys.slice(-1)[0] === focus.keys.slice(-1)[0];
    }

    get hasMultiNodes () {
        const { anchor, focus } = this;
        return anchor && focus &&
            anchor.keys.join('|') !== focus.keys.join('|');
    }

    get isBackwards () {
        if (this.isCollapsed) return false;
        const { anchor, focus, state } = this;

        return !this.hasMultiNodes ? anchor.offset > focus.offset :
            state.compareNodePosition(anchor.keys, focus.keys) === positions.AFTER;
    }

    select (anchor, focus = anchor) {
        const range = new Range();
        range.setStart(anchor.node, anchor.offset);
        range.setEnd(focus.node, focus.offset);
        this.native.removeAllRanges();
        this.native.addRange(range);
    }

    contains (keys) {
        if (this.isCollapsed) return false;
        const { state, start } = this;
        let position = state.compareNodePosition(keys, start.keys);

        if (position === positions.BEFORE) return false;

        if (position === positions.EQUAL) {
            if (start.offset !== 0) return false;
        }

        const end = this.end;
        position = state.compareNodePosition(keys, end.keys);

        if (position === positions.AFTER) return false;
        if (position === positions.BEFORE) return true;

        return end.offset === end.nodes[0].text.length;
    }

    mapPoint (state, point) {
        const keys = point.keys || [];
        const nodes = state.nodesOf(keys).reverse();
        const blocks = state.schema.blockLeafOf(nodes);
        const blockNodesLen = nodes.length - blocks.length + 1;
        const block = nodes.slice(0, blockNodesLen).reverse();
        return { keys, offset: point.offset, nodes, blocks, block };
    }

    digest (state, anchor, focus) {
        this.state = state;
        this.focus = this.mapPoint(state, focus || this.focus);
        this.anchor = this.mapPoint(state, anchor || this.anchor);
        return this;
    }

    update (state, operation) {
        this.state = state;
        if (typeof this[operation.type] === 'function') {
            const meta = this[operation.type](operation, state);
            if (meta) this.digest(state, meta.anchor, meta.focus);
        }
    }

    [actions.REPLACE_TEXT] ({ focus }) {
        const index = focus.keys.length - 1;
        if (this.focus.keys[index] === focus.keys[index]) {
            this.focus.offset = focus.offset;
        }
        if (this.anchor.keys[index] === focus.keys[index]) {
            this.anchor.offset = focus.offset;
        }
        return this;
    }

    [actions.REMOVE_NODES] ({ focus, anchor, meta }) {
        const keys = focus.keys || anchor.keys;
        const offset = focus.keys ?
            (meta.isBackwards ? -1 : 0) : (meta.isBackwards ? 0 : -1);
        return { anchor: { keys, offset }, focus: { keys, offset }};
    }

    [actions.REPLACE_NODES] ({ meta, data }, state) {
        const root = meta.at.slice(0, -1);
        const node = state.find(root);

        const isReplaced = keys => meta.length > 0 &&
            llcs(root, keys).length === root.length &&
            node.indexOf(keys[root.length]) === -1;

        const isFocusReplaced = isReplaced(this.focus.keys);
        const isAnchorReplaced = isReplaced(this.anchor.keys);
        if (isFocusReplaced || isAnchorReplaced) {
            const result = {};
            const next = data[data.length - 1].key;
            const keys = state.edgeLeafOf(root.concat(next)).map(n => n.key);
            const point = this.mapPoint(state, { keys, offset: 0 });
            if (isFocusReplaced) result.focus = point;
            if (isAnchorReplaced) result.anchor = point;
            return result;
        }
        return null;
    }

    [actions.EXTEND_NODE] ({ meta: { at }, data }) {
        let result = null;
        const mapKeys = keys => {
            return at.concat(keysOf(data)).concat(keys.slice(at.length));
        };
        const isExtended = ks => llcs(at, ks).length === at.length;

        if (isExtended(this.focus.keys)) {
            const { keys, offset } = this.focus;
            result = { focus: { keys: mapKeys(keys), offset }};
        }
        if (isExtended(this.anchor.keys)) {
            const offset = this.anchor.offset;
            const keys = mapKeys(this.anchor.keys);
            (result || (result = {})).anchor = { keys, offset };
        }
        return result;
    }
}
