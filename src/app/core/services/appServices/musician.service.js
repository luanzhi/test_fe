(function ()
{
  'use strict';

  angular
      .module('app.core')
      .service('MusicianService', MusicianService);

  /** @ngInject */
    function MusicianService(apiUrl, $http, $localStorage)
    {

        this.getMusician = getMusician;
        this.saveMusician = saveMusician;
        this.savePaidInfo = savePaidInfo;
        this.getMusicianById = getMusicianById;

        function getMusician() {

            var req = {
                method: 'get',
                url: apiUrl().musician + '/get-artist',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': $localStorage.session.user.token
                },
            };

            return $http(req).then(function(res){
                // console.log('res',res);
                return res.data;
            });
        }

        function getMusicianById(id){
          var req = {
            method: 'get',
            url: apiUrl().musician + '/' + id + '/get',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': $localStorage.session.user.token
            }
          };

          return $http(req).then(function(res){
              // console.log('res',res);
              return res.data;
          });
        }

        function saveMusician(data){
            if(data.get('artist_id')){
                var id = data.get('artist_id');
                var req = {
                    method: 'post',
                    url: apiUrl().musician + '/' + id + '/update-profile',
                    data: data,
                    headers: {
                        'Content-Type': undefined,
                        'Authorization': $localStorage.session.user.token
                    },

                };

                return $http(req).then(function(res){
                    return res.data;
                });
            } else {
                var req1 = {
                    method: 'post',
                    url: apiUrl().musician + '/add-artist',
                    data: data,
                    headers: {
                        'Content-Type': undefined,
                        'Authorization': $localStorage.session.user.token
                    },
                };

                return $http(req1).then(function(res){
                    return res.data;
                });
            }

        }

        function savePaidInfo(data){
          var req = {
            method : 'POST',
            url : apiUrl().musician + '/save-paid-info',
            headers : {
              'Content-Type' : 'application/json',
              Authorization : $localStorage.session.user.token
            },
            data : data
          };

          return $http(req).then(function(res){
            console.log('Paid Info Saved', res.data);
            return res.data;
          })
        }
    }
})();
