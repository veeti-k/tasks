/** @type {import('eslint/lib/shared/types').ConfigData} */
module.exports = {
	root: true,
	parser: "@typescript-eslint/parser",
	parserOptions: {
		ecmaVersion: 2020,
		sourceType: "module",
	},
	plugins: ["unicorn"],
	extends: [
		"eslint:recommended",
		"plugin:prettier/recommended",
		"next",
		"plugin:@typescript-eslint/recommended",
	],
	rules: {
		"@typescript-eslint/consistent-type-imports": [
			"error",
			{
				prefer: "type-imports",
				fixStyle: "inline-type-imports",
			},
		],
	},
	ignorePatterns: ["dist", "eslint.config.cjs", "prettier.config.cjs"],
};
