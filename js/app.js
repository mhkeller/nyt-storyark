(function(){
	var CONFIG = {
		screen_width: 960
	}

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

	// http://bit.ly/SGPxFI
	// By default this function just includes whole months
	// So add + 2 magic number so it includes the first and last month as well as the full months between two months
	function monthDiff(d1, d2) {
	    var months;
	    months = (d2.getFullYear() - d1.getFullYear()) * 12;
	    months -= d1.getMonth() + 1;
	    months += d2.getMonth();
	    return months + 2;
	}

	// var m = monthDiff(
	//     new Date(2010, 2, 4), // November 4th, 2008
	//     new Date(2010, 2, 12)  // March 12th, 2010
	// );

	var loadTestData = function(){
		$.ajax({
		  url: '../data/data.json',
		  dataType: 'JSON',
		  success: function(data) {
		  	// Length of response
		  	var len = data.length;
		  	// Get the bounds of the date
		  	var first_year = data[0].date.substring(0,4);
		  	var first_month = data[0].date.substring(4,6);
		  	var first_day = data[0].date.substring(6,8);

		  	var last_year = data[len-1].date.substring(0,4);
		  	var last_month = data[len-1].date.substring(4,6);
		  	var last_day = data[len-1].date.substring(6,8);

		  	var x_bins = monthDiff(
		  		new Date(first_year, first_month, first_day),
		  		new Date(last_year, last_month, last_day)
	  		);

	  		var bin_width = CONFIG.screen_width/x_bins;
	  		console.log(bin_width);
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