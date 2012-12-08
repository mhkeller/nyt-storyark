(function(){
	var fetchTerms = function(lame_term){
		$.ajax({
		  url: 'api-call',
		  success: function(data) {
		  	
		  }
		});


	}

	$('#search-term').submit( function(){
		var term = $('#search-term-input').val();
		fetchTerms(lame_term)
		return false
	});
})();