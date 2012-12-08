(function(){
	var fetchTerms = function(lame_term){
		console.log('there')
		var api_key = encodeURIComponent('8537fd77a66fcdcf309a3f864cec0d77:14:65316364');
		var request_url = 'http://api.nytimes.com/svc/semantic/v2/concept/search.json?&query='+lame_term+'&api-key='+api_key
		console.log(request_url);
		$.ajax({
		  url: request_url,
		  dataType: 'JSON',
		  success: function(data) {
		  	console.log(data);

		  }
		});
	}
	var loadTestData = function(){
		$.ajax({
		  url: '../data/data.json',
		  dataType: 'JSON',
		  success: function(data) {
		  	console.log(data);

		  }
		});
	}
	loadTestData();

	$('#search-term-submit').click( function(){
		var lame_term = $('#search-term-input').val();
		fetchTerms(lame_term)
		// return false
	});

	// Hide input help text on focus
	$('input:text').each(function(){
        var txtval = $(this).val();
        $(this).focus(function(){
            if($(this).val() == txtval){
            	$(this).removeClass('help-text')
                $(this).val('');
            }
        });
        $(this).blur(function(){
            if($(this).val() == ""){
                $(this).val(txtval);
	        	$(this).addClass('help-text')
            }
        });
    });


})();