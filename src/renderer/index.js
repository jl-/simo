import Format from './format';
import * as actions from '../meta/actions';
import { lastOf } from '../utils/logic';
import { VOID_CHAR } from '../meta/node';
import { mergeFormats } from './options';
import { getKey, sibling, edgeText } from '../utils/dom';

export default class Renderer {
    constructor (view, editor, options = {}) {
        this.view = view;
        this.editor = editor;
        this.options = options;
        this.formats = Object.create(null);

        const formats = mergeFormats(options.formats);
        for (const name of Object.keys(formats)) {
            this.addFormat(name, formats[name]);
        }
    }

    supports (format) {
        return Boolean(this.of(format));
    }

    addFormat (name, options) {
        if (name && options) {
            const { Ctor, ...opts } = options;
            this.formats[name] = typeof Ctor === 'function' ?
                new Ctor(this, opts) : new Format(this, options);
        }
    }

    render (state, change) {
        if (!change) {
            for (const node of state.nodes) {
                const $node = this.renderNode(node);
                if ($node) this.view.appendChild($node);
            }
        } else {
            for (const operation of change.operations) {
                if (typeof this[operation.type] === 'function') {
                    this[operation.type](operation, change);
                }
            }
            this.setSelection(change.selection);
        }
    }

    renderNode (node, mode, context) {
        const format = this.of(node);
        return format ? format.render(node, mode, context) : null;
    }

    removeNode ($node) {
        $node.parentElement.removeChild($node);
    }

    of (format) {
        return this.formats[format.type || format];
    }

    $nodeOf (key) {
        return this.view.querySelector(`[data-key='${key}']`);
    }

    pointOf ($node, offset) {
        let $n = $node, keys = [];
        while ($n && $n !== this.view) {
            const key = getKey($n);
            if (key) keys.unshift(key);
            $n = $n.parentElement;
        }
        const node = this.editor.state.find(keys);
        const format = node && this.of(node.type);
        if (format && typeof format.pointOf === 'function') {
            offset = format.pointOf($node, offset, node).offset;
        }
        return { keys, offset };
    }

    $pointOf (node, offset) {
        const format = this.of(node.type);
        const $node = this.$nodeOf(node.key);
        if (format && typeof format.$pointOf === 'function') {
            return format.$pointOf(node, offset, $node);
        }

        node = edgeText($node);
        offset = offset < 0 ? Infinity : offset;
        return { node, offset: Math.min(offset, node.textContent.length) };
    }

    mapSelection (selection) {
        const native = selection.native;
        return {
            focus: this.pointOf(native.focusNode, native.focusOffset),
            anchor: this.pointOf(native.anchorNode, native.anchorOffset)
        };
    }

    setSelection (selection) {
        const { anchor, focus } = selection;
        selection.select(
            this.$pointOf(anchor.nodes[0], anchor.offset),
            this.$pointOf(focus.nodes[0], focus.offset)
        );
    }

    matchOperation (operation, node) {
        const format = this.of(node.type);
        if (format && typeof format[operation.type] === 'function') {
            format[operation.type](operation, node);
            return true;
        }
        return false;
    }

    [actions.INSERT_NODES] ({ data, meta }) {
        const $node = this.$nodeOf(lastOf(meta.at));
        const position = meta.after ? 'afterend' : 'beforebegin';
        for (const node of data) {
            $node.insertAdjacentElement(position, this.renderNode(node));
        }
    }

    [actions.REPLACE_NODES] ({ data, meta }) {
        const $node = this.$nodeOf(lastOf(meta.at));
        for (const node of data) {
            $node.insertAdjacentElement('beforebegin', this.renderNode(node));
        }

        for (let count = 1; count < meta.length; count++) {
            this.removeNode(sibling($node));
        }

        if (meta.length > 0) {
            this.removeNode($node);
        }
    }

    [actions.REMOVE_NODES] ({ data, meta: { isBackwards }}) {
        let node = this.$nodeOf(data.anchor);
        const end = this.$nodeOf(data.focus);
        while (node && node !== end) {
            const next = sibling(node, !isBackwards);
            this.removeNode(node);
            node = next;
        }
        this.removeNode(node);
    }

    [actions.EXTEND_NODE] ({ data, meta }) {
        const root = this.$nodeOf(lastOf(meta.at));
        for (const $node of [...root.children]) {
            this.removeNode($node);
        }
        root.appendChild(this.renderNode(data[0]));
    }

    [actions.CAST_NODE] ({ data, meta }) {
        const node = this.renderNode(data);
        const orig = this.$nodeOf(lastOf(meta.at));
        orig.parentElement.replaceChild(node, orig);
    }

    [actions.REPLACE_TEXT] (operation) {
        const { data, from, meta } = operation;
        if (!this.matchOperation(operation, from)) {
            const point = this.$pointOf(from, meta.offset);
            const text = from.text === VOID_CHAR ? '' : from.text;
            point.node.textContent = text.slice(0, point.offset) + data
                + text.slice(point.offset + meta.length) || VOID_CHAR;
        }
    }
}
