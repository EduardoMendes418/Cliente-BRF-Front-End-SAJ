module.exports = {
	parser: "@typescript-eslint/parser",
	extends: [
		"plugin:@typescript-eslint/recommended",
		"plugin:react/recommended",
	],
	parserOptions: {
		ecmaVersion: 2020,
		sourceType: "module",
		ecmaFeatures: {
			jsx: true,
		},
	},
	rules: {
		"react/react-in-jsx-scope": "off",
		"@typescript-eslint/explicit-function-return-type": "off",
		'@typescript-eslint/no-unused-vars': 'off',
		'@typescript-eslint/no-explicit-any': 'off',
		'@typescript-eslint/ban-types': 'warn',
    	'prefer-const': 'warn',
		'react/jsx-key': 'warn',
		'react/prop-types': 'warn',
		'@typescript-eslint/ban-ts-comment': 'warn',
		'react/no-unescaped-entities': 'warn',
		'@typescript-eslint/no-non-null-asserted-optional-chain': 'warn'
	},
	settings: {
		react: {
			version: "detect",
		},
	},
};
