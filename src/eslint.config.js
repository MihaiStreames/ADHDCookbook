import js from '@eslint/js';
import tsParser from '@typescript-eslint/parser';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import reactPlugin from 'eslint-plugin-react';
import reactHooksPlugin from 'eslint-plugin-react-hooks';
import reactNativePlugin from 'eslint-plugin-react-native';
import globals from 'globals';

export default [
    js.configs.recommended,
    {
        files: ['**/*.{js,jsx,ts,tsx}'],
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
        plugins: {
            'react': reactPlugin,
            'react-hooks': reactHooksPlugin,
            'react-native': reactNativePlugin,
            '@typescript-eslint': tsPlugin
        },
        rules: {
            'react/react-in-jsx-scope': 'off',
            'react-native/no-inline-styles': 'warn',
            'no-console': ['warn', {allow: ['warn', 'error']}],
            '@typescript-eslint/no-unused-vars': ['error', {argsIgnorePattern: '^_'}],
            'react/prop-types': 'off',
            'react-hooks/rules-of-hooks': 'error',
            'react-hooks/exhaustive-deps': 'warn',
        },
        settings: {
            react: {
                version: 'detect',
            },
        }
    },
];