/**
 * Flickr interface using jQuery
 * gets a set of albums from Flickr, and provides a means to browse the photos in them
 * using the Flickr API
 */
(function($){
    /* vimeo wall */
	if ($('#vimeo_wall').length) {
		$.getJSON('https://vimeo.com/api/v2/bjorsq/videos.json', function(data){
			var html = '';
			$.each( data, function() {
				html += '<a href="'+this.url+'" class="video-link" target="_blank"><img src="'+this.thumbnail_large+'" /><span>'+this.title+'</span></a>';
			});
			$('#vimeo_wall').append(html);
		});
	}
	/* podcast */
	if ($('#podcast').length) {
		var audioElement = document.createElement('audio');
		$('#podcast>li a').before('<button class="playbutton"></button>');
		$(document).on('click','.playbutton', function(){
			$('.playbutton').not(this).removeClass('playing');
			audioElement.pause();
			if ( ! $(this).hasClass('playing') ) {
				var audioURL = $(this).parents('li').find('a').attr('href');
				if ( audioElement.getAttribute('src') != audioURL ) {
					audioElement.setAttribute('src', audioURL);
				}
				$(this).addClass('playing');
				audioElement.play();
			} else {
				$(this).removeClass('playing');
			}
		});
		/* go to next track (or first) */
		audioElement.addEventListener('ended', function() {
			var playButton;
			if( $('.playing').parents('li').is(':last-child') ) {
				audioElement.setAttribute('src', $('#podcast>li:first-child').find('a').attr('href'));
				playButton = $('#podcast>li:first-child').find('.playbutton');
			} else {
				audioElement.setAttribute('src', $('.playing').parents('li').next().find('a').attr('href'));
				playButton = $('.playing').parents('li').next().find('.playbutton');
			}
			$('.playbutton').removeClass('playing');
			playButton.addClass('playing');
			audioElement.play();
		}, false);
	}
	if($('.bq-list').length){
		var types = {'cakes':[],'puddings':[],'mains':[],'dips':[],'sides':[],'salads':[],'spices':[]};
		$('ul.bq-list li').each(function(){
			types[$(this).data('tags')].push($(this));
		});
		$('.bq-list').before('<p>Sort by <a href="#" class="sort-link sort-date sort-active">date</a>, <a href="#" class="sort-link sort-az">a-z</a> or <a href="#" class="sort-link sort-type">group by type</a></p>');
		$(document).on('click', '.sort-date', function(e){
			e.preventDefault();
			if ($('.bq-list').length>1) {
				ungroup();
			}
			$('.bq-list').removeClass('sorted-desc').removeClass('sorted-asc');
			sortList($('.bq-list'),true,'date');
			$('.sort-link').removeClass('sort-active');
			$('.sort-az').text('a-z');
			$(this).addClass('sort-active');
		});
		$(document).on('click', '.sort-az', function(e){
			e.preventDefault();
			if ($('.bq-list').length>1) {
				ungroup();
			}
			var sortDescending = $(this).parent().next('.bq-list').hasClass('sorted-asc');
			var newClass = sortDescending? 'sorted-desc': 'sorted-asc';
			var newText =  sortDescending? 'a-z': 'z-a';
			$('.bq-list').removeClass('sorted-desc').removeClass('sorted-asc').addClass(newClass);
			sortList($('.bq-list'),sortDescending);
			$('.sort-link').removeClass('sort-active');
			$(this).addClass('sort-active').text(newText);
		});
		$(document).on('click', '.sort-type', function(e){
			e.preventDefault();
			if ($('.bq-list').length>1) {
				ungroup();
			} else {
				$('.bq-list').remove();
				for(type in types){
					$('main').append('<h3 class="bq-list-header">'+type.substr(0,1).toUpperCase()+type.substr(1)+'</h3>');
					$('main').append($('<ul class="bq-list"\>').append(types[type]));
				}
			}
			$('.bq-list').each(function(){
				sortList($(this));
			});
			$('.sort-link').removeClass('sort-active');
			$('.sort-az').text('a-z');
			$(this).addClass('sort-active');
		});
	}
	function ungroup(){
		var newList = $('<ul class="bq-list"/>');
		newList.append($('.bq-list').children('li').get());
		$('.bq-list,.bq-list-header').remove();
		$('main').append(newList);
	}
	function sortList(list, sortDescending, by) {
		var sortdir = sortDescending? -1: 1;
		var sortby = (by && by === 'date')? 'date': 'title';
		var listitems = list.children('li').get();
		listitems.sort(function(a, b) {
			if ('title' === sortby){
				return sortdir * $(a).data(sortby).toUpperCase().localeCompare($(b).data(sortby).toUpperCase());
			} else {
				return $(b).data(sortby) - $(a).data(sortby);
			}
		});
		$.each(listitems, function(idx, itm) { list.append(itm); });
	}
	
})(jQuery);
