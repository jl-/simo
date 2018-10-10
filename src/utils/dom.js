import { KEY_ATTR, nodeTypes } from '../meta/node';

export function h (tag, attrs, text) {
    const el = document.createElement(tag);

    if (text) {
        el.textContent = text;
    }
    if (attrs) {
        for (const name of Object.keys(attrs)) {
            el.setAttribute(name, attrs[name]);
        }
    }

    return el;
}

export function getAttr (el, attr) {
    return el && typeof el.getAttribute === 'function' ?
        el.getAttribute(attr) : null;
}

export function keyAttrs (key, attrs, name = KEY_ATTR) {
    if (!key) return attrs;
    const attr = { [name]: key };
    return attrs ? { ...attrs, ...attr } : attr;
}

export const getKey = (el, attr = KEY_ATTR) => getAttr(el, attr);

export function edgeText (node, tail = false) {
    const stack = [node];
    while (node = stack.shift()) {
        if (node.nodeType === nodeTypes.TEXT) {
            break;
        }
        const nodes = [...node.childNodes];
        stack.unshift(...(tail ? nodes.reverse() : nodes));
    }
    return node;
}

export function sibling (node, after = true, filter = getKey) {
    const next = () => after ? node.nextSibling : node.previousSibling;
    while ((node = next()), node && !filter(node));
    return node;
}
