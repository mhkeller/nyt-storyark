(function(){

	// jQuery Objects
	var $tagSearch = $('#tag-search');

	// Templates
	var choiceTemplateFactory = _.template( $('#choice-templ').html() )

	var formatHelpers = {}

	function getTimesTags(query){
		var php_wrapper   = 'http://reedemmons.com/wrapper.php?callback=callback&url=',
				semantic_api  = '205658749b29419323046730d52bca65:15:40909005',
				search_string = encodeURIComponent('http://api.nytimes.com/svc/semantic/v2/concept/search.json?&query=' + query + '&api-key=' + semantic_api);

		return $.ajax({
			url: php_wrapper + search_string,
			dataType: 'JSONP'
		})
	}

	function toggleThinking($el, text){
		$el.toggleClass('ajmint-icon-loading');
	}

	function bakeElements(data, templateFactory, $destination){
		_.each(data, function(row){
			_.extend(row, formatHelpers);
			console.log($destination)
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
					bakeElements(tag_response.results, choiceTemplateFactory, $('#stage-one .choice-container'));
				})
				.fail(function(err){
					console.log(err.statusText);
				})
			return false
		});
	}

	function startTheShow(){
		bindHandlers();
	}

	startTheShow();

}).call(this);