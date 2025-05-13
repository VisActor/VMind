const path = require('path');
const baseJestConfig = require('@internal/jest-config/jest.base');

module.exports = {
	...baseJestConfig,
	moduleNameMapper: {
		...baseJestConfig.moduleNameMapper
	},
	roots: [
		path.resolve(__dirname, 'src')
	],
	testMatch: [
		'**/tests/**/*.test.[jt]s'
	],
	transform: {
		'^.+\\.ts?$': 'ts-jest'
	},
};
