const path = require("path");

module.exports = {
    entry: {
        main: "./src/index.js",
    },
    output: {
        filename: "bundle.js",
    },
    mode: "production",
    module: {
        rules: [
            {
                test: /\.css$/,
                use: ["style-loader", "css-loader"],
            },
            { test: /\.js$/, use: ["babel-loader"] },
        ],
    },
    devServer: {
        static: {
            directory: path.resolve(__dirname, "dist"),
        },
    },
};
