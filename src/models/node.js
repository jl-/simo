import { uniq } from '../utils/string';
import { lastOf } from '../utils/logic';
import { VOID_CHAR } from '../meta/node';

export default class Node {
    constructor (data = {}, rekey = true) {
        this.type = data.type;
        this.data = data.data;
        this.meta = data.meta;
        this.text = data.text || VOID_CHAR;
        this.formats = data.formats;
        this.key = data.key && !rekey ? data.key : uniq(data.key);
        this.nodes = data.nodes && data.nodes.length ?
            data.nodes.map(s => new Node(s, rekey)) : null;
    }

    clone (deep = true, rekey = false, props) {
        const data = deep || !this.nodes ? this : { ...this, nodes: []};
        const cloned = new this.constructor(data, rekey);
        // TODO: deep clone data,meta,formats
        cloned.nodes = !deep && this.nodes ? [...this.nodes] : cloned.nodes;
        return props ? Object.assign(cloned, props) : cloned;
    }

    split (offset) {
        const after = this.clone(false, true);
        const before = this.clone(false, true);

        if (this.nodes && this.nodes.length) {
            after.nodes = this.nodes.slice(offset);
            before.nodes = this.nodes.slice(0, offset);
        } else {
            after.text = this.text.slice(offset) || VOID_CHAR;
            before.text = this.text.slice(0, offset) || VOID_CHAR;
        }

        return [before, after];
    }

    indexOf (key) {
        if (!key || !this.nodes) return -1;
        return this.nodes.findIndex(n => n.key === key);
    }

    nodesOf (keys) {
        let node = this;
        const nodes = [];
        for (const key of keys) {
            if (!node || !node.nodes) break;
            nodes.push(node = node.nodes.find(n => n.key === key));
        }
        return node && node.key === lastOf(keys) ? nodes : null;
    }

    find (keys) {
        if (!keys.length) return this;
        const nodes = this.nodesOf(keys);
        return nodes && nodes[nodes.length - 1] || null;
    }
}
