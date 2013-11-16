(function(){

	// jQuery Objects
	var $tagSearch = $('#tag-search'),
			$tagContainer = $('#stage-one .choice-container');

	// Templates
	var choiceTemplateFactory = _.template( $('#choice-templ').html() )

	var formatHelpers = {}

	function getTimesTags(query){
		var php_wrapper   = 'http://reedemmons.com/wrapper.php?callback=callback&url=',
				semantic_api  = '205658749b29419323046730d52bca65:15:40909005',
				search_string = encodeURIComponent('http://api.nytimes.com/svc/semantic/v2/concept/search.json?&query=' + query.replace(/ /g, '%20') + '&api-key=' + semantic_api);

		console.log('http://api.nytimes.com/svc/semantic/v2/concept/search.json?&query=' + query + '&api-key=' + semantic_api)
		return $.ajax({
			url: php_wrapper + search_string,
			dataType: 'JSONP'
		})
	}

	function toggleThinking($el, text){
		$el.toggleClass('ajmint-icon-loading');
	}

	function bakeElements(data, templateFactory, $destination, help_text){
		$destination.html('<div class="list-header">'+help_text+'</div>')
		_.each(data, function(row){
			_.extend(row, formatHelpers);
			$destination.append( templateFactory(row) );
		})
	}

	function bindHandlers(){
		$tagSearch.submit(function(e){
			var $loaderDiv = $('#tag-search .loader-div');
			toggleThinking($loaderDiv);
			getTimesTags( $('#tag-searcher').val() )
				.done(function(tag_response){
					toggleThinking($loaderDiv);
					bakeElements(tag_response.results, choiceTemplateFactory, $('#stage-one .choice-container'), 'Choose a Times Topic. Showing first 20:');
				})
				.fail(function(err){
					toggleThinking($loaderDiv);
					alert(err.statusText);
				})
			return false
		});

		$tagContainer.on('click', 'li', function(){
			var text = $(this).html();
			console.log('here')
		})

	}

	function startTheShow(){
		bindHandlers();
	}

	startTheShow();

}).call(this);