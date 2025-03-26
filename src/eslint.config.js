const js = require('@eslint/js');
const tsParser = require('@typescript-eslint/parser');
const tsPlugin = require('@typescript-eslint/eslint-plugin');
const reactPlugin = require('eslint-plugin-react');
const reactHooksPlugin = require('eslint-plugin-react-hooks');
const reactNativePlugin = require('eslint-plugin-react-native');
const globals = require('globals');

module.exports = [
    {
        // Apply recommended config
        ...js.configs.recommended,

        // Specify file types to lint
        files: [
            '**/*.js',
            '**/*.jsx',
            '**/*.ts',
            '**/*.tsx'
        ],

        // Ignore specific directories and files
        ignores: [
            'node_modules/**',
            '.expo/**',
            'dist/**',
            'android/**',
            'ios/**',
            'web-build/**',
            '*.config.js',
            'babel.config.js',
            'metro.config.js'
        ],

        // Language options and parser
        languageOptions: {
            parser: tsParser,
            parserOptions: {
                ecmaFeatures: {
                    jsx: true,
                },
                ecmaVersion: 'latest',
                sourceType: 'module',
            },
            globals: {
                ...globals.browser,
                ...globals.node,
                ...globals.es2021,
            }
        },

        // Plugins
        plugins: {
            '@typescript-eslint': tsPlugin,
            'react': reactPlugin,
            'react-hooks': reactHooksPlugin,
            'react-native': reactNativePlugin
        },

        // Rules
        rules: {
            'react/react-in-jsx-scope': 'off',
            'react-native/no-inline-styles': 'warn',
            'no-console': ['warn', {allow: ['warn', 'error']}],
            '@typescript-eslint/no-unused-vars': ['error', {argsIgnorePattern: '^_'}],
            'react/prop-types': 'off',
            'react-hooks/rules-of-hooks': 'error',
            'react-hooks/exhaustive-deps': 'warn',
        },

        // React version detection
        settings: {
            react: {
                version: 'detect',
            },
        }
    }
];