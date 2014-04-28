var app = app || {};

app.FoodStoreView = Backbone.View.extend({
	el: '#library',


	initialize: function( initialFood ) {
		this.collection = new app.foodStore();
		this.collection.fetch({ reset:true });
		this.render();

//		console.log("Model is defined as: " + this.model);
//		console.log(this.collection.toJSON());

		//this.listenTo( this.collection, 'add', this.renderFood );
		this.listenTo( this.collection, 'reset', this.render );
	},

	events: {
		"click #add":"addNewFood",
		"click #metric option":"updateMetric",
	},

	render: function( item ) {
		this.collection.each(function( item ) {
			this.renderFood( item );
		}, this);
	},

	renderFood: function( item ) {
		var fooditemview = new app.foodItemView({
			model: item,
		});

		this.$("#listing").append( fooditemview.render().el ).fadeIn();
		console.log(this.collection.toJSON());
	},

	addNewFood: function() {
		var foodName = $("#food-name").val();
		var foodQuantity = $("#food-quantity").val();
		var foodMetric = $("#metric").val();

		if(foodName=="" || foodQuantity=="") {
			alert("Sorry, you have not specified a name or a quantity");
			return false;
		} else {
			var newFood = new app.Food({ name: foodName, quantity: foodQuantity, metric: foodMetric });
			this.collection.create(newFood);
			this.renderFood( newFood );
		}
	},



	updateMetric: function(e) {

		var foodQuantity = $("#food-quantity");
		foodQuantity.remove();
		foodQuantity.removeAttr("disabled");

		quantityMetricVal = $(e.currentTarget).val();
		if( quantityMetricVal == "Grams" ) {
			//var metricValues = "<option>50</option><option>100</option><option>150</option><option>200</option><option>300</option><option>400</option><option>500</option>";
			foodQuantity.remove();
			$("<input id='food-quantity' type='text'>").insertAfter("#food-quantity-label");
		} else if( quantityMetricVal == "Packs" || quantityMetricVal == "Singles" ) {
			var metricValues = "<select id='food-quantity'><option>1</option><option>2</option><option>3</option><option>4</option><option>5</option><option>6</option><option>7</option><option>8</option></select>"

		} else {
			var metricValues = "<select disabled='disabled' id='food-quantity'></select>";
			foodQuantity.prop("disabled",true);
		}

		$( metricValues ).insertAfter("#food-quantity-label");
	}
});