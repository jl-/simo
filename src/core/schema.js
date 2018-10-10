import { VOID_CHAR } from '../meta/node';

export default class Schema {
    constructor (options = {}) {
        this.blockTypes = options.blockTypes;
        this.inlineTypes = options.inlineTypes;
    }

    isBlock (node) {
        return this.blockTypes.indexOf(node.type) !== -1;
    }

    isInline (node) {
        return this.inlineTypes.indexOf(node.type) !== -1;
    }

    isEmpty (node) {
        if (node.nodes && node.nodes.length) {
            return node.nodes.every(n => this.isEmpty(n));
        }
        return !~'image|'.indexOf(`${node.type}|`) &&
            (!node.text || node.text === VOID_CHAR);
    }

    isFrozen (node) {
        return node.meta && Boolean(node.meta.frozen);
    }

    isAtomic (meta) {
        if (this.isInline(meta.node)) return !meta.isSolo;
        if (this.isBlock(meta.node)) return true;
        return !meta.parent;
    }

    normalize (nodes) {
        return nodes;
    }

    blockLeafOf (nodes, { forwards, linked = true } = {}) {
        let node, index = forwards ? nodes.length : -1;
        const next = () => nodes[index += (forwards ? -1 : 1)];

        while ((node = next()), node && !this.isBlock(node));

        if (!linked) return node;
        return forwards ? nodes.slice(0, index + 1) : nodes.slice(index);
    }

    atomicLeafOf (nodes, { forwards = true, linked = true } = {}) {
        let node, index = forwards ? nodes.length : -1;
        const nextIndex = index => index + (forwards ? -1 : 1);

        while ((index = nextIndex(index)), node = nodes[index]) {
            const parent = nodes[nextIndex(index)];
            const idx = parent ? parent.indexOf(node.key) : -1;
            const before = idx === -1 ? null : parent.nodes.slice(0, idx);
            const after = idx === -1 ? null : parent.nodes.slice(idx + 1);
            if (this.isAtomic({
                node, parent, before, after, index: idx,
                isSolo: (!before || !before.length) && (!after || !after.length)
            })) break;
        }

        if (!linked) return node;
        return forwards ? nodes.slice(0, index + 1) : nodes.slice(index);
    }
}
