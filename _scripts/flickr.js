/**
 * Flickr interface using jQuery
 * gets a set of albums from Flickr, and provides a means to browse the photos in them
 * using the Flickr API
 */
(function($){
	if ( $('#flickr').length ) {
		var flickrURL = 'https://api.flickr.com/services/rest/?api_key=12a222d6e3f55d6a4cfbce4220bace55&format=json&user_id=124957192@N06',
			albumQueryURL = flickrURL+'&method=flickr.photosets.getList&jsoncallback=?',
			albumContentsURL = flickrURL+'&method=flickr.photosets.getPhotos&jsoncallback=?&photoset_id=',

		showAlbums = function(resp)
		{
			var albums = $('#flickr').data('albums');
			if ( albums != 'undefined' && albums.length ) {
				var albums_html = '';
				for (var i = 0; i < albums.length; i++) {
					image_url = 'https://farm'+albums[i].farm+'.staticflickr.com/'+albums[i].server+'/'+albums[i].primary+'_'+albums[i].secret+'_q.jpg';
					albums_html += '<div class="album"><a href="#" class="photoset-link" data-photoset-id="'+albums[i].id+'"><img src="'+image_url+'"></a><h4><a href="#" class="photoset-link" data-photoset-id="'+albums[i].id+'">'+albums[i].title._content+'</a></h4></div>'; 
				}
				$('#flickr').empty().html(albums_html);
			}
		},
		showPhotos = function(photoset_id)
		{
			var photos = $('#flickr').data(photoset_id);
			if ( photos != 'undefined' && photos.length) {
				var photos_html = '';
				for (var i = 0; i < photos.length; i++) {
					image_url = 'https://farm'+photos[i].farm+'.staticflickr.com/'+photos[i].server+'/'+photos[i].id+'_'+photos[i].secret+'_b.jpg';
					thumb_url = 'https://farm'+photos[i].farm+'.staticflickr.com/'+photos[i].server+'/'+photos[i].id+'_'+photos[i].secret+'_q.jpg';
					photos_html += '<div class="album"><a href="'+image_url+'" rel="gallery" class="photo-link" data-photo-id="'+photos[i].id+'"><img src="'+thumb_url+'"></a><h4>'+photos[i].title+'</h4></div>'; 
				}
				$('#flickr').empty().html(photos_html);
				$('.photo-link').fancybox();
			}
		},
		getAlbums = function()
		{
			var albumCache = $('#flickr').data('albums');
			if ( ! albumCache ) {
				$.getJSON(albumQueryURL, function(data){
					$('#flickr').data('albums', data.photosets.photoset);
					showAlbums();
				});
			} else {
				showAlbums();
			}
		},
		getPhotos = function(photoset_id)
		{
			var photoCache = $('#flickr').data(photoset_id);
			if ( ! photoCache ) {
				$.getJSON(albumContentsURL+photoset_id, function(data){
					$('#flickr').data(photoset_id, data.photoset.photo);
					showPhotos(photoset_id);
				});
			} else {
				showPhotos(photoset_id);
			}
		};
		$('#flickr').on('click', '.photoset-link', function(e){
			e.preventDefault();
			getPhotos($(this).data('photoset-id'));
		})

		/* get the Albums */
		getAlbums();
	}
})(jQuery);