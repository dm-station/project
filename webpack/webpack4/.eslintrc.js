module.exports = {
    root: true,
    "env": {
        "browser": true,
         node: true,
        "es6": true
    },
    "extends": "eslint:recommended",
    "globals": {
        "Atomics": "readonly",
        "SharedArrayBuffer": "readonly"
    },
    "parserOptions": {
        "ecmaVersion": 2018,
        "sourceType": "module"
    },
    "rules": {
        "no-multiple-empty-lines": [1, {"max": 1}],//空行最多不能超过2行
        "no-console": 0,//禁止使用console
    },
    parser: 'babel-eslint',
};