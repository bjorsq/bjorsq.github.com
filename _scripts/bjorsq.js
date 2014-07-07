/**
 * bjorsq.net javascript
 */

(function($){
	/* vimeo wall */
	if ($('#vimeo_wall').length) {
		$.getJSON('http://vimeo.com/api/v2/bjorsq/videos.json', function(data){
			var html = '';
			$.each( data, function() {
				html += '<div class="clip"><a href="'+this.url+'"><img src="'+this.thumbnail_medium+'" /></a><h4><a href="'+this.url+'">'+this.title+'</a></h4></div>';
			});
			$('#vimeo_wall').append(html);
			$('#vimeo_wall .clip a').fancybox({
				helpers : {
					media: true
				},
				vimeo : {
					autoplay: 1
				}
			});
		});
	}
	/* photo wall */
	
})(jQuery);
