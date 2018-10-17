import test from 'tupe';
import { keysOf, sibify, edgeLeafOf } from '../../src/utils/node';

test('keysOf', t => {
    t(keysOf() === void 0);
    t(keysOf(null) === null);
    t.deepEqual(keysOf([]), []);
    t.deepEqual(keysOf(['a']), [void 0]);
    t.deepEqual(keysOf([{ key: 'a' }]), ['a']);
});

test('sibify', t => {
    let res;

    // empty
    res = sibify([], []);
    t(res.solo);
    t.deepEqual(res.root, []);
    t.deepEqual(res.a, []);
    t.deepEqual(res.b, []);

    // preserve leaf
    res = sibify(['a'], ['a']);
    t(res.solo);
    t.deepEqual(res.root, []);
    t.deepEqual(res.a, ['a']);
    t.deepEqual(res.b, ['a']);

    //
    res = sibify(['a'], ['b']);
    t(!res.solo);
    t.deepEqual(res.root, []);
    t.deepEqual(res.a, ['a']);
    t.deepEqual(res.b, ['b']);

    res = sibify(['a', 'b'], ['a', 'c']);
    t(!res.solo);
    t.deepEqual(res.root, ['a']);
    t.deepEqual(res.a, ['b']);
    t.deepEqual(res.b, ['c']);
});
