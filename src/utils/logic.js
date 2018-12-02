// Longest Leading Common Subsequence
export function llcs (a, b) {
    let index = 0;
    const max = Math.min(a.length, b.length);
    while (index < max && a[index] === b[index]) {
        index += 1;
    }
    return a.slice(0, index);
}

export function lastOf (arr, nth = 1) {
    return arr && arr[arr.length - nth] || void 0;
}

export function defaultTo (init, given, coerce = v => v) {
    return typeof given === 'undefined' ? init : coerce(given);
}
