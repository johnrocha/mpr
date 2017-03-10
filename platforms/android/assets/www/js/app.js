angular.module('mpr.utils', [])
    .factory('$localstorage', ['$window', function($window) {
        return {
            set: function(key, value) {
                $window.localStorage[key] = value;
            },
            get: function(key, defaultValue) {
                return $window.localStorage[key] || defaultValue;
            },
            setObject: function(key, value) {
                $window.localStorage[key] = JSON.stringify(value);
            },
            getObject: function(key) {
                return JSON.parse($window.localStorage[key] || '{}');
            },
            addTreino: function(treino, data, distanciaTotal, calculaTempo) {

                var treinos = JSON.parse($window.localStorage['treinos'] || '[]');

                treinos.push({
                    treino: treino,
                    time: data,
                    distanciaTotal: distanciaTotal,
                    tempoTotal: calculaTempo
                });
                $window.localStorage['treinos'] = JSON.stringify(treinos);

            }
        }
    }]);


var teste = angular.module('starter', ['ionic', 'starter.controllers', 'starter.services', 'ngResource', 'timer', 'ngTouch', 'mpr.utils'])
    .constant('appVersion', '1.4.0')
    .constant('base_url', 'http://mpr.mobint.com.br/webservice/')
    .directive('ritmos', ['$compile', function($compile) {
        return {
            restrict: 'E',
            template: '<div></div>',
            scope: {
                mprClick: '=',
                mprEvent: '='
            },
            //transclude : true,
            replace: true,
            link: function(scope, elm, attrs) {

                var e = angular.element('<div>' + scope.mprClick + '</div>');
                $compile(e)(scope);
                elm.append(e);

            }
        };
    }])
    .run(function($ionicPlatform, $rootScope, $location, $http, $ionicModal, $state, $resource, $timeout, LogFactory, base_url) {
        //alert("Device Model: " + device.model + "\nDevice platform" + device.platform + "\nDevice OS: " + device.version);
        var device = null;
        var initIonic = function() {
            $ionicPlatform.ready(function() {

                device = (window.device ? window.device : null);

                $http.get(base_url + 'getprovas').then(function(resp) {
                    console.log(resp);
                    $rootScope.provas = resp.data;
                    //console.log($rootScope);
                }, function(err) {

                    console.log(err);
                })


                // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
                // for form inputs)

                if (window.cordova) {
                    navigator.splashscreen.hide();
                }
                console.log(navigator)
                $rootScope.site_url = base_url;
                console.log($rootScope);

                if (window.cordova && window.cordova.plugins.Keyboard) {
                    cordova.plugins.Keyboard.hideKeyboardAccessoryBar(false);
                }
                if (window.StatusBar) {
                    // org.apache.cordova.statusbar required
                    StatusBar.styleDefault();
                }
                console.log(device);
                if (device)
                    LogFactory.setInfo(device.platform, device.model, device.version, device.uuid);


                console.log('AppReady' + LogFactory.getInfo());
                // alert("Device Model: " + device.model + "\nDevice platform" + device.platform + "\nDevice OS: " + device.version);
            });
        };

        $ionicPlatform.ready(function() {

            if (typeof analytics !== undefined) {

                $timeout(function() {

                    analytics.startTrackerWithId("UA-63202267-1");
                    analytics.trackException('Description', true);

                }, 1);

            } else {

                console.log("Google Analytics Unavailable");
            }


            $location.path("app-out/inicio");
            $rootScope.logado = false;
            $rootScope.passid = null;
            $rootScope.cmsAdmin = null;
            $rootScope.cmsad = null;
            $rootScope.cmsData = null;
            $rootScope.usuario = null;
            $rootScope.relog = false;
            $rootScope.online = navigator.onLine;
            addEventListener("offline", function() {
                $rootScope.$apply(function() {
                    $rootScope.online = false;
                });
            }, false);
            addEventListener("online", function() {
                $rootScope.$apply(function() {
                    $rootScope.online = true;
                });
            }, false);
            // $rootScope.online = true;

            var str = $location.absUrl();
            var res = str.replace("/#" + $location.url(), "");
            $rootScope.urlroot = res;

            if (!($rootScope.logado)) {
                if ($location.url() !== "/app-out/inicio") {

                }
                if ($location.url() == "/app-out/login" || $location.url() == "/app-out/inicio" || $location.url() == "/app-out/locaisdetreino" || $location.url() == "/app-out/calculadora" || $location.url() == "/app-out/calendariodeprovas" || $location.url() == "/app-out/cronometro" || $location.url() == "/app-out/historico" || $location.url() == "/app-out/compartilhar" || $location.url() == "/app-out/sobreampr" || $location.url() == "/app-out/versao") {} else {
                    console.log("saindo2");
                    var banco = openDatabase("MPR", 1.0, "Cadastro do webservice", 2 * 1024 * 1024);
                    banco.transaction(function(fn) {
                        fn.executeSql("UPDATE tablesql SET flag='false' WHERE flag='true'");
                    });

                    $location.path("app-out/inicio");
                }
                $rootScope.$on('$locationChangeStart', function(next, current) {
                    // Se o usuário não está logado devemos redirecionar
                    if ($rootScope.logado) {
                        // Se não está indo para o login, redirecionamos
                        if (next.templateUrl != "app-out/login.html" || next.url != "/") {}
                    }
                    if (!($rootScope.logado)) {
                        if ($location.url() !== "/app-out/inicio") {

                        }
                        if ($location.url() == "/app-out/login" || $location.url() == "/app-out/inicio" || $location.url() == "/app-out/locaisdetreino" || $location.url() == "/app-out/calculadora" || $location.url() == "/app-out/calendariodeprovas" || $location.url() == "/app-out/cronometro" || $location.url() == "/app-out/historico" || $location.url() == "/app-out/compartilhar" || $location.url() == "/app-out/sobreampr" || $location.url() == "/app-out/paginas" || $location.url() == "/app-out/paginas?id=0" || $location.url() == "/app-out/paginas?id=1" || $location.url() == "/app-out/paginas?id=2" || $location.url() == "/app-out/paginas?id=3" || $location.url() == "/app-out/paginas?id=4" || $location.url() == "/app-out/paginas?id=5" || $location.url() == "/app-out/paginas?id=6" || $location.url() == "/app-out/versao") {

                        } else {
                            console.log("saindo2");
                            var banco = openDatabase("MPR", 1.0, "Cadastro do webservice", 2 * 1024 * 1024);
                            banco.transaction(function(fn) {
                                fn.executeSql("UPDATE tablesql SET flag='false' WHERE flag='true'");
                            });
                            console.log("saindo2");
                            $location.path("app-out/inicio");
                        }
                    }
                });


                var banco = openDatabase("MPR", 1.0, "Cadastro do webservice", 2 * 1024 * 1024);
                banco.transaction(function(fn) {

                    fn.executeSql("SELECT * FROM tablesql WHERE flag='true'", [], function(fn, results) {

                        var verflag = results.rows.length;
                        var linha = results.rows;


                        if (verflag === 1) {
                            var flag = linha.item(0).flag;
                            $rootScope.logado = true;
                            $rootScope.cmsData = linha.item(0).cmssql;
                            $rootScope.passid = linha.item(0).id;
                            console.log('APP JS 175');
                            console.log(linha.item(0).flag);
                            console.log('APP JS 175');
                            $location.path("app/inicio");
                        }
                    });
                });


            };



            if ($rootScope.cmsad === null) {
                console.log("pegando dados");
                var adminid = $.param({
                    id: '35396'
                });
                $http({
                        method: 'POST',
                        url: 'http://mpr.mobint.com.br/webservice/infos',
                        data: adminid,
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded'
                        }
                    })
                    .success(function(data, status, headers, config) {

                        cmsad = JSON.stringify(data);

                        var banco = openDatabase("MPR", 1.0, "Cadastro do webservice", 2 * 1024 * 1024);

                        banco.transaction(function(fn) {

                            //cria a tabela - WEB SQL
                            fn.executeSql("CREATE TABLE IF NOT EXISTS tablesqlcms(id INTEGER PRIMARY KEY ASC,cmsadmin TEXT)", [],
                                function() {
                                    if (cmsad !== "") {

                                        //Insere

                                        fn.executeSql("INSERT INTO tablesqlcms(id, cmsadmin) VALUES ('1','" + cmsad + "')");

                                    }
                                });

                            $rootScope.cmsad = data;
                            console.log("cmsad111");
                            console.log($rootScope.cmsad);
                            fn.executeSql("DELETE FROM tablesqlcms WHERE id=1", [], function(fn, results) {});

                            fn.executeSql("SELECT cmsadmin from tablesqlcms WHERE id=1", [], function(fn, results) {

                                var verifica = results.rows.length;

                                if (verifica === 1) {

                                    //Edita

                                    fn.executeSql("UPDATE tablesqlcms SET cmsadmin='" + cmsad + "' WHERE id=1");


                                }


                            });



                        });

                        initIonic();


                    })
                    .error(function(data) {
                        // ToDo Pegar arquivo armazenado no celular
                        // cmsData = JSON.parse(####ARQUIVO####);
                        initIonic();
                    });

            }


            $rootScope.$on('$stateChangeStart', function(event, toState) {

                var estado = toState.name;
                if (typeof analytics !== undefined) {

                    analytics.setUserId('jrmannis@jrmannis.com');
                    analytics.trackView(estado);
                }

                if (toState.name == 'app.inicio') {
                    $rootScope.$broadcast('verificaCMS');
                }
            });
        });
    })
    .config(function($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('app', {
                url: "/app",
                abstract: true,
                templateUrl: "templates/menu.html",
                controller: 'AppCtrl'
            })
            .state('app.search', {
                url: "/search",
                views: {
                    'menuContent': {
                        templateUrl: "templates/search.html"
                    }
                }
            })

        .state('app.locaisdetreino', {
            url: "/locaisdetreino",
            views: {
                'menuContent': {
                    templateUrl: "templates/locaisdetreino.html",
                    controller: 'cms',
                }
            }
        })

        .state('app.versao', {
            url: "/versao",
            views: {
                'menuContent': {
                    templateUrl: "templates/versao-out.html",
                    controller: 'cms',
                }
            }
        })

        .state('app.treinododia', {
            url: "/treinododia",
            views: {
                'menuContent': {
                    templateUrl: "templates/treinododia.html",
                    controller: 'TreinoDoDia',
                }
            }
        })

        .state('app.calculadora', {
            url: "/calculadora",
            views: {
                'menuContent': {
                    templateUrl: "templates/calculadora.html"
                }
            }
        })

        .state('app.calendariodeprovas', {
            url: "/calendariodeprovas",
            views: {
                'menuContent': {
                    templateUrl: "templates/calendariodeprovas.html",
                    controller: 'cms',
                }
            }
        })

        .state('app.ritmosdetreino', {
                url: "/ritmosdetreino",

                views: {
                    'menuContent': {
                        templateUrl: "templates/ritmosdetreino.html",
                        controller: 'RitmosCtrl',
                    }
                }

            })
            .state('app.zonasdefc', {
                url: "/zonasdefc",
                views: {
                    'menuContent': {
                        templateUrl: "templates/zonasdefc.html",
                        controller: 'ZonasFC',

                    }
                }
            })

        .state('app.feedbackdetreino', {
            url: "/feedbackdetreino",
            views: {
                'menuContent': {
                    templateUrl: "templates/feedbackdetreino.html",
                    controller: "FeedbackDeTreino"
                }
            }
        })

        .state('app.planilha', {
            url: "/planilha",
            views: {
                'menuContent': {
                    templateUrl: "templates/planilha.html",
                    controller: 'Planilha',
                }
            }
        })

        .state('app.sobreampr', {
            url: "/sobreampr",
            views: {
                'menuContent': {
                    templateUrl: "templates/sobreampr.html",
                    controller: 'cms',
                }
            }
        })



        .state('app.galerias', {
                url: "/galerias",
                views: {
                    'menuContent': {
                        templateUrl: "templates/galerias.html",
                        controller: 'cms',
                    }
                }
            })
            .state('app.fotos', {
                url: "/fotos",
                views: {
                    'menuContent': {
                        templateUrl: "templates/fotos.html",
                        controller: 'cms',
                    }
                }
            })
            .state('app.inicio', {
                url: "/inicio",
                views: {
                    'menuContent': {
                        templateUrl: "templates/inicio.html",
                        controller: 'Inicio',
                    }
                }
            })

        .state('app.cronometro', {
                url: "/cronometro",
                views: {
                    'menuContent': {
                        templateUrl: "templates/cronometro.html",
                        controller: 'Cronometro'
                    }
                }
            })
            .state('app.historico', {
                url: "/historico",
                views: {
                    'menuContent': {
                        templateUrl: "templates/historico.html",
                        controller: 'historico'
                    }
                }
            })
            .state('app.mensageria', {
                url: "/mensageria",
                views: {
                    'menuContent': {
                        templateUrl: "templates/mensageria.html",
                        controller: 'Mensageria'
                    }
                }
            })
            .state('app.compartilhar', {
                url: "/compartilhar",
                views: {
                    'menuContent': {
                        templateUrl: "templates/compartilhar.html",
                        controller: 'Cronometro'
                    }
                }
            })

        //Páginas

        .state('app.paginas', {
            url: "/paginas",
            views: {
                'menuContent': {
                    templateUrl: "templates/locais/paginas.html",
                    controller: 'cms'
                }
            }
        })


        //App-Out
        .state('app-out', {
                url: "/app-out",
                abstract: true,
                templateUrl: "templates/menu-out.html",
                controller: 'AppCtrl'
            })
            .state('app-out.login', {
                url: "/login",
                views: {
                    'menuContent': {
                        templateUrl: "templates/login.html"
                    }
                }
            })


        .state('app-out.locaisdetreino', {
            url: "/locaisdetreino",
            views: {
                'menuContent': {
                    templateUrl: "templates/locaisdetreino-out.html",
                    controller: 'cms',
                }
            }
        })


        .state('app-out.versao', {
            url: "/versao",
            views: {
                'menuContent': {
                    templateUrl: "templates/versao-out.html",
                    controller: 'cms',
                }
            }
        })

        .state('app-out.sobreampr', {
            url: "/sobreampr",
            views: {
                'menuContent': {
                    templateUrl: "templates/sobreampr-out.html",
                    controller: 'cms',
                }
            }
        })

        .state('app-out.inicio', {
            url: "/inicio",
            views: {
                'menuContent': {
                    templateUrl: "templates/mpr.html",
                    controller: 'mpr'
                }
            }
        })

        .state('app-out.calendariodeprovas', {
                url: "/calendariodeprovas",
                views: {
                    'menuContent': {
                        templateUrl: "templates/calendariodeprovas-out.html",
                        controller: 'cms',
                    }
                }
            })
            .state('app-out.calculadora', {
                url: "/calculadora",
                views: {
                    'menuContent': {
                        templateUrl: "templates/calculadora-out.html"
                    }
                }
            })
            .state('app-out.cronometro', {
                url: "/cronometro",
                views: {
                    'menuContent': {
                        templateUrl: "templates/cronometro-out.html",
                        controller: 'Cronometro'
                    }
                }
            })
            .state('app-out.historico', {
                url: "/historico",
                views: {
                    'menuContent': {
                        templateUrl: "templates/historico-out.html",
                        controller: 'historico'
                    }
                }
            })
            .state('app-out.compartilhar', {
                url: "/compartilhar",
                views: {
                    'menuContent': {
                        templateUrl: "templates/compartilhar-out.html",
                        controller: 'Cronometro'
                    }
                }
            })
            .state('app-out.paginas', {
                url: "/paginas",
                views: {
                    'menuContent': {
                        templateUrl: "templates/locais/paginas.html",
                        controller: 'cms'
                    }
                }
            });
        /*        .state('app.single', {
        	url: "/inicio/:playlistId",
        	views: {
        		'menuContent': {
        			templateUrl: "templates/playlist.html",
        			controller: 'PlaylistCtrl'
        		}
        	}
        });*/

        // if none of the above states are matched, use this as the fallback
        $urlRouterProvider.otherwise('/app-out/inicio');
    });

//Importante Filter para ordenar os arrays
/*app.filter("toArray", function(){
    return function(obj) {
        var result = [];
        angular.forEach(obj, function(val, key) {
            result.push(val);
        });
        return result;
    };
});*/