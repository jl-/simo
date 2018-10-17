import test from 'tupe';
import { uniq } from '../../src/utils/string';

test('uniq', t => {
    t(uniq('a') === 'a');

    let s = uniq('a');
    t(s && s !== 'a');
    t(typeof s === 'string');

    uniq.omit('b');
    s = uniq('b');
    t(s && s !== 'b');
    t(typeof s === 'string');

    s = uniq('123');
    t(s && s !== '123');
    t(typeof s === 'string');

    s = uniq();
    t(s && typeof s === 'string');
});
