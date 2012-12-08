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