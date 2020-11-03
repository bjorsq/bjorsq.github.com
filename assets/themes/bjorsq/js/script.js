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
		$('#podcast>li').append('<button class="playbutton"></button>');
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
			if( $('.playing').parents('li').next() ) {
				audioElement.setAttribute('src', $('.playing').parents('li').next().find('a').attr('href'));
				playButton = $('.playing').parents('li').next().find('.playbutton');
			} else {
				audioElement.setAttribute('src', $('#podcast>li:first').find('a').attr('href'));
				playButton = $('#podcast>li:first').find('.playbutton');
			}
			$('.playbutton').removeClass('playing');
			playButton.addClass('playing');
			audioElement.play();
		}, false);
	}
	
})(jQuery);
