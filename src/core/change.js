import Node from '../models/node';
import Operation from './operation';
import * as actions from '../meta/actions';
import { lastOf } from '../utils/logic';
import { sibify, keysOf, isEdgeBranch, adjacentLeafOf } from '../utils/node';

export default class Change {
    constructor (state, selection) {
        this.state = state.clone();
        this.operations = [];
        this.selection = selection;
    }

    get pristine () {
        return this.operations.length === 0;
    }

    digestSelection (meta) {
        this.selection.digest(this.state, meta.anchor, meta.focus);
    }

    commit (operation) {
        operation.to = this.state.commit(operation);
        this.operations.push(operation);
        this.selection.update(this.state, operation);
        return operation;
    }

    [actions.SELECT] (anchor, focus) {
        return this.commit(new Operation({
            type: actions.SELECT, anchor, focus
        }));
    }

    [actions.REPLACE_TEXT] ({ keys, offset }, data, length = 0) {
        const from = this.state.find(keys);
        return this.commit(new Operation({
            type: actions.REPLACE_TEXT, from,
            data, meta: { at: keys, offset, length },
            focus: { keys, offset: offset + data.length }
        }));
    }

    [actions.REPLACE_NODES] ({ at, length = 1, ...options }) {
        const meta = { at, length };
        options.type = actions.REPLACE_NODES;
        options.meta = options.meta ? { ...options.meta, ...meta } : meta;
        return this.commit(new Operation(options));
    }

    [actions.INSERT_NODES] ({ at, after, ...options }) {
        const meta = { at, after };
        options.type = actions.INSERT_NODES;
        options.meta = options.meta ? { ...options.meta, ...meta } : meta;
        return this.commit(new Operation(options));
    }

    [actions.SPLIT_NODE] ({ keys, nodes, offset }, depth = 0) {
        let [before, after] = nodes[0].split(offset);

        const at = keys.slice(0, keys.length - depth);
        const akeys = at.slice(0, -1).concat(before.key);
        const fkeys = at.slice(0, -1).concat(after.key);

        const fnodes = nodes.slice(0, depth + 1);
        for (let i = 1; i < fnodes.length; i++) {
            const node = fnodes[i];
            const index = node.nodes.indexOf(fnodes[i - 1]);

            const [fbefore, fafter] = node.split(index);
            fbefore.nodes.push(before); fafter.nodes[0] = after;

            before = fbefore; after = fafter;
            akeys.splice(akeys.length - i, 0, before.key);
            fkeys.splice(fkeys.length - i, 0, after.key);
        }

        return this[actions.REPLACE_NODES]({
            at, length: 1,
            data: [before, after],
            anchor: { keys: akeys },
            focus: { keys: fkeys },
            initiator: actions.SPLIT_NODE
        });
    }

    [actions.REMOVE_NODES] (anchor, focus, isBackwards) {
        const nodesOf = keys => this.state.nodesOf(keys);
        const atomicLeafOf = nodes => this.state.schema.atomicLeafOf(nodes);
        const toEdgeNodes = (keys, nodes, rootLength, tail) => {
            if (isEdgeBranch(nodes.slice(rootLength), tail)) {
                return atomicLeafOf(nodes.slice(0, rootLength + 1));
            } else {
                const index = lastOf(nodes, 2).indexOf(lastOf(nodes).key);
                const op = this[actions.SPLIT_NODE]({
                    keys: keys.slice(0, -1),
                    offset: index + (tail ? 1 : 0),
                    nodes: nodes.slice(0, -1).reverse()
                }, keys.length - rootLength - 2);
                const ks = keys.slice(0, rootLength).concat(op.data[tail ? 0 : 1].key);
                return atomicLeafOf(this.state.nodesOf(ks));
            }
        };

        let akeys = anchor.keys, fkeys = focus.keys;
        let anodes = nodesOf(akeys), fnodes = nodesOf(fkeys);
        let keys = sibify(akeys, fkeys);

        anodes = toEdgeNodes(akeys, anodes, keys.root.length, isBackwards);
        fnodes = toEdgeNodes(fkeys, fnodes, keys.root.length, !isBackwards);
        keys = sibify(akeys = keysOf(anodes), fkeys = keysOf(fnodes));

        if (keys.root.length) {
            const nodes = anodes[keys.root.length - 1].nodes;
            if (nodes[0].key === (isBackwards ? keys.b[0] : keys.a[0]) &&
                lastOf(nodes).key === (isBackwards ? keys.a[0] : keys.b[0])) {
                anodes = fnodes = atomicLeafOf(anodes.slice(0, keys.root.length));
                keys = sibify(akeys = keysOf(anodes), fkeys = keysOf(fnodes));
            }
        }
        akeys = keysOf(adjacentLeafOf(this.state, anodes, { after: isBackwards }));
        fkeys = keysOf(adjacentLeafOf(this.state, fnodes, { after: !isBackwards }));

        return this.commit(new Operation({
            type: actions.REMOVE_NODES,
            meta: { isBackwards },
            data: { root: keys.root, anchor: keys.a[0], focus: keys.b[0] },
            anchor: { keys: akeys }, focus: { keys: fkeys }
        }));
    }

    [actions.CAST_NODE] (at, node, attrs = {}) {
        return this.commit(new Operation({
            type: actions.CAST_NODE, meta: { at },
            data: Object.assign(node.clone(false), attrs)
        }));
    }

    [actions.EXTEND_NODE] (at, node, ...slice) {
        const coerce = v => v.type ? v : { type: v };
        const nodes = slice.reduce((res, v) => {
            const n = new Node(coerce(v));
            if (res.length) lastOf(res).nodes = [n];
            return res.concat(n);
        }, []);
        lastOf(nodes).nodes = [...node.nodes];
        return this.commit(new Operation({
            type: actions.EXTEND_NODE,
            meta: { at }, data: nodes
        }));
    }
}
