window.addEventListener('DOMContentLoaded', event => {
    /* vimeo wall */
    let vimeo_wall = document.getElementById('vimeo_wall');
    if ( vimeo_wall !== null ) {
        let request = new XMLHttpRequest();
        request.open( 'GET', 'https://vimeo.com/api/v2/bjorsq/videos.json', true );
        request.addEventListener( 'load', function() {
            if ( request.status >= 200 && request.status < 400 ) {
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
                sortList( postList, sortDescending, 'title' );
                document.querySelectorAll( '.sort-link' ).forEach( el => { el.classList.remove( 'sort-active' ); } );
                event.target.classList.add( 'sort-active' );
                event.target.textContent = newText;
            } else if ( event.target.classList.contains( 'sort-type' ) ) {
                event.preventDefault();
                if ( document.querySelectorAll( '.post-list' ).length > 1 ) {
                    unGroup();
                } else {
                    document.querySelectorAll( '.sort-link' ).forEach( el => { el.classList.remove( 'sort-active' ); } );
                    event.target.classList.add( 'sort-active' );
                    for ( tagname in tags ) {
                        document.getElementById( 'maincontainer' ).append('<h3 class="post-list-header">'+tagname.substr(0,1).toUpperCase()+tagname.substr(1)+'</h3>');
                        let taglist = document.createElement( 'ul' );
                        taglist.classList.add( 'post-list' );
                        tags[tagname].forEach( li => {
                            taglist.appendChild( li );
                        });
                        sortList( taglist, true, 'title' );
                        document.getElementById( 'maincontainer' ).append( taglist );
                    }
                }
            }
        });
    }
    /**
     * un-groups items placed in separate lists under headings for
     * tags by removing them all and re-adding as a single list
     */
    function unGroup() {
        var newList = document.createElement( 'ul' );
        newList.classList.add( 'post-list' );
        document.querySelectorAll( '.post-list li' ).forEach( el => {
            newList.appendChild( el );
        });
        document.querySelectorAll( '.post-list,.post-list-header' ).forEach( el => {
            el.remove();
        });
        sortList( newList, true, 'title' );
        postList.appendChild( newList );
    }
    /**
     * Sorts a list in place by the value found in different data attributes
     * @param {DOM Fragment} list - list to be sorted
     * @param {boolean} sortDescending - which direction to sort
     * @param {string} by - the name of the data attribute to sort by
     */
    function sortList( list, sortDescending, by ) {
        let sortdir = sortDescending? -1: 1;
        let sortby = ( by && by === 'date' )? 'date': 'title';
        let listitems = list.querySelectorAll( 'li' );
        /* sort the list items */
        let listitemsArray = Array.prototype.slice.call( listitems ).sort( comparer( sortdir, 'data-' + sortby ) );
        listitemsArray.forEach( el => {
            list.appendChild( el );
        });
    }
    /**
     * Comparer function
     * @param {boolean} asc ascending or decending sort mode
     * @param {string} attr attribute name for sort key
     * @returns sorting function for Array.sort()
     */
    function comparer( asc, attr ) {
        /**
         * the function to perform the comparison
         * @param {(integer|string)} a first value to sort
         * @param {(integer|string)} b second value to sort
         * @returns {integer} -1, 0 or 1
         */
        return function ( a, b ) {
            /**
             * Main comparison function. Uses isNaN to distinguish between
             * numeric and alphabetic sorting modes, and localeCompare() to
             * compare strings. 
             * switches between asc / desc ordering
             * @param {(integer|string)} v1 first value to sort
             * @param {(integer|string)} v2 second value to sort
             */
            let aval = asc ? a.getAttribute( attr ): b.getAttribute( attr );
            let bval = asc ? b.getAttribute( attr ): a.getAttribute( attr );
            return function( v1, v2 ) {
                return v1 !== '' && v2 !== '' && ! isNaN( v1 ) && ! isNaN( v2 ) ? v1 - v2 : v1.toString().localeCompare( v2 );
            }( aval, bval );
        };
    };
});
