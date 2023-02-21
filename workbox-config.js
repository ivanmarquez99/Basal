module.exports = {
	globDirectory: '.',
	globPatterns: [
		'**/*.{html,md,js}'
	],
	swDest: 'sw.js',
	ignoreURLParametersMatching: [
		/^utm_/,
		/^fbclid$/
	]
};