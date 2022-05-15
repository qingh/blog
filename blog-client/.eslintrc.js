module.exports = {
    "env": {
        "node": true,
        "browser": true,
        "commonjs": true,
        "es6": true,
        "jquery": true
    },
    "extends": "eslint:recommended",
    "globals": {
        "layer": true,
        "laypage": true
    },
    "parserOptions": {
        "sourceType": "module",
        "ecmaVersion": 2017
    },
    "rules": {
        "indent": [
            "error",
            "tab"
        ],
        "linebreak-style": [
            "error",
            "unix"
        ],
        /* "quotes": [
            "error",
            "single"
        ], */
        "semi": [
            "error",
            "always"
        ]
    }
};