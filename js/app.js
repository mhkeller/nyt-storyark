(function(){
	var CONFIG = {
		screen_width: 960
	}

	var fetchTerms = function(lame_term){
		var sem_api_key = '8537fd77a66fcdcf309a3f864cec0d77:14:65316364';
		var lame_term_encode = encodeURIComponent(lame_term);
		var search_url = encodeURIComponent('http://api.nytimes.com/svc/semantic/v2/concept/search.json?&query='+lame_term_encode+'&api-key='+sem_api_key)
		var php_wrapper = 'http://reedemmons.com/wrapper.php?callback=test&url=';
		var request_url = php_wrapper + search_url; 
		$.ajax({
		  url: request_url,
		  dataType: 'JSONP',
		  success: function(data) {
		  	$('#topic-option-list').html('');

		  	if (data.more_results == true){
		  		$('#step-two .step-text').html('Step two: Pick a Times Topic keyword <br/><span class="pointer">Too many results returned, please narrow your search.</span>');
		  	}else{
		  		$('#step-two .step-text').html('Step two: Pick a Times Topic keyword');
		  	}

		  	$.each(data.results, function(key, value){
		  		var better_term = value.concept_name;
		  		$('#topic-option-list').append('<li class="topic-option">' + better_term + '</li>')

		  	});
		  	$('#step-two').show();

		  }
		}).done( function(){
			$('.spinner').hide();
		});
	}

	var fetchArticles = function(times_term){
		var article_api_key = '4b3fb88ab7098c2655536162dd71eaaf:12:65316364';
		var times_term_encode = encodeURIComponent(times_term);
		var offset = 0;
		var search_url = encodeURIComponent('http://api.nytimes.com/svc/search/v1/article?format=json&query='+times_term_encode+'&fields=byline%2C+body%2C+date%2C+url%2C+word_count&offset='+offset+'&api-key='+article_api_key)
		var php_wrapper = 'http://reedemmons.com/wrapper.php?callback=test&url=';
		var request_url = php_wrapper + search_url; 
		// console.log('request_url',request_url)
		$.ajax({
		  url: request_url,
		  dataType: 'JSONP',
		  success: function(data) {
		  	var results_per_page = 10;
		  	var total_results = data.total;
		  	var calls_needed = Math.floor(total_results/results_per_page);

		  	var article_data = data.results;
		  	if (calls_needed == 0){
		  		calls_needed = 1;
		  	}
		  	$('#calls-remaining').html('Fetching ' + (Number(offset)+1) + ' of '+calls_needed + ' pages');
		  	fetchMoreArticles(offset, article_data, calls_needed);

		  }
		});

		var fetchMoreArticles = function(offset, article_data, calls_needed){
			var search_url = encodeURIComponent('http://api.nytimes.com/svc/search/v1/article?format=json&query='+times_term_encode+'&fields=byline%2C+body%2C+date%2C+url%2C+word_count&offset='+offset+'&api-key='+article_api_key)
			var request_url = php_wrapper + search_url; 

	  		$.ajax({
	  			 url: request_url,
	  			 dataType: 'JSONP',
	  			 success: function(data){
	  			 	article_data = $.merge(article_data, data.results);
	  			 	offset++;
	  			 }
	  		}).done(function(){
	  			if (offset < calls_needed){
	  				$('#calls-remaining').html('Fetching ' + (Number(offset)+1) + ' of '+calls_needed + ' pages');
	  				fetchMoreArticles(offset, article_data, calls_needed);
	  			}else{
	  				$('.spinner').hide();
	  				$('#calls-remaining').html('');
	  				formatBoxPlotData(article_data);
	  			}
	  		});

		}

	}

	$('#topic-option-list').on('click', '.topic-option', function(){
		var times_term = $(this).html();
		$('.spinner').show();
		fetchArticles(times_term)
	});

	var formatHelpers = {
		heightWC: function(word_count){
			return word_count + 'px'
		}
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


	var calcBinNumber = function(data){
		var len = data.length;
	  	// Get the bounds of the date
	  	var first_year = data[0].date.substring(0,4);
	  	var first_month = data[0].date.substring(4,6);
	  	var first_day = data[0].date.substring(6,8);

	  	var last_year = data[len-1].date.substring(0,4);
	  	var last_month = data[len-1].date.substring(4,6);
	  	var last_day = data[len-1].date.substring(6,8);

	  	// Calculate Diff for number of x-axis
	  	var x_bins = monthDiff(
	  		new Date(first_year, first_month, first_day),
	  		new Date(last_year, last_month, last_day)
  		);
	  	return x_bins;
	}
	var calcBinWidth = function(bins){
  		var bin_width = CONFIG.screen_width/bins;
  		return bin_width;
	}

	var formatBoxPlotData = function(json){
		// Get how many months we'll need
		var bins = calcBinNumber(json);
		// and the width of the columns
		var bin_width = calcBinWidth(bins);

		// Nest results by month-year
		var data = d3.nest()
		    .key(function(d) { var month_year_key = d.date.substring(0, 6); return month_year_key; })
		    .entries(json);

		drawBarPlot(bins, bin_width, data);
	    // console.log('bins',bins,'bin_width',bin_width,'data',data)

	}
	// loadTestData();

	$('#search-term-submit').click( function(){
		var lame_term = $('#search-term-input').val();
		fetchTerms(lame_term);
		$('.spinner').show();
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

    $("input").keypress(function(event) {
	    if (event.which == 13) {
	        event.preventDefault();
	        $("#search-term-submit").click();
	    }
	});


})();