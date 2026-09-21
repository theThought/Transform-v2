const { FlatCompat } = require('@eslint/eslintrc');
const js = require('@eslint/js');

const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
});

module.exports = [
    {
        ignores: [
            'node_modules/**',
            'eslint.config.cjs',
            '_example-pages/index.js',
            '_example-pages/index.css',
        ],
    },
    ...compat.config({
        env: {
            browser: true,
            es6: true,
            commonjs: true,
            node: true,
            jest: true,
        },
        parser: '@typescript-eslint/parser',
        extends: [
            'plugin:@typescript-eslint/recommended',
            'prettier',
            'plugin:storybook/recommended',
        ],
        parserOptions: {
            requireConfigFile: false,
            ecmaVersion: 2020,
            sourceType: 'module',
        },
        plugins: ['prettier'],
        rules: {
            'prettier/prettier': [
                'error',
                {
                    endOfLine: 'auto',
                },
            ],
            '@typescript-eslint/explicit-function-return-type': 1,
            '@typescript-eslint/no-explicit-any': 1,
            '@typescript-eslint/no-unused-expressions': [
                'error',
                { allowShortCircuit: true },
            ],
            'no-console': ['error', { allow: ['warn', 'error'] }],
            'lines-between-class-members': [
                'error',
                'always',
                { exceptAfterSingleLine: true },
            ],
        },
    }),
    {
        files: [
            'stories/**/*.{js,jsx,ts,tsx}',
            '.storybook/**/*.{js,jsx,ts,tsx}',
        ],
        rules: {
            '@typescript-eslint/explicit-function-return-type': 'off',
            '@typescript-eslint/no-explicit-any': 'off',
        },
    },
];
