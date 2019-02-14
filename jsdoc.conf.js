// eslint-disable-next-line no-undef
module.exports = {
	plugins: [
		'node_modules/jsdoc-vuejs',
	],
	recurseDepth: 10,
	source:       {
		includePattern: 'src(\\/|\\\\).+\\.(js(doc|x)?|vue)$',
		excludePattern: '((^|\\/|\\\\)_|node_modules|tests)',
	},
	sourceType: 'module',
	tags:       {
		allowUnknownTags: true,
		dictionaries:     [
			'jsdoc',
			'closure',
		],
	},
	templates: {
		cleverLinks:    false,
		monospaceLinks: false,
		systemName:     'VueJS-Datatable',
		systemSummary:  'A Vue.js component for filterable and paginated tables.',
		systemColor:    '#2779bd',
		/*
		systemLogo:           "{string}",
		footer:               "{string}",
		copyright:            "{string}",
		includeDate:          "{boolean}",
		dateFormat:           "{string}",
		inlineNav:            "{boolean}",
		inverseNav:           "{boolean}",
		navMembers:           "{array.<object>}",
		linenums:             "{boolean}",
		showTableOfContents:  "{boolean}",
		showAccessFilter:     "{boolean}",
		analytics:            "{object}",
		collapseSymbols:      "{boolean}",
		methodHeadingReturns: "{boolean}",
		outputSourceFiles:    "{boolean}",
		outputSourcePath:     "{boolean}",
		sort:                 "{boolean|string}",
		search:               "{boolean}",
		favicon:              "{string}",
		*/
		stylesheets:    [],
		scripts:        [
			'https://cdnjs.cloudflare.com/ajax/libs/vue/2.6.4/vue.min.js',
			'./assets/vuejs-datatable.js',
		],
		default: {
			staticFiles: {
				include: [ './tutorials/assets' ],
			},
		},
	},
	opts: {
		template:    './node_modules/foodoc/template',
		encoding:    'utf8',
		destination: './docs/',
		recurse:     true,
		readme:      './README.md',
		tutorials:   './tutorials/builds',
	},
};
