$(document).ready(function() {
	$("#myinput").focus();
	var ingredients = [];
	var recipes = {};
	
	//autocomplete recipe search
	$(function() {
		$("#myinput").suggest({
		  key: "AIzaSyCfQ2pS7DT93_YB3InrgXMsH7XvxpZBMrM",
		  filter:'(all type:/food/ingredient)'
		});
	});
	
	
	var search = function(){
		recipes = {};
		if (ingredients.length != 0) {
			$(".recipe-list").empty();
  
		  	var basicQuery = {
								"type": "/food/recipe",
					  		  	"name": null,
								"id": null,
								"sort":"name",
						  		"ingredients": [{
						    		"ingredient": null,
						   		 	"quantity": null,
						   		 	"unit": null
  						  		}]
							 }
					 
			$.each(ingredients, function(i, ingredient){
				var and = String.fromCharCode(i+97);
				var newIngredient = and + ":ingredients";
				basicQuery[newIngredient] = [{"ingredient": ingredient}];
			});
		
			var query = [basicQuery];
				 
		  	var service_url = 'https://www.googleapis.com/freebase/v1/mqlread';
			
		 	$.getJSON(service_url + '?callback=?', {query:JSON.stringify(query)},function(response) {
				if (response.result.length != 0) {
					_(response.result).each(function(recipe) {
						recipes[recipe.id] = recipe;
					})
					var recipeList = $("#recipe-list-template").html();
					
					var compiled = _.template(recipeList, {recipes: recipes})
					
					$(".recipe-list").html(compiled)
				} else{
					$(".recipe-list").html("<li>None</li>")
				}
		  	});
		} else {
			$(".recipe-list").html("<li>None</li>")
		}
	}

	$("#myinput").on("keypress", function(event){
		if (event.keyCode == 13) {
			ingredients.push($("#myinput").val());
			
			var ingredientTemplate = $("#ingredient-template").html()
			var compiled = _.template(ingredientTemplate, {ingredient: $("#myinput").val()})
			
		 	$(".ing-list").append(compiled);
			
			//reset the input field
			$("#myinput").blur();
			$("#myinput").val("");
			$("#myinput").focus();
			
			search();
		};
	})
	
	$(".ing-list").on("click", ".remove", function(event){
		var $target = $(event.currentTarget)
		$target.parent().remove();
		var removedIngredient = $target.data("id")
		var index = ingredients.indexOf(removedIngredient)
		ingredients.splice(index,1);
		console.log(ingredients);
		search();
	})
	
	$(".recipe-list").on("click", "a", function(event){
		var id = $(event.currentTarget).data("id");
		
		//freebase descriptions are under topic, not recipe, they are not connected
		var query = {
  		  				"id": id,
 					   	"name": null,
  					  	"type":"/common/topic",
						"description": null
					}
		
	  	var service_url = 'https://www.googleapis.com/freebase/v1/mqlread';

		
	 	$.getJSON(service_url + '?callback=?', {query:JSON.stringify(query)},function(response) {
			var recipe = {}
		
			recipe["instructions"] = response.result.description;
			recipe["ingredients"] = recipes[id].ingredients;
			
			$(".recipe").remove();
			
			var recipeDetails = _.template($("#recipe-template").html(), {recipe: recipe})
	
			$(recipeDetails).insertAfter(".recipe-link[data-id='"+id+"']");
			
			
			$(".recipe").slideToggle( "slow" );

			
		});
	});
	
});
