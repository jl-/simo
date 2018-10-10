export const uniq = function () {
    const seed = 2 ** 24;
    const history = Object.create(null);
    const memorize = key => (history[key] = true, key);

    function generate (k) {
        let key = typeof k === 'string' ? k : '';
        while (!key || !isNaN(+key) || history[key]) {
            key = Math.floor(Math.random() * seed).toString(32);
        }
        return memorize(key);
    }
    generate.omit = (...list) => list.map(memorize);

    return generate;
}();
