window.addEventListener('DOMContentLoaded', event => {
    /* vimeo wall */
	let vimeo_wall = document.getElementById('vimeo_wall');
	if ( vimeo_wall !== null ) {
		let request = new XMLHttpRequest();
		request.open( 'GET', 'https://vimeo.com/api/v2/bjorsq/videos.json', true );
		request.addEventListener( 'load', function() {
			console.log(request);
  			if ( request.status >= 200 && request.status < 400 ) {
				console.log(request.responseText);
			    try {
					let data = JSON.parse( request.responseText );
					if ( data.length ) {
						let html = '';
						data.forEach( vid => {
							html += '<a href="'+vid.url+'" class="video-link" target="_blank"><img src="'+vid.thumbnail_large+'" /><span>'+vid.title+'</span></a>';
						});
						vimeo_wall.innerHTML = html;
					}
				} catch(e) {}
			}
		});
		request.send();
	}
	/* podcast */
	const podcast_list = document.getElementById('podcast');
	if ( podcast_list !== null ) {
		const audioElement = document.createElement( 'audio' );
		podcast_list.querySelectorAll( 'li a' ).forEach( mp3link => {
			let playbutton = document.createElement( 'button' );
			playbutton.classList.add( 'playbutton' );
			playbutton.setAttribute( 'data-audiourl', mp3link.getAttribute( 'href' ) );
			mp3link.parentNode.insertBefore( playbutton, mp3link );
		});
		document.addEventListener('click', event => {
			if ( event.target.classList.contains( 'playbutton' ) ) {
				let isPlaying = event.target.classList.contains( 'playing' );
			    document.querySelectorAll( '.playbutton' ).forEach( el => {
					el.classList.remove( 'playing' );
				});
				audioElement.pause();
				if ( ! isPlaying ) {
					let audioURL = event.target.getAttribute( 'data-audiourl' );
					if ( audioElement.getAttribute( 'src' ) !== audioURL ) {
						audioElement.setAttribute( 'src', audioURL );
					}
					audioElement.play();
					event.target.classList.add( 'playing' );
				}
			}
		});
		/* go to next track (or first) */
		audioElement.addEventListener( 'ended', function() {
			let playButton = null;
			let nextURL = null;
			let liPlaying = document.querySelector( '.playing' ).closest( 'li' );
			let nextSibling = liPlaying.nextElementSibling;
			if ( nextSibling === null ) {
				nextURL = podcast_list.querySelector( 'li:first-child a' ).getAttribute( 'href' );
				playButton = podcast_list.querySelector( 'li:first-child button' );
			} else {
				nextURL = nextSibling.querySelector( 'a' ).getAttribute( 'href' );
				playButton = nextSibling.querySelector( 'button' );
			}
			document.querySelectorAll( '.playbutton' ).forEach( el => {
				el.classList.remove( 'playing' );
			});
			playButton.classList.add( 'playing' );
			audioElement.setAttribute('src', nextURL);
			audioElement.play();
		}, false);
	}
	/* list filters */
	const postList = document.querySelector( '.post-list' );
	if ( postList !== null ) {
		var tags = {};
		postList.querySelectorAll( 'li' ).forEach( el => {
			if ( ! tags.hasOwnProperty( el.getAttribute( 'data-tags' ) ) ) {
				tags[ el.getAttribute( 'data-tags' ) ] = [];
			}
			tags[ el.getAttribute( 'data-tags' ) ].push( el );
		});
		const sortControls = document.createElement( 'p' );
		sortControls.innerHTML = 'Sort by <a href="#" class="sort-link sort-date sort-active">date</a>, <a href="#" class="sort-link sort-az">a-z</a> or <a href="#" class="sort-link sort-type">group by type</a>';
		postList.parentNode.insertBefore( sortControls, postList );
		document.addEventListener( 'click', event => {
			if ( event.target.classList.contains( 'sort-date' ) ) {
				event.preventDefault();
				postList.classList.remove( 'sorted-desc', 'sorted-asc' );
				if ( document.querySelectorAll( '.post-list' ).length > 1 ) {
					unGroup();
				}
				sortList( postList, true, 'date' );
				document.querySelectorAll( '.sort-link' ).forEach( el => { el.classList.remove( 'sort-active' ); } );
				document.querySelector( '.sort-az' ).textContent = 'a-z';
				event.target.classList.add( 'sort-active' );
			} else if ( event.target.classList.contains( 'sort-az' ) ) {
				event.preventDefault();
				let sortDescending = postList.classList.contains( 'sorted-asc' );
				let newClass = sortDescending? 'sorted-desc': 'sorted-asc';
				let newText =  sortDescending? 'a-z': 'z-a';
				postList.classList.remove( 'sorted-desc', 'sorted-asc' );
				if ( document.querySelectorAll( '.post-list' ).length > 1 ) {
					unGroup();
				}
				postList.classList.add( newClass );
				sortList( postList, sortDescending );
				document.querySelector( '.sort-link' ).classList.remove( 'sort-active' );
				event.target.classList.add( 'sort-active' );
				event.target.textContent = newText;
			} else if ( event.target.classList.contains( 'sort-type' ) ) {
				event.preventDefault();
				if ( document.querySelectorAll( '.post-list' ).length > 1 ) {
					unGroup();
				} else {

				}

			}
		});/*
		$(document).on('click', '.sort-type', function(e){
			e.preventDefault();
			if ($('.bq-list').length>1) {
				ungroup();
			} else {
				document.querySelector( '.bq-list' ).remove();
				for ( tagli in tags ) {
					document.getElementById( 'maincontainer' ).append('<h3 class="bq-list-header">'+type.substr(0,1).toUpperCase()+type.substr(1)+'</h3>');
					$('main').append($('<ul class="bq-list"\>').append(types[type]));
				}
				document.getElementById( 'maincontainer' )
			}
			$('.bq-list').each(function(){
				sortList($(this));
			});
			$('.sort-link').removeClass('sort-active');
			$('.sort-az').text('a-z');
			$(this).addClass('sort-active');
		});*/
	}
	function unGroup(){
		var newList = document.createElement( 'ul' );
		newList.classList.add( 'post-list' );
		document.querySelectorAll( '.post-list li' ).forEach( el => {
			newList.appendChild( el );
		});
		document.querySelectorAll( '.post-list,.post-list-header' ).forEach( el => {
			el.remove();
		});
		postList.appendChild( newList );
	}
	function sortList(list, sortDescending, by) {
	/*	var sortdir = sortDescending? -1: 1;
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
	*/}
});
