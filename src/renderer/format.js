import { renderModes } from '../meta/node';
import { h, keyAttrs, setAttrs } from '../utils/dom';

export default class Format {
    constructor (renderer, options = {}) {
        this.active = false;
        this.scoped = false;
        this.renderer = renderer;

        Object.assign(this, typeof options === 'string' ? null : options);
        const tag = typeof options === 'string' && options || options.tag;
        this.tag = typeof this.tag === 'function' ? this.tag : () => tag;
    }

    render (node, mode = renderModes.RECURSIVE) {
        return typeof this[mode] === 'function' ? this[mode](node) : null;
    }

    [renderModes.TAG] (node) {
        return h(this.tag(node));
    }

    [renderModes.SKELETON] (node) {
        const el = this[renderModes.TAG](node);
        return setAttrs(el, keyAttrs(node.key, node.attrs));
    }

    [renderModes.LEAF] (node) {
        const $node = this[renderModes.SKELETON](node);

        const $leaf = Array.isArray(node.formats) ?
            node.formats.reduce(($parent, child) => {
                return $parent.appendChild(
                    this.renderer.renderNode(child, renderModes.TAG)
                );
            }, $node) : $node;

        if (node.text) {
            $leaf.textContent = node.text;
        }

        return $node;
    }

    [renderModes.RECURSIVE] (node) {
        if (!node.nodes || !node.nodes.length) {
            return this[renderModes.LEAF](node);
        }

        const mode = renderModes.RECURSIVE;
        const $node = this[renderModes.SKELETON](node);
        for (const child of node.nodes) {
            const $cnode = this.renderer.renderNode(child, mode);
            if ($cnode) $node.appendChild($cnode);
        }
        return $node;
    }

    update (selection) {
        const { isCollapsed, focus } = selection;
        if (isCollapsed && focus.nodes.length) {
            const formats = focus.nodes[0].formats;
            this.active = formats && formats.indexOf(this.name) !== -1;
        } else {
            this.active = false;
        }
        this.$control.classList[this.active ? 'add' : 'remove']('toolbar__icon--active');
    }
}
