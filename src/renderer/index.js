import * as actions from '../meta/actions';
import { lastOf } from '../utils/logic';
import { VOID_CHAR } from '../meta/node';
import { mergeRules } from './options';
import { h, getKey, keyAttrs, sibling, edgeText } from '../utils/dom';

export default class Renderer {
    constructor ($el, options = {}) {
        this.$el = $el;
        this.nodes = Object.create(null);
        this.rules = mergeRules(options.rules);
    }

    render (state, change) {
        if (!change) {
            for (const node of state.nodes) {
                this.$el.appendChild(this.renderNode(node));
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

    renderNode (node, deep = true) {
        const rules = this.rules;
        const attrs = keyAttrs(node.key, node.data);
        if (typeof rules[node.type] === 'function') {
            return rules[node.type](node, attrs, this);
        }

        const $node = h(rules[node.type] || node.type, attrs);
        if (!node.nodes || !node.nodes.length) {
            const $leaf = Array.isArray(node.formats) ?
                node.formats.reduce(($parent, child) => {
                    return $parent.appendChild(h(rules[child] || child));
                }, $node) : $node;

            if (node.text) {
                $leaf.textContent = node.text;
            }
        } else if (deep) {
            for (const child of node.nodes) {
                $node.appendChild(this.renderNode(child));
            }
        }

        return $node;
    }

    removeNode (node) {
        const instance = this.nodes[`$${node.key}`];
        if (instance) {
            delete this.nodes[`$${node.key}`];
            if (typeof instance.destroy === 'function') {
                instance.destroy(this);
            }
        }

        const el = this.$nodeOf(node.key);
        if (el && el.parentElement) {
            el.parentElement.removeChild(el);
        }
    }

    $nodeOf (key) {
        return this.$el.querySelector(`[data-key='${key}']`);
    }

    mapSelection ({ native }) {
        const mapPoint = (node, offset) => {
            const keys = [];
            while (node && node !== this.$el) {
                const key = getKey(node);
                if (key) keys.unshift(key);
                node = node.parentElement;
            }
            return { keys, offset };
        };
        return {
            focus:  mapPoint(native.focusNode, native.focusOffset),
            anchor: mapPoint(native.anchorNode, native.anchorOffset)
        };
    }

    setSelection (selection) {
        const mapPoint = point => {
            const node = edgeText(this.$nodeOf(lastOf(point.keys)));
            const offset = point.offset < 0 ? Infinity : point.offset;
            return { node, offset: Math.min(offset, node.textContent.length) };
        };
        selection.select(mapPoint(selection.anchor), mapPoint(selection.focus));
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
            $node.parentElement.removeChild(sibling($node));
        }

        if (meta.length > 0) {
            $node.parentElement.removeChild($node);
        }
    }

    [actions.REMOVE_NODES] ({ data, meta: { isBackwards }}) {
        let node = this.$nodeOf(data.anchor);
        const end = this.$nodeOf(data.focus);
        while (node && node !== end) {
            const next = sibling(node, !isBackwards);
            node.parentElement.removeChild(node);
            node = next;
        }
        node.parentElement.removeChild(node);
    }

    [actions.EXTEND_NODE] ({ data, meta }) {
        const root = this.$nodeOf(lastOf(meta.at));
        for (const el of [...root.children]) {
            root.removeChild(el);
        }
        root.appendChild(this.renderNode(data[0]));
    }

    [actions.CAST_NODE] ({ data, meta }) {
        const node = this.renderNode(data);
        const orig = this.$nodeOf(lastOf(meta.at));
        orig.parentElement.replaceChild(node, orig);
    }

    [actions.REPLACE_TEXT] ({ data, from, meta }) {
        const $node = edgeText(this.$nodeOf(lastOf(meta.at)));
        const text = from.text === VOID_CHAR ? '' : from.text;
        $node.textContent = text.slice(0, meta.offset) + data
            + text.slice(meta.offset + meta.length) || VOID_CHAR;
    }
}
