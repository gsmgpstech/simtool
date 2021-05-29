module.exports = {
    parser: '@typescript-eslint/parser',
    parserOptions: {
        project: './tsconfig.json',
        ecmaVersion: 2018,
        sourceType: 'module'
    },
    rules: {
        '@typescript-eslint/explicit-function-return-type': 'off',
        '@typescript-eslint/no-floating-promises': 'error',
        '@typescript-eslint/no-empty-interface': 'warn',
        '@typescript-eslint/no-explicit-any': 'warn',
        '@typescript-eslint/no-namespace': 'off',
        '@typescript-eslint/naming-convention': 'warn',
        'no-use-before-define': 'warn',
        '@typescript-eslint/no-use-before-define': [
            'error',
            { functions: false, classes: false, enums: false, typedefs: false },
        ],
        '@typescript-eslint/triple-slash-reference': 'warn',
        '@typescript-eslint/ban-types': [
            'error',
            {
                types: {
                    object: false,
                },
            },
        ],
    },
    extends: ['plugin:@typescript-eslint/recommended'],
};
