$(document).ready(function() {
	$("#myinput").focus();
	var ingredients = [];
	
	var search = function(){
		if (ingredients.length != 0) {
			$(".recipe-list").empty();
  
		  	var basicQuery = {
								"type": "/food/recipe",
					  		  	"name": null,
								"id": null,
								"sort":"name"
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
			   		$.each(response.result, function(i,recipe){
			     		$(".recipe-list").append("<li><a href='#' class='recipe-link' data-id='"+recipe.id+"'>" + recipe.name + "</a></li>");
			   	 	});
				} else{
					$(".recipe-list").html("<li>None</li>")
				}
		  	});
		} else {
			$(".recipe-list").html("<li>None</li>")
		}
	}

	//autocomplete recipe search
	$(function() {
		$("#myinput").suggest({
		  key: "AIzaSyCfQ2pS7DT93_YB3InrgXMsH7XvxpZBMrM",
		  filter:'(all type:/food/ingredient)'
		});
	});


	$("#myinput").on("keypress", function(event){
		if (event.keyCode == 13) {
			ingredients.push($("#myinput").val());
			var ingToAdd = "<li>" + $("#myinput").val() + " <button class='remove' data-id='"+$("#myinput").val()+"'>X</button></li>"
		 	$(".ing-list").append(ingToAdd);
			
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
		
		//freebase descriptions are under topic, not recipe
		var query = {
  		  				"id": id,
 					   	"name": null,
  					  	"type":"/common/topic",
						"description": null
					}
					
		var detailsQuery = {
				  				"id": id,
						  		"name": null,
						  		"type": "/food/recipe",
						  		"ingredients": [{
						    		"ingredient": null,
						   		 	"quantity": null,
						   		 	"unit": null
  						  		}]
							}
		
	  	var service_url = 'https://www.googleapis.com/freebase/v1/mqlread';

		
	 	$.getJSON(service_url + '?callback=?', {query:JSON.stringify(query)},function(response) {
			var instructions = response.result.description
			
			$.getJSON(service_url + '?callback=?', {query:JSON.stringify(detailsQuery)},function(data) {
				
				
				var ingredientList = data.result.ingredients;
				console.log(ingredientList);
			
				$(".recipe").remove();
		
				$("<li class='recipe'>"+instructions+"<ul class='recipe-deets'></ul></li>").insertAfter(".recipe-link[data-id='"+id+"']");
				
				$.each(ingredientList, function(i, ingredient){
					$(".recipe-deets").append("<li>"+ ingredient.ingredient+" "+ingredient.quantity+" "+ingredient.unit+"</li>");
				});
				
				$(".recipe").slideToggle( "slow" );

			
	  		});
		});
	});
	
});
