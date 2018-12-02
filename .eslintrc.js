module.exports = {
    extends: [
        'eslint:recommended'
    ],
    parserOptions: {
        parser: 'babel-eslint',
        ecmaVersion: 9,
        sourceType: 'module'
    },
    env: {
        es6: true,
        node: true,
        browser: true
    },
    globals: {
        jest: true,
        test: true,
        expect: true
    }
};
