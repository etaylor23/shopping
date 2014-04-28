var app = app || {};

app.foodItemView = Backbone.View.extend({
	tagName: 'div',
	className: 'food-container large-3 medium-6 small-12 columns',
	template: _.template( $('#new-food').html() ),



	render: function(event) {

		this.$el.html( this.template( this.model.toJSON() ) );
		var quantity = this.model.get("quantity");
		var metric = this.model.get("metric");

		if(metric=="Grams") {
			if(quantity >= 0 && quantity <= 150) {
				$(this.$el).addClass("red").removeClass("orange").removeClass("green");
			} else if(quantity >= 151 && quantity <= 300) {
				$(this.$el).addClass("orange").removeClass("red").removeClass("green");
			} else {
				$(this.$el).addClass("green").removeClass("red").removeClass("orange");				
			}
		} else {
			if(quantity==1||quantity==2) {
				$(this.$el).addClass("red").removeClass("orange").removeClass("green");
			} else if ( quantity==3||quantity==4 ) {
				$(this.$el).addClass("orange").removeClass("red").removeClass("green");
			} else {
				$(this.$el).addClass("green").removeClass("red").removeClass("orange");			
			}	
		}


		return this;
	},

	events: {
		"click option":"updateQuantity",
		"click #delete":"deleteFood",
		"keypress":"updateGrams"
	},

	updateGrams: function(e) {
		if(e.keyCode == 13) {
		this.model.set({ quantity: this.$("#quantity-update").val() });
		this.model.save();
		this.render();		}
	},

	updateQuantity: function(e) {
		this.model.set({ quantity: $(e.currentTarget).val() });
		this.model.save();
		this.render();
	},

	deleteFood: function() {

		console.log("Deleting target");
		//this.remove();
		this.$el.fadeOut(300, function() {
			this.remove();
		});
		this.model.destroy();
		console.log("Target successfully deleted");
	}
})