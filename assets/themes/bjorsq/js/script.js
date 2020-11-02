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
	/* photo wall */
	
})(jQuery);
