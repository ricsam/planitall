requirejs.config
	
	baseUrl: 'lib'



	paths:
		'backbone': 'backbone/backbone'
		'underscore': 'backbone/underscore'
		'localstorage': 'backbone/backbone.localStorage'
		'jquery': 'jquery/jquery'

		'dotjs': 'doT.min'

		'dot': 'require/dot'


		'coffee-script': 'require/coffee-script'
		'cs': 'require/cs'

		'text': 'require/text'


		'jquery-private': 'no-conflict/jquery/nc'
		'backbone-private': 'no-conflict/backbone/nc'
		'underscore-private': 'no-conflict/underscore/nc'

		'app': '../scripts'
		'plugins': '../plugins'



	map:
		'*':
			'jquery': 'jquery-private'
			'backbone': 'backbone-private'
			'underscore': 'underscore-private'

		'jquery-private':
			'jquery': 'jquery'
		'backbone-private':
			'backbone': 'backbone'
		'underscore-private':
			'underscore': 'underscore'

	shim:

		'underscore':
			export: '_'

		'backbone':
			deps: ['underscore', 'jquery']
			export: 'Backbone'

		'localstorage': 
			deps: ['backbone']
			export: 'Backbone.LocalStorage'




requirejs ['cs!app/app']