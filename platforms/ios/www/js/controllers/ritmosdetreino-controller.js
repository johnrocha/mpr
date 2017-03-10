
angular.module('RitmosDeTreinoController',[])
    .controller('RitmosCtrl', function($rootScope, $http, $scope, $location) {

    $scope.posts = {};

        $http({
            method: 'GET',
            url: $rootScope.site_url + '/webservice/app_treinodia.php'
        })
        .success(function(data, status, headers, config) {

            var ritmos = [];
            for ( var contador = 0; contador < data.ritmos[0].ritmo.length; contador++) {
                
                var conteudo = data.ritmos[0].ritmo[contador];

                ritmos.push({"modalidade":conteudo.modalidade});
            
            }

            console.log(ritmos);
            $scope.posts = ritmos;

        })
        .error(function(data){
            $scope.posts = data;
            var alertPopup = $ionicPopup.alert({
                title: '<b>Erro</b>',
                template: '<span class="text-center">' + data + '</span>'
            });

            console.log('Erro:' + data);

        });
        $scope.toggleGroup = function(group) {
            if ($scope.isGroupShown(group)) {
                $scope.shownGroup = null;
            } else {
                $scope.shownGroup = group;
            }
        };
        $scope.isGroupShown = function(group) {
            return $scope.shownGroup === group;
        };

    });