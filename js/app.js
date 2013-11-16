(function(){

	// jQuery Objects
	var $tagSearch = $('#tag-search'),
			$tagContainer = $('#stage-one .choice-container');

	// Templates
	var choiceTemplateFactory = _.template( $('#choice-templ').html() )

	var formatHelpers = {}

	var date_ranges = [
		[18510101, 18591231],
		[18600101, 18691231],
		[18700101, 18791231],
		[18800101, 18891231],
		[18900101, 18991231],
		[19000101, 19091231],
		[19100101, 19191231],
		[19200101, 19291231],
		[19300101, 19391231],
		[19400101, 19491231],
		[19500101, 19591231],
		[19600101, 19691231],
		[19700101, 19791231],
		[19800101, 19891231],
		[19900101, 19991231],
		[20000101, 20001231],
		[20010101, 20011231],
		[20020101, 20021231],
		[20030101, 20031231],
		[20040101, 20041231],
		[20050101, 20051231],
		[20060101, 20061231],
		[20070101, 20071231],
		[20080101, 20081231],
		[20090101, 20091231],
		[20100101, 20101231],
		[20110101, 20111231],
		[20120101, 20121231],
		[20130101, 20131231]
	];

	function fetchTimesApi(api, query, date_range, page){
		var apis = {
			semantic: {
				endpoint: 'http://api.nytimes.com/svc/semantic/v2/concept/search.json?&query=',
				key: '205658749b29419323046730d52bca65:15:40909005'
			},
			search: {
				endpoint: 'http://api.nytimes.com/svc/search/v2/articlesearch.json?&query',
				key: '9F91AC450542832490FEE768FE2EE4FD:15:40909005'
			}
		}

		var php_wrapper   = 'http://reedemmons.com/wrapper.php?callback=callback&url=',
				search_string = encodeURIComponent(apis[api].endpoint + query.replace(/ /g, '%20') + '&api-key=' + apis[api].key + ((date_range) ? '&begin_date=' + date_range[0] + '&end_date=' +  date_range[1] : '') + ((page) ? '&page=' + page : ''));

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

	function getDecadePages(search_term){
		_.each(date_ranges, function(date_range){

			for (var i = 1; i < 101; i++){

				fetchTimesApi('search', search_term, date_range, i)
					.done(function(search_response){
						console.log(search_response);
						getDecadePages(search_response);
					})
					.fail(function(err){
						alert(err.statusText);
					})

			}



		})

	}

	function bindHandlers(){
		$tagSearch.submit(function(e){
			var $loaderDiv = $('#tag-search .loader-div');
			toggleThinking($loaderDiv);
			fetchTimesApi('semantic', $('#tag-searcher').val() )
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
			getDecadePages( $(this).html() );
		})

	}

	function startTheShow(){
		bindHandlers();
	}

	startTheShow();

}).call(this);