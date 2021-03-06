angular.module('myApp').factory('userLibrary', function($rootScope, $http, users, apiUrl, utils) {
  var library = {

    /**
     * Whether or not library is fully loaded from server.
     *
     * @type {boolean}
     */
    loaded: false,

    /**
     * All tracks current user has added to his library.
     *
     * @type {array}
     */
    tracks: [],

    /**
     * All albums current user has added to his library.
     *
     * @type {array}
     */
    albums: [],

    /**
     * All artists current user has added to his library.
     *
     * @type {array}
     */
    artists: [],

    /**
     * Email of user for which library is loaded.
     *
     * @type {string|false}
     */
    forUser: false,

    /**
     * Add tracks to users library.
     *
     * @param {object|array} tracks
     */
    addTracks: function(tracks) {
      if ( ! angular.isArray(tracks)) tracks = [tracks];

      var ids = tracks.map(function(t) { return t.id });

      $http.post('user-library/add-tracks', { tracks: ids }).success(function() {
        library.tracks = library.tracks.concat(tracks);
      })
    },

    /**
     * Remove tracks from users library.
     *
     * @param {object} tracks
     */
    removeTracks: function(tracks) {
      if ( ! angular.isArray(tracks)) tracks = [tracks];

      var ids = tracks.map(function(t) { return t.id });

      $http.post('user-library/remove-tracks', { tracks: ids }).success(function() {
        for (var i = 0; i < library.tracks.length; i++) {
          if (ids.indexOf(library.tracks[i].id) > -1) {
            library.tracks.splice(i, 1);
          }
        }
      })
    },

    /**
     * Check if user has already added given track to his library.
     *
     * @param {object} track
     * @returns {boolean}
     */
    has: function(track) {
      // console.log('has', $rootScope.getAll);
      if($rootScope.getAll){
        if ( ! track || ! $rootScope.getAll.tracks) {
          // console.log('false');
          return false

        };
        for (var i = 0; i < $rootScope.getAll.tracks.length; i++) {
          // console.log('id', $rootScope.getAll.tracks[i].id, 'track', track.id);
          if ($rootScope.getAll.tracks[i].id == track.id) return true;
        }
      }


      return false;
    },

    /**
     * Get all tracks of given artist user has added to his library.
     *
     * @param {string} name
     * @returns {Array}
     */
    getArtistTracks: function(name) {
        var tracks = [];

         this.tracks.forEach(function(track) {
         if (track.artists.indexOf(name) > -1) {
         tracks.push(track);
         }
         });


      return tracks;
    }
  };

  if (users.current && ! library.loaded) {
    getAll();
  }

  /**
   * Fetch users library when new current user is assigned.
   */
  $rootScope.$on('user.newCurrent', function() {
    if ( ! library.loaded || library.forUser !== users.current.email) {
      getAll();
    }
  });

  /**
   * Get all songs, albums and artists in users library.
   */
  function getAll() {
    // console.log('getArtistTracks',$rootScope.getAll);
    var req = {
      method: 'GET',
      url: apiUrl().get_all,
      headers: {
        'Content-Type': 'application/json',
        Authorization: $localStorage.session.user.token
      }
    };
    $http(req).success(function(data) {
        // console.log('user-library', data);
      library.tracks  = data['tracks'];
      library.albums  = data['albums'];
      library.artists = data['artists'];
      library.loaded  = true;

      library.forUser = users.current.email;
    });
  }

  return library;
});
