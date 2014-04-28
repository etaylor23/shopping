var app = app || {};

app.Food = Backbone.Model.extend({
	defaults: {
		name: 'Not specified :(',
		quantity: '0',
		metric: 'Singles'
	},

	parse: function( response ) {
		response.id = response._id;
		return response;
	}
});

