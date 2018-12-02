module.exports = {
    presets: ['@babel/env', 'power-assert'],
    plugins: [
        '@babel/plugin-transform-runtime',
        '@babel/plugin-proposal-function-bind',
        '@babel/plugin-proposal-class-properties',
        '@babel/plugin-proposal-export-default-from',
        ['babel-plugin-espower', {
            'embedAst': true,
            'patterns': [
                't(value, [message])',
                't.ok(value, [message])',
                't.equal(actual, expected, [message])',
                't.deepEqual(actual, expected, [message])',
                't.notEqual(actual, expected, [message])',
                't.strictEqual(actual, expected, [message])',
                't.notStrictEqual(actual, expected, [message])',
                't.notDeepEqual(actual, expected, [message])',
                't.deepStrictEqual(actual, expected, [message])',
                't.notDeepStrictEqual(actual, expected, [message])',
                't.throws(block, [error], [message])'
            ]
        }]
    ]
    env: {
        test: {
            plugins: [
                ['istanbul', {
                    'include': [
                        'src/**/*.js',
                        'test/**/*.js'
                    ]
                }]
            ]
        }
    }
};
