var app = app || {};

app.foodStore = Backbone.Collection.extend({
	model: app.Food,
	url: '/api/foods'
})