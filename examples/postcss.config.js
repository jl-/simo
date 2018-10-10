module.exports = {
    modules: true,
    plugins: [
        require('postcss-preset-env')(),
        require('cssnano')({
            safe: true,
            autoprefixer: false,
            reduceIdents: false
        })
    ]
};
