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
		});
	}

	var fetchArticles = function(times_term){
		var article_api_key = '4b3fb88ab7098c2655536162dd71eaaf:12:65316364';
		var times_term_encode = encodeURIComponent(times_term);
		var search_url = encodeURIComponent('http://api.nytimes.com/svc/semantic/v2/concept/search.json?&query='+lame_term_encode+'&api-key='+api_key)
		var php_wrapper = 'http://reedemmons.com/wrapper.php?callback=test&url=';
		var request_url = php_wrapper + search_url; 
		$.ajax({
		  url: request_url,
		  dataType: 'JSONP',
		  success: function(data) {
		  	
		  }
		});

	}

	$('#topic-option-list').on('click', '.topic-option', function(){
		var times_term = $(this).html();
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

	// var m = monthDiff(
	//     new Date(2010, 2, 4), // November 4th, 2008
	//     new Date(2010, 2, 12)  // March 12th, 2010
	// );

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

	var loadTestData = function(){
		d3.json("../data/data.json", function(error, json) {
			  var articles = json.results;
			  var articles = json;
			  console.log(error)

			  var data = d3.nest()
			    .key(function(d) { return d.date; })
			    .rollup(function(d) {
			      var sum = d.reduce(function(p, c) { return  p + parseInt(c.word_count) }, 0)
			      // console.log(d, sum)
			      return sum
			    })
			    .map(articles);

			  console.log(d3.values(data).sort(d3.descending))
			  // console.log(data)
			  // var bins = calcBinNumber(data);
			  // var bin_width = calcBinWidth(bins);
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