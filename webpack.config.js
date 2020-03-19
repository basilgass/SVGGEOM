const path = require('path');

module.exports = {
    entry: './src/main.ts',
    devtool: 'inline-source-map',
    mode: 'development',
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_module/,
            },
        ],
    },
    resolve: {
        extensions: ['.tsx','.ts', '.js'],
    },
    output: {
        filename: 'geompi.js',
        path: path.resolve(__dirname, 'dist'),
    },
};