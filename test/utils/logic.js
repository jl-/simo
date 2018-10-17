import test from 'tupe';
import { llcs, lastOf, defaultTo} from '../../src/utils/logic';

test('llcs: array', t => {
    t.deepEqual(llcs([], ['a']), []);
    t.deepEqual(llcs(['a'], ['a', 'b', 'c']), ['a']);
    t.deepEqual(llcs(['a', 'c'], ['a', 'b', 'c']), ['a']);
    t.deepEqual(llcs(['a', 'b', 'c', 'd'], ['a', 'b', 'd']), ['a', 'b']);
});

test('llcs: string', t => {
    t(llcs('', 'a') === '');
    t(llcs('a', 'abc') === 'a');
    t(llcs('abc', 'bc') === '');
    t(llcs('abc', 'ab') === 'ab');
    t(llcs('abd', 'abc') === 'ab');
});

test('lastOf', t => {
    t(lastOf([1, 2, 3]) === 3);
    t(lastOf([1, 2, 3], 2) === 2);
    t(lastOf([1, 2, 3], 3) === 1);
    t(lastOf(null, 4) === void 0);
    t(lastOf([1, 2, 3], 4) === void 0);
});

test('defaultTo', t => {
    t(defaultTo(1, '') === '');
    t(defaultTo(1, null) === null);
    t(defaultTo(1, void 0) === 1);

    t(defaultTo(1, '', v => 'x') === 'x');
});
