$(document).ready(function() {
	var ingredients = [];
	
	var search = function(){
		
		$(".recipe-list").empty();
  
	  	var basicQuery = {
							"type": "/food/recipe",
				  		  	"name": null,
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
	   		$.each(response.result, function(i,recipe){
	     		$(".recipe-list").append("<li>" + recipe.name + "</li>");
	   	 	});
	  	});
	}

	//autocomplete recipe search
	$(function() {
		$("#myinput").suggest({
		  key: "AIzaSyCfQ2pS7DT93_YB3InrgXMsH7XvxpZBMrM",
		  filter:'(all type:/food/ingredient)'
		});
	});


	$("#add").click(function(){
		ingredients.push($("#myinput").val());
		var ingToAdd = "<li>" + $("#myinput").val() + " <button class='remove' data-id='"+$("#myinput").val()+"'>Remove</button></li>"
	 	$(".ing-list").append(ingToAdd);
		$("#myinput").val("");
		search();
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
	
});
