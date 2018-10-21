import Node from '../models/node';
import * as status from '../meta/status';
import * as actions from '../meta/actions';
import { lastOf } from '../utils/logic';
import { VOID_CHAR, positions } from '../meta/node';
import { sibify, edgeLeafOf, adjacentLeafOf } from '../utils/node';

export default class State {
    constructor ({ nodes = []}, schema, rekey) {
        this.schema = schema;
        this.status = new Map();
        this.nodes = nodes.map(s => new Node(s, rekey));
        this.schema.normalize(this.nodes);
    }

    clone (deep = false, rekey) {
        const data = deep ? this : {};
        const state = new this.constructor(data, this.schema, rekey);
        state.nodes = deep ? state.nodes : [...this.nodes];
        return state;
    }

    commit (operation) {
        if (typeof this[operation.type] === 'function') {
            this[operation.type](operation.data, operation.meta, operation);
        }
    }

    indexOf (key) {
        return this.nodes.findIndex(n => n.key === key);
    }

    nodesOf (keys) {
        return Node.prototype.nodesOf.call(this, keys);
    }

    find (keys) {
        return Node.prototype.find.call(this, keys);
    }

    edgeLeafOf (keys, options) {
        return edgeLeafOf(this.nodesOf(keys), options);
    }

    adjacentLeafOf (keys, options) {
        return adjacentLeafOf(this, this.nodesOf(keys), options);
    }

    stashNode (keys) {
        let node = this;

        for (const key of keys) {
            const index = node.indexOf(key);
            // if (this.status.get(key) !== status.STASHED) {
                node.nodes[index] = node.nodes[index].clone(false);
                // this.status.set(key, status.STASHED);
            // }
            node = node.nodes[index];
        }

        return node && node.key === lastOf(keys) ? node : null;
    }

    compareNodePosition (akeys, bkeys) {
        const keys = sibify(akeys, bkeys);
        if (keys.solo) return positions.EQUAL;

        const nodes = this.nodesOf(keys.root);
        const root = nodes && nodes[nodes.length - 1] || this;
        return root.indexOf(keys.a[0]) > root.indexOf(keys.b[0]) ?
            positions.AFTER : positions.BEFORE;
    }

    [actions.REPLACE_TEXT] (data, { at, offset, length }) {
        const node = this.stashNode(at);
        const text = node.text.replace(VOID_CHAR, '');
        node.text = text.slice(0, offset) + data + text.slice(offset + length);
    }

    [actions.REPLACE_NODES] (data, { at, length }) {
        const node = this.stashNode(at.slice(0, -1));
        const index = node.indexOf(at[at.length - 1]);
        if (index !== -1) {
            node.nodes.splice(index, length, ...data);
        }
    }

    [actions.INSERT_NODES] (data, { at, after }) {
        const node = this.stashNode(at.slice(0, -1));
        const index = node.indexOf(at[at.length - 1]);
        if (index !== -1) {
            node.nodes.splice(index + (after ? 1 : 0), 0, ...data);
        }
    }

    [actions.REMOVE_NODES] ({ root, anchor, focus }, { isBackwards }) {
        const node = this.stashNode(root);
        const anchorIndex = node.indexOf(anchor);
        const focusIndex = node.indexOf(focus);
        const index = isBackwards ? focusIndex : anchorIndex;
        node.nodes.splice(index, Math.abs(focusIndex - anchorIndex) + 1);
    }

    [actions.EXTEND_NODE] (nodes, meta) {
        let node = this.stashNode(meta.at);
        for (const n of nodes) {
            node.nodes = [node = n];
        }
    }

    [actions.CAST_NODE] (casted, { at }) {
        const node = this.stashNode(at.slice(0, -1));
        const index = node.indexOf(lastOf(at));
        node.nodes[index] = casted;
    }
}
