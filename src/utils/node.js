import { llcs, lastOf } from './logic';

export function sibify (a, b) {
    const root = llcs(a, b);
    const solo = root.length * 2 === a.length + b.length;
    const sliceIndex = solo ? -1 : root.length;

    return {
        solo, root: root.slice(0, sliceIndex),
        a: a.slice(sliceIndex), b: b.slice(sliceIndex)
    };
}

export function edgeLeafOf (nodes, options = {}) {
    const result = nodes && [].concat(nodes);
    const { tail = false, linked = Array.isArray(nodes) } = options;
    let node = result && result[result.length - 1];
    while (node && node.nodes && node.nodes.length) {
        const index = tail ? node.nodes.length - 1 : 0;
        result.push(node = node.nodes[index]);
    }
    return node ? (linked ? result : node) : null;
}

export function adjacentLeafOf (state, nodes, options = {}) {
    const result = [state].concat(nodes);
    const { after = true, linked = true, filter } = options;
    const nextIndex = index => index + (after ? 1 : -1);
    const childOf = node => node.nodes[after ? 0 : node.nodes.length - 1];

    let node = result.pop(), parent, found;
    while (!found && (parent = result.pop())) {
        let index = parent.indexOf(node.key);
        while (!found && ((index = nextIndex(index)),
            index >= 0 && index < parent.nodes.length)) {
            node = parent.nodes[index];
            result.push(parent, node);
            while (node.nodes && childOf(node)) {
                result.push(node = childOf(node));
            }
            found = typeof filter === 'function' ? filter(node) : true;
        }
        node = parent;
    }
    return found ? (linked ? result.slice(1) : result.pop()) : null;
}

export function isEdgeBranch (nodes, tail = false) {
    let index = 0, endIndex = nodes.length - 1;
    const childOf = node => tail ? lastOf(node.nodes) : node.nodes[0];
    while (index < endIndex && childOf(nodes[index]) === nodes[index + 1]) index++;
    return index === endIndex;
}

export const keysOf = nodes => nodes && nodes.map(n => n.key);

export function adjacentPoint (state, nodes, after) {
    const prev = adjacentLeafOf(state, nodes, { after });
    const offset = after ? 0 : lastOf(prev).text.length;
    return { keys: keysOf(prev), offset };
}
