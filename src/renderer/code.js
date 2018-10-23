import prism from 'prismjs';
import Format from './format';
import * as actions from '../meta/actions';
import { nodeTypes, VOID_CHAR } from '../meta/node';
import { h, keyAttrs, sibling, edgeText } from '../utils/dom';
import 'prismjs/themes/prism.css';

window.prism = prism;

export const Options = {
    tag: 'code',
    language: 'javascript'
};

export class Code extends Format {
    isInline (node) {
        return !node.meta || node.meta.inline !== false;
    }

    pointOf ($node, offset, node) {
        const $root = this.renderer.$nodeOf(node.key);
        while ($node && $node !== $root) {
            let $n = $node;
            while ($n = sibling($n, false, null)) {
                offset += $n.textContent.length;
                if ($n.tagName === 'DIV') offset += 1;
            }
            $node = $node.parentElement;
        }
        return { offset };
    }

    $pointOf (node, _offset, $node) {
        let $n, $nodes = [$node], line;
        let offset = _offset < 0 ? $node.textContent.length : _offset;
        while ($n = $nodes.shift()) {
            if ($n.nodeType === nodeTypes.COMMENT) continue;
            if ($n.tagName === 'DIV') {
                if (line) {
                    offset -= 1;
                } else {
                    line = true;
                }
            }
            if ($n.nodeType === nodeTypes.TEXT) {
                if (offset <= $n.textContent.length) {
                    break;
                } else {
                    offset -= $n.textContent.length;
                }
            }
            if ($n.childNodes.length) $nodes.unshift(...$n.childNodes);
        }
        if (!$n) {
            $n = edgeText($node, true);
            offset = $n.textContent.length;
        }

        return { node: $n, offset: Math.min(offset, $n.textContent.length) };
    }

    grammerOf (node) {
        const lang = node.meta && node.meta.language;
        return prism.languages[lang || this.language];
    }

    render (node, mode, context) {
        if (this.isInline(node)) {
            return super.render(node, mode, context);
        }

        const $code = h(this.tag());
        const grammer = this.grammerOf(node);
        $code.appendChild(h('div'));
        for (const token of prism.tokenize(node.text, grammer)) {
            if (/^\n+$/.test(token)) {
                let count = token.length;
                while (count--) {
                    $code.appendChild(h('div'));
                }
                continue;
            }
            const $line = $code.lastChild;
            if (typeof token === 'string') {
                $line.appendChild(h('span', null, token));
            } else {
                $line.appendChild(h('span', { class: `token ${token.type}` }, token.content));
            }
        }
        for (const $line of [...$code.childNodes]) {
            if (!$line.lastChild) {
                $line.appendChild(h('span', null, VOID_CHAR));
            }
        }

        const $pre = h('pre', keyAttrs(node.key, node.attrs));
        $pre.appendChild($code);
        return $pre;
    }

    [actions.REPLACE_TEXT] (operation, node) {
        const $node = this.renderer.$nodeOf(node.key);
        $node.replaceWith(this.render(node));
    }
}

export default { ...Options, Ctor: Code };
