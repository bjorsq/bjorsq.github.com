/**
 * Flickr interface using jQuery
 * gets a set of albums from Flickr, and provides a means to browse the photos in them
 * using the Flickr API
 */
(function($){
    var flickrURL = 'https://api.flickr.com/services/rest/?api_key=12a222d6e3f55d6a4cfbce4220bace55&format=json&user_id=124957192@N06',
        albumQueryURL = flickrURL+'&method=flickr.photosets.getList&jsoncallback=?',
        albumContentsURL = flickrURL+'&method=flickr.photosets.getPhotos&extras=media&jsoncallback=?&photoset_id=',
        photoQueryURL = flickrURL+'&method=flickr.photos.getSizes&nojsoncallback=1&photo_id=';

    if ( $('#flickr').length ) {

        var showAlbums = function()
        {
            var albums = $('#flickr').data('albums');
            if ( albums != 'undefined' && albums.length ) {
                var albums_html = '';
                for (var i = 0; i < albums.length; i++) {
                    image_url = 'https://farm'+albums[i].farm+'.staticflickr.com/'+albums[i].server+'/'+albums[i].primary+'_'+albums[i].secret+'.jpg';
                    albums_html += '<a href="#" class="photoset-link" data-photoset-id="'+albums[i].id+'"><img src="'+image_url+'"><span>'+albums[i].title._content+'</span></a>'; 
                }
                $('#flickr').empty().html(albums_html);
                doCrumb(false, false);
                if (history.pushState) {
                    history.pushState({'page':'albums'}, 'Albums');
                }
            }
        },
        showPhotos = function(photoset_id)
        {
            var albumData = getAlbumData( photoset_id );
            if ( albumData ) {
                var photos = $('#flickr').data(photoset_id);
                if ( photos != 'undefined' && photos.length) {
                    var photos_html = '';
                    for (var i = 0; i < photos.length; i++) {
                        image_url = 'https://farm'+photos[i].farm+'.staticflickr.com/'+photos[i].server+'/'+photos[i].id+'_'+photos[i].secret+'_h.jpg';
                        thumb_url = 'https://farm'+photos[i].farm+'.staticflickr.com/'+photos[i].server+'/'+photos[i].id+'_'+photos[i].secret+'.jpg';
                        photos_html += '<a href="'+image_url+'" rel="gallery" class="photo-link" data-photo-id="'+photos[i].id+'" data-photoset-id="'+photoset_id+'"><img src="'+thumb_url+'"><span>'+photos[i].title+'</span></a>'; 
                    }
                    $('#flickr').empty().html(photos_html);
                    if (history.pushState) {
                        history.pushState({'photoset':photoset_id}, albumData.title._content);
                    }
                    doCrumb(photoset_id, false);
                }
            }
        },
        showSinglePhoto = function(photoset_id, photo_id)
        {
            var photoData = getPhotoData(photoset_id, photo_id),
                photo_html = '';
            if ( photoData ) {
                if ( photoData.media == 'video' ) {
                    photo_html += '<iframe src="https://www.flickr.com/photos/124957192@N06/'+photoData.id+'/player/" width="500" height="281"></iframe>';
                } else {
                    var image_url = 'https://farm'+photoData.farm+'.staticflickr.com/'+photoData.server+'/'+photoData.id+'_'+photoData.secret+'_b.jpg',
                    original_url = 'https://farm'+photoData.farm+'.staticflickr.com/'+photoData.server+'/'+photoData.id+'_'+photoData.secret+'_o.jpg';
                    photo_html += '<a target="_blank" href="'+image_url+'" rel="gallery" class="original-photo-link" data-photo-id="'+photoData.id+'" data-photoset-id="'+photoset_id+'"><img src="'+image_url+'"></a><h2>'+photoData.title+'</h2>'; 
                }
                $('#flickr').empty().html(photo_html);
                doCrumb(photoset_id, photo_id);
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
        getPhotos = function( photoset_id )
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
        },
        getAlbumData = function( photoset_id )
        {
            var albums = $('#flickr').data('albums');
            if ( albums != 'undefined' && albums.length ) {
                for (var i = 0; i < albums.length; i++) {
                    if (albums[i].id == photoset_id) {
                        return albums[i];
                    }
                }
            }
            return false;
        },
        getPhotoData = function( photoset_id, photo_id )
        {
            var albumData = getAlbumData( photoset_id );
            if ( albumData ) {
                var photos = $('#flickr').data(photoset_id);
                if ( photos != 'undefined' && photos.length) {
                    for (var i = 0; i < photos.length; i++) {
                        if ( photo_id == photos[i].id ) {
                            return photos[i];
                        }
                    }
                }
            }
            return false;
        },
        doCrumb = function(photoset_id, photo_id)
        {
            var albumData = getAlbumData( photoset_id ),
                crumb = [],
                foundPhoto = getPhotoData(photoset_id, photo_id);
            if ( albumData ) {
                crumb.push('<a href="#" class="return">albums</a>');
                if ( photo_id && foundPhoto ) {
                    console.log(foundPhoto);
                    crumb.push('<a href="#" class="return-album" data-photoset-id="'+photoset_id+'">'+albumData.title._content+'</a>');
                    crumb.push(foundPhoto.title);
                } else {
                    crumb.push(albumData.title._content);
                }
            } else {
                crumb.push('albums');
            }
            $('.gallery-crumb').html(crumb.join(' &raquo; '));
        };
        $('#flickr').on('click', '.photoset-link', function(e){
            e.preventDefault();
            getPhotos($(this).data('photoset-id'));
        });
        $('#flickr').on('click', '.photo-link', function(e){
            e.preventDefault();
            showSinglePhoto($(this).data('photoset-id'), $(this).data('photo-id'), $(this).attr('href'));
        });

        $('.gallery-crumb').on('click', '.return', function(e){
            e.preventDefault();
            showAlbums();
        });
        $('.gallery-crumb').on('click', '.return-album', function(e){
            e.preventDefault();
            showPhotos($(this).data('photoset-id'));
        });

        window.onpopstate = function(event) {
              if ( event.state ) {
                  console.log(event.state);
                  if ( event.state.photoset ) {
                      showPhotos(event.state.photoset);
                  }
                  if (event.state.page && event.state.page == 'albums') {
                      showAlbums();
                  }
              }
        };
        /* get the Albums */
        getAlbums();
        if ($('.recipe-photo').length) {
            $('.recipe-photo').each(function(){
                if ($(this).data('photo-id') !== '') {
                    var c = $(this);
                    $.getJSON(photoQueryURL+$(this).data('photo-id'), function(data){
                        if (data.stat == 'ok') {
                            var thumb_url, large_url;
                            $.each(data.sizes.size, function(){
                                if (this.label == c.data('thumbsize')) {
                                    thumb_url = this.source;
                                } else if (this.label == "Large") {
                                    large_url = this.source;
                                } 
                            });
                            c.append('<a href="'+large_url+'" title="'+c.data('title')+'"><img src="'+thumb_url+'" /></a>');
                        }
                    });
                }
            });
        }
    }

    /* vimeo wall */
	if ($('#vimeo_wall').length) {
		$.getJSON('http://vimeo.com/api/v2/bjorsq/videos.json', function(data){
			var html = '';
			$.each( data, function() {
				html += '<a href="'+this.url+'" class="video-link" target="_blank"><img src="'+this.thumbnail_large+'" /><span>'+this.title+'</span></a>';
			});
			$('#vimeo_wall').append(html);
		});
	}
	/* photo wall */
	
})(jQuery);
