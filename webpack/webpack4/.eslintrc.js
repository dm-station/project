module.exports = {
    root: true,
    parser: 'babel-eslint',
    parserOptions: {
        ecmaVersion: 2018,
        sourceType: 'module'
    },
    env: {
        browser: true,
        node: true,
        es6: true
    },
    // extends: "eslint:recommended",
    extends: "standard",
    "rules": {
        // 要求箭头函数的参数使用圆括号0=允许无圆括号箭头函数
        'arrow-parens': 0,
        // 强制 generator 函数中 * 号周围使用一致的空格
        'generator-star-spacing': 0,
        // 禁用 debugger
        'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0
    },
    globals: {
        "Atomics": "readonly",
        "SharedArrayBuffer": "readonly",
        SERVICE_URL:true
    }
};