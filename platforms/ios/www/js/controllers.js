angular.module('starter.controllers', [])
    .filter('trustAsHtml', function($sce) {
        return $sce.trustAsHtml;
    })
    .filter('vazio', function() {
        return function(arr) {
            var temp = [];
            for (var i = 0; i < arr.length; i++) {
                if (arr[i].treinos.length > 0) temp.push(arr[i]);
            }
            return temp;
        };
    })
    .filter('professor', function() {
        return function(arr, professor) {
            if (professor.user_id == 0) return arr;
            var temp = [];
            for (var i = 0; i < arr.length; i++) {
                var fim = false;
                for (var j = 0; j < arr[i].treino.professores.length && !fim; j++) {
                    if (arr[i].treino.professores[j].user_id == professor.user_id) {
                        fim = true;
                        temp.push(arr[i]);
                    }
                }
            }
            return temp;
        };
    })
    .filter('modalidade', function() {
        return function(arr, modalidade) {
            if (modalidade.modalidade_id == 0) return arr;
            var temp = [];
            for (var i = 0; i < arr.length; i++) {
                if (arr[i].modalidade.modalidade_id == modalidade.modalidade_id) {
                    temp.push(arr[i]);
                }
            }
            return temp;
        };
    })
    .filter('dia', function() {
        return function(arr, dia) {
            var temp = [];
            for (var i = 0; i < arr.length; i++) {
                if (arr[i].bool && arr[i].name.substring(0, 3).toUpperCase() == dia) temp.push(arr[i]);
            }
            return temp;
        }
    })
    .controller('teste', function($scope, $rootScope, $state, $ionicModal, $timeout, $http, $ionicPopup) {
        $rootScope.$broadcast('horarioErrado');
    })
    .controller('AppCtrl', function($scope, $rootScope, $state, $ionicModal, $timeout, $http, $ionicPopup, $ionicLoading, LogFactory, appVersion, $localstorage, base_url) {
        // Form data for the login modal
        $rootScope.$on('horarioErrado', function(event) {
            var intervalo;
            $(document).ready(function() {
                intervalo = setInterval(function() {
                    var index = window.location.href.lastIndexOf("/") + 1;
                    var filename = window.location.href.substr(index);
                    if (filename !== "feedbackdetreino") {
                        clearInterval(intervalo);
                        return;
                    }
                    ver1 = verificar();
                    ver2 = verificar2();
                    var button = !(ver1 == true && ver2 == true &&
                        document.getElementById('data').value != '' &&
                        document.getElementById('descricao').value != '');
                    document.getElementById('button_calc').disabled = button;

                }, 20)
            });

            function initIonic() {
                $state.go('app.inicio');
            }


            function verificar() {
                var button = true;
                var cond1 = false;
                var cond2 = false;
                val = document.getElementById('inicio').value.replace(/[^0-9]/g, "");
                if (val == '0' || val == '00') {
                    val = '';
                }
                if (val != 0) {
                    if (val.substr(1) == '') {
                        val = '0:0'.concat(val);
                    } else if (val.substr(2) == '') {
                        if (val.substr(0, 1) > 5) {
                            button = false;

                        }
                        val = ('0:' + val);
                    } else if (val.substr(3) == '') {
                        if (val.substr(1, 1) > 5) {
                            button = false;
                            cond1 = true;
                        }
                        val = val.substr(0, 1) + ':' + val.substr(1);
                    } else if (val.substr(4) != '') {
                        if (val.substr(2, 1) > 5) {
                            button = false;

                        }
                        val = val.substr(0, 2) + ':' + val.substr(2, 2);
                    } else {
                        if (val.substr(2, 1) > 5) {
                            button = false;
                        }
                        // console.log(val.substr(2, 2));
                        if (val.substr(2, 2) > 59) {
                            button = false;
                            cond1 = true;
                        }

                        if (val.substr(0, 2) > 23) {
                            button = false;
                            cond2 = true;
                        }
                        val = val.substr(0);
                        if (val.substr(0, 2) == '00' || val.substr(0, 1) == 0) {
                            val = val.substr(1, 1) + ':' + val.substr(2);
                        } else {
                            val = val.split("").reverse().join("");
                            val = val.substr(2).split("").reverse().join("") + ':' +
                                val.substr(0, 2).split("").reverse().join("");
                        }
                    }
                } else {
                    button = false;
                }

                /*document.getElementById('botao').disabled = !button;
                 */

                //console.log('-1-'+cond2);
                //console.log('-2-'+cond1);
                //console.log(button);
                //console.log(document.activeElement.id);
                document.getElementById('inicio').value = val;
                if (button == false && document.getElementById('inicio').value !== "" && document.activeElement.id != 'inicio') {
                    if (cond1 == true) {
                        $scope.showAlert('Horário Invalido, digite um valor abaixo de 60 minutos');
                        document.getElementById('inicio').value = "";
                    } else if (cond2 == true) {
                        $scope.showAlert('Horário Invalido, digite um valor abaixo de 24 horas');
                        document.getElementById('inicio').value = "";
                    }
                }


                return button;
            }

            function verificar2() {

                var button = true;
                var cond_dur1 = false;
                var cond_dur2 = false;
                var cond_dur3 = false;
                val = document.getElementById('duracao').value.replace(/[^0-9]/g, "");

                if (val == '0' || val == '00' || val == '000' || val == '0000' || val == '00000') {

                    val = ''
                }
                if (val != 0) {

                    if (val.substr(1) == '') {

                        val = '00.00:0'.concat(val);

                    } else if (val.substr(2) == '') {

                        if (val.substr(0, 1) > 5) {

                            button = false;

                            cond_dur2 = true;

                        }

                        val = ('00.00:' + val);

                    } else if (val.substr(3) == '') {

                        if (val.substr(1, 1) > 5) {

                            button = false;

                            cond_dur2 = true;

                        }

                    } else if (val.substr(4) == '') {

                        if (val.substr(0, 1) > 5 || val.substr(2, 1) > 5) {

                            button = false;

                            cond_dur1 = true;

                        }
                        if (val.substr(0, 2) == '00' || val.substr(0, 1) == 0) {

                            val = '00:' + val.substr(1, 1) + ':' + val.substr(2);

                        } else {

                            val = '00:' + val.substr(0, 2) + ':' + val.substr(2);
                        }

                    } else if (val.substr(5) == '') {

                        if (val.substr(3) > 59) {

                            // console.log(val.substr(3));

                        }

                        if (val.substr(1, 1) > 5) {

                            button = false;

                            cond_dur2 = true;

                        }

                        if (val.substr(3, 1) > 5) {

                            button = false;

                            cond_dur1 = true;

                        }

                        val = val.substr(0, 1) + ':' + val.substr(1, 2) + ':' + val.substr(3);

                        if (val.substr(5) > 59) {

                        }

                        // console.log(val.substr(5));
                    } else {

                        if (val.substr(4) > 59) {
                            // console.log(val.substr(3));
                            cond_dur1 = true;

                        }

                        if (val.substr(2, 1) > 5 || val.substr(4, 1) > 5) {
                            button = false;

                            cond_dur2 = true;

                        }
                        if (val.substr(0, 1) == '0') {

                            val = val.substr(1, 2) + ':' + val.substr(3, 2) + ':' + val.substr(5, 2);
                        } else {

                            val = val.substr(0, 2) + ':' + val.substr(2, 2) + ':' + val.substr(4, 2);
                        }
                        // }
                        // if (val.substr(5) == '' && val.substr(4) != '') {

                        //     if (val.substr(0, 1) < 6 && val.substr(val.indexOf(':') + 1, 1) < 6) {

                        //         ret = true;
                        //     }
                        // }
                    }
                } else {

                    button = false;

                }

                document.getElementById('duracao').value = val;
                //console.log(button);
                if (button == false && document.getElementById('duracao').value != "" && document.activeElement.id != 'duracao') {
                    // console.log('banana');

                    if (cond_dur1 == true) {

                        // console.log("indo2");
                        $scope.showAlert('Horário Invalido, digite um valor abaixo de 60 segundos');
                        document.getElementById('duracao').value = "";

                    } else if (cond_dur2 == true) {
                        $scope.showAlert('Horário Invalido, digite um valor abaixo de 60 minutos');
                        document.getElementById('duracao').value = "";
                    }
                }

                return button;
            }

        });
        $scope.loginData = {};
        // Create the login modal that we will use later
        $ionicModal.fromTemplateUrl('templates/login.html', {
            scope: $scope
        }).then(function(modal) {
            $scope.modal = modal;
        });
        $scope.reloadRoute = function() {
            //location.assign('http://localhost:5000/git_projetos/MPR/www');
        };
        // Triggered in the login modal to close it
        $scope.closeLogin = function() {
            $scope.modal.hide();

        };
        // Open the login modal
        $scope.login = function() {
            $scope.modal.show();
        };
        // A confirm dialog
        $scope.showConfirm = function() {
            // var confirmPopup = $ionicPopup.confirm({
            //     title: 'MPR',
            //     template: '<p>Deseja sair?</p>',
            //     okText:'Sair',
            //     cancelText:'Voltar'
            // });
            var confirmPopup = $ionicPopup.show({
                title: 'MPR',
                template: '<p>Deseja sair?</p>',
                buttons: [{
                    text: 'Cancelar',
                    onTap: function(e) {
                        return false;
                    }
                }, {
                    text: '<b>Sair</b>',
                    type: 'button-positive',
                    onTap: function(e) {
                        return true;
                    }
                }]
            });
            confirmPopup.then(function(res) {
                if (res) {
                    var banco = openDatabase("MPR", 1.0, "Cadastro do webservice", 2 * 1024 * 1024);
                    banco.transaction(function(fn) {

                        fn.executeSql("DROP TABLE IF EXISTS tablesql", [], function(t, results) {
                            window.location.href = $rootScope.urlroot;

                        });


                        $rootScope.cmsData = null;
                        $rootScope.login = {};
                        $rootScope.usuario = {};
                        // console.log("teste");
                    });



                } else {

                }
            });
        };



        //deletar
        $scope.showImages = function(index) {
            $scope.activeSlide = index;
            $scope.showModal('templates/image-popover.html');
        };

        $scope.showModal = function(templateUrl) {
            $ionicModal.fromTemplateUrl(templateUrl, {
                scope: $scope,
                animation: 'slide-in-up'
            }).then(function(modal) {
                $scope.modal = modal;
                $scope.modal.show();
            });
        };

        // Close the modal
        $scope.closeModal = function() {
            $scope.modal.hide();
            $scope.modal.remove();
        };


        // An alert dialog
        $scope.showAlert = function(info) {
            var alertPopup = $ionicPopup.alert({
                title: 'MPR',
                template: info,
            });
            alertPopup.then(function(res) {
                // console.log('OK!');
            });
        };
        // Groups
        // Perform the login action when the user submits the login form    
        $rootScope.login = {};
        $rootScope.usuario = {};

        $scope.doAtualiza = function() {
            $rootScope.tentouAtualizarPlanilha = true;
            if ($rootScope.online) {
                var info = LogFactory.getInfo();
                console.log('pass');

                var planilhaID = $.param({
                    id: $rootScope.passid,
                    platform: info.platform,
                    version: info.osVersion,
                    model: info.model,
                    appVersion: appVersion,
                    UUID: info.UUID
                });

                $(".button").hide(10);
                $ionicLoading.show({
                    template: 'Carregando'
                });

                console.log('pIdo ' + planilhaID);
                $http({
                    method: 'POST',
                    url: 'http://mpr.mobint.com.br/webservice/infos',
                    data: planilhaID,
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                })

                .success(function(data, status, headers, config) {

                        $ionicLoading.hide();
                        console.log('cms success');
                        console.log(data);
                        var cms = data;
                        $scope.cms = cms;
                        $scope.cms.ritmosEscolhidos = null;
                        $scope.cms.ritmosEscolhidos = $scope.cms.ritmosNovo.Corrida;
                        console.log('CMS CMS CMSfdsfdsfdsfdsf   ');
                        //console.log($scope.cms);
                        var cmssql = JSON.stringify(cms);

                        console.log($scope.cms);
                        //console.log(cmssql);



                        var banco = openDatabase("MPR", 1.0, "Cadastro do webservice", 2 * 1024 * 1024);
                        banco.transaction(function(fn) {

                            fn.executeSql("UPDATE tablesql SET cmssql='" + cmssql + "' WHERE id=" + $rootScope.passid);
                            // console.log("UPDATE tablesql SET cmssql='" + cmssql + "' WHERE id=" + $rootScope.passid);

                            /*                        fn.executeSql("DROP TABLE IF EXISTS tablesql", [], function(t, results) {});
                                                    fn.executeSql("CREATE TABLE IF NOT EXISTS tablesql(id INTEGER PRIMARY KEY ASC, cmssql TEXT, flag varchar(5))", [],
                                                        function() {
                                                            if (cmssql !== "") {
                                                                fn.executeSql("INSERT INTO tablesql (id, cmssql, flag) VALUES (" + id_user + ",'" + cmssql + "', 'true')", [], function(fn, results) {
                                                                    console.log(results);
                                                                });

                                                                window.location.href = $rootScope.urlroot;

                                                               
                                                            }
                                                        });*/

                            $rootScope.relog = true;
                            $rootScope.cmsData = cmssql;
                            $ionicLoading.hide();
                            $state.go('app.inicio');
                            /*     var url = $rootScope.urlroot+"#/app/ritmosdetreino";
                                 console.log(url);
                                 window.location.href = url;*/

                        });
                    })
                    .error(function(data) {
                        $ionicLoading.hide();
                        // ToDo Pegar arquivo armazenado no celular
                        // cmsData = JSON.parse(####ARQUIVO####);
                        // console.log("teste");
                        initIonic();
                    });
            } else {
                $scope.showAlert('Sem internet');

            }



            /*            var banco = openDatabase("MPR", 1.0, "Cadastro do webservice", 2 * 1024 * 1024);
                        banco.transaction(function(fn) {
                            fn.executeSql("SELECT id from tablesql", [], function(fn, results) {
                                var linha = results.rows;
                                id_user = JSON.parse(linha.item(0).id);
                                $rootScope.passid = id_user;
                                atualizar_planilha(id_user);
                            });
                        });*/



        };


        $scope.doLogin = function() {
            $ionicLoading.show({
                template: 'Carregando'
            });
            if ($rootScope.online) {
                var url = 'http://mpr.mobint.com.br/webservice';
                var info = LogFactory.getInfo();
                var userCredenciais = $.param({
                    email: $scope.loginData.username,
                    senha: $scope.loginData.password,
                    platform: info.platform,
                    version: info.osVersion,
                    model: info.model,
                    appVersion: appVersion,
                    UUID: info.UUID
                });

                LogFactory.setUsername($scope.loginData.username);



                $http({
                        method: 'POST',
                        url: url,
                        data: userCredenciais,
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded'
                        }
                    })
                    .success(function(data, status, headers, config) {
                        //$(".button").hide(10);

                        $localstorage.setObject('userEmail', $scope.loginData.username);

                        $(".erroulogin").hide(10);
                        $(".seminternet").hide(10);

                        var users = data;
                        console.log('users', users)
                            // $http.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
                            // $rootScope.login.username = users.username;
                            // $rootScope.login.password = users.password;
                        $rootScope.logado = true;
                        $rootScope.usuario = users.username;

                        var userID = $.param({
                            id: users.id,
                            platform: info.platform,
                            version: info.osVersion,
                            model: info.model,
                            appVersion: appVersion,
                            UUID: info.UUID
                        });
                        $rootScope.passid = users.id;
                        $http({
                                method: 'POST',
                                url: 'http://mpr.mobint.com.br/webservice/infos',
                                data: userID,
                                headers: {
                                    'Content-Type': 'application/x-www-form-urlencoded'
                                }
                            })
                            .success(function(data, status, headers, config) {


                                $scope.url = $rootScope.urlroot;
                                cms = data;
                                $scope.cms = cms;
                                // console.log(data);

                                $localstorage.setObject('locaisdetreino', data.locais);

                                console.log($localstorage.getObject('locaisdetreino'));

                                document.cookie = data.session_name + '=' + data.sessid + '; path=' + url;
                                //$http.defaults.withCredentials = true;
                                //$http.defaults.headers.common['X-CSRF-Token'] = data.token;
                                //$http.defaults.headers.common['Accept'] = 'application/json';
                                //OpenDATABASE(nomeDoBanco,Versao, Descricao,Tamanho);
                                var banco = openDatabase("MPR", 1.0, "Cadastro do webservice", 2 * 1024 * 1024);
                                // deleta dados WEBSQL
                                //banco.transaction(function (fn){
                                //fn.executeSql("DELETE FROM websqltable WHERE id=1");
                                //});
                                //var conteudo = document.forms.formSQL.conteudo;
                                //var conteudo = document.forms.formSQL.conteudo;

                                var cmssql = JSON.stringify(cms);
                                banco.transaction(function(fn) {


                                    /* fn.executeSql("SELECT cmssql from tablesql WHERE id="+users.id,[], function (fn, results) {

                                    var verifica = results.rows.length;

                                    console.log(verifica);

                                    if(verifica===1){
                                //Edita
                                fn.executeSql("UPDATE cmssql SET cmsadmin='" + cmssql + "' WHERE id="+users.id);
                                $rootScope.cmsad = cmsad;
                                }
                            });*/



                                    fn.executeSql("DROP TABLE IF EXISTS tablesql", [], function(t, results) {});


                                    //cria a tabela - WEB SQL
                                    fn.executeSql("CREATE TABLE IF NOT EXISTS tablesql(id INTEGER PRIMARY KEY ASC, cmssql TEXT, flag varchar(5))", [],
                                        function() {
                                            if (cmssql !== "") {
                                                //Insere 
                                                fn.executeSql("INSERT INTO tablesql (id, cmssql, flag) VALUES (" + users.id + ",'" + cmssql + "', 'true')", [], function(fn, results) {



                                                });


                                                $rootScope.cmsData = cmssql;
                                                $ionicLoading.hide();
                                                $state.go('app.inicio');
                                            }
                                        });



                                });
                                /*
                            banco.transaction(function(fn){
                                fn.executeSql("SELECT conteudo from websql",[],
                                    function (fn, results){

                                        var linha = results.rows;

                                        var cmsData = JSON.parse(linha.item(0).conteudo);


                                        console.log(cmsData);
                                        alert(cmsData);
                                    });
                            });
                            console.log("dasds");
                            console.log(tete+"dasds");
                            */
                                /*conteudo = data;

                                localStorage.conteudo = JSON.stringify(conteudo);*/
                                //console.log(localStorage.conteudo);

                                // ToDo: Atualizar o arquivo de armazenamento no celular
                            })
                            .error(function(data) {
                                // ToDo Pegar arquivo armazenado no celular
                                // cmsData = JSON.parse(####ARQUIVO####);
                                // console.log("teste");
                                var form = document.getElementById("IdForm");
                                form.reset();
                                $ionicLoading.hide();
                                $scope.showAlert('Houve um problema na conexão. Tente novamente.');
                                initIonic();
                            });
                        // ToDo: Atualizar o arquivo de armazenamento no celular
                    })
                    .error(function(data) {
                        var form = document.getElementById("IdForm");
                        form.reset();
                        $ionicLoading.hide();
                        $scope.showAlert('Usuário e/ou senha incorretos');
                        // ToDo Pegar arquivo armazenado no celular
                        // cmsData = JSON.parse(####ARQUIVO####);

                        initIonic();
                    });
                // Simulate a login delay. Remove this and replace with your login
                // code if using a login system
                //$ionicLoading.hide();
                // $timeout(function() {
                //     $scope.closeLogin();
                // }, 1000);
            } else {
                $ionicLoading.hide();
                $scope.showAlert('Sem internet');
            }
        };
    })
    .controller('RitmosCtrl', function($rootScope, $http, $scope, $location, $ionicPopup, LogFactory) {

        $scope.nomeUsuario = LogFactory.getUsername();


        $scope.inArray = function(modalidade) {
            var existe = false;
            for (var j = 0; j < tempRitmos.length; j++) {
                if (tempRitmos[j].modalidade == modalidade) {
                    existe = true;
                }
            }
            return existe;
        };

        //verifica se ja existe determinada legenda para o ritmo de uma modalidade
        //retorna true or false
        $scope.inArrayLegenda = function(modalidade, legenda) {
            var existeLegenda = false;
            for (var i = 0; i < tempRitmos.length; i++) {

                if (tempRitmos[i].modalidade == modalidade) {

                    for (var j = 0; j < tempRitmos[i].ritmos.length; j++) {

                        if (tempRitmos[i].ritmos[j].legenda == legenda) {

                            existeLegenda = true;
                        }
                    }
                }
            }
            return existeLegenda;
        };

        //Função chamada para saber qual é o index da modalidade na array tempRitmos
        $scope.indexOfArray = function(modalidade) {
            for (var i = 0; i < tempRitmos.length; i++) {
                if (tempRitmos[i].modalidade == modalidade) {
                    return i;
                }
            }
        };

        $scope.indexOfArrayRit = function(modalidade, legenda) {

            for (var i = 0; i < tempRitmos.length; i++) {

                if (tempRitmos[i].modalidade == modalidade) {

                    for (var j = 0; j < tempRitmos[i].ritmos.length; j++) {


                        if (tempRitmos[i].ritmos[j].legenda == legenda) {
                            // console.log("teste");
                            return j;

                        }

                    }
                }
            }
        };

        $scope.apenasNum = function(string) {
            var numsStr = string.replace(/[^0-9]/g, '');
            return parseInt(numsStr);
        }



        //Variavel de ritmos que recebemos
        // console.log(cmsData.ritmos);
        var tempRitmos = []; //array que vamos usar para estabelecer as modalidades e ritmos
        //Para cada item da array de ritmos verifcar se(continua)
        for (var i = 0; i < cmsData.ritmos.length; i++) {
            //ja existe a modalidade na nossa array final
            var existe = $scope.inArray(cmsData.ritmos[i].ritmo.modalidade);
            $scope.cms = cmsData;
            if (!existe) {
                //se nao existir então vamos acresentar a ela deixando os ritmos com um array vazio
                tempRitmos.push({
                    modalidade: cmsData.ritmos[i].ritmo.modalidade,
                    ritmos: []
                });
            }
            //Extrair parte a esquerda da legenda
            var legenda = cmsData.ritmos[i].ritmo.legenda.substr(0, cmsData.ritmos[i].ritmo.legenda.indexOf(' ('));
            //verificar se já existe legenda para aquele ritmo em uma determinada modalidade
            // console.log(legenda);
            legenda = legenda.replace("confortável", "<n class='novoVerde'>confortável</n>");
            legenda = legenda.replace("Confortavel", "<n class='novoVerde'>confortável</n>");
            legenda = legenda.replace("confortavel", "<n class='novoVerde'>confortável</n>");
            legenda = legenda.replace("Firme", "<n class='novoVermelho'>firme</n>");
            legenda = legenda.replace("firme", "<n class='novoVermelho'>firme</n>");
            legenda = legenda.replace("moderado", "<n class='novoAmarelo'>moderado</n>");
            legenda = legenda.replace("Moderado", "<n class='novoAmarelo'>moderado</n>");
            legenda = legenda.replace("forte", "<n class='novoRosa'>forte</n>");
            legenda = legenda.replace("Forte", "<n class='novoRosa'>forte</n>");
            legenda = legenda.replace(/leve/g, "<n class='novoAzul'>leve</n>");
            legenda = legenda.replace(/Leve/g, "<n class='novoAzul'>leve</n>");
            legenda = legenda.replace(/LEVE/g, "<n class='novoAzul'>leve</n>");
            var existeLegenda = $scope.inArrayLegenda(cmsData.ritmos[i].ritmo.modalidade, legenda);
            // console.log('Existe legenda == ' + existeLegenda);
            //se não existir então acrescentamos a legenda
            if (!existeLegenda) {

                var index = $scope.indexOfArray(cmsData.ritmos[i].ritmo.modalidade);
                tempo = cmsData.ritmos[i].ritmo.tempo === '' ? 'abc' : cmsData.ritmos[i].ritmo.tempo.split(':');
                if (typeof tempo[1] === 'undefined') {
                    tempo[0] = '0';
                    tempo[1] = '00';
                    tempo[2] = '00';
                }

                if (cmsData.ritmos[i].ritmo.modalidade == "Natação") {
                    tempo[2] = tempo[1];
                    tempo[1] = tempo[0];
                    var velocidade = "";
                } else {

                    if ($scope.apenasNum(legenda) > 100 && legenda === "Ref para  400 m") {
                        if (parseInt(tempo[1]) > 0) {
                            var velocidade = parseFloat(((60 / (parseInt(tempo[1]) + (parseInt(tempo[2]) / 60))).toFixed(1)) * ($scope.apenasNum(legenda) / 1000)).toFixed(1);
                        } else {
                            var velocidade = 0;
                        }
                    } else {
                        if (parseInt(tempo[1]) > 0) {
                            var velocidade = (60 / (parseInt(tempo[1]) + (parseInt(tempo[2]) / 60))).toFixed(1);
                        } else {
                            var velocidade = 0;
                        }

                    }
                }
                tempRitmos[index].ritmos.push({
                    legenda: legenda,
                    tempo: typeof tempo[1] !== 'undefined' ? tempo[1] + ':' + tempo[2] : '',
                    velocidade: isNaN(velocidade) ? '' : velocidade
                });

            } else {

                // console.log("igual");

                var index = $scope.indexOfArray(cmsData.ritmos[i].ritmo.modalidade);

                var indexRit = $scope.indexOfArrayRit(cmsData.ritmos[i].ritmo.modalidade, legenda);
                var index = $scope.indexOfArray(cmsData.ritmos[i].ritmo.modalidade);
                tempo = cmsData.ritmos[i].ritmo.tempo === '' ? 'abc' : cmsData.ritmos[i].ritmo.tempo.split(':');
                if (typeof tempo[1] === 'undefined') {
                    tempo[0] = '0';
                    tempo[1] = '00';
                    tempo[2] = '00';
                }
                if (cmsData.ritmos[i].ritmo.modalidade == "Natação") {
                    tempo[2] = tempo[1];
                    tempo[1] = tempo[0];
                    var velocidade = "";
                } else {

                    if ($scope.apenasNum(legenda) > 100 && legenda === "Ref para  400 m") {

                        var velocidade = parseFloat(((60 / (parseInt(tempo[1]) + (parseInt(tempo[2]) / 60))).toFixed(1)) * ($scope.apenasNum(legenda) / 1000)).toFixed(1);

                    } else {
                        if (parseInt(tempo[1]) > 0) {
                            var velocidade = (60 / (parseInt(tempo[1]) + (parseInt(tempo[2]) / 60))).toFixed(1);
                        } else {
                            var velocidade = 0;
                        }
                    }
                }


                //console.log(legenda);
                //console.log(tempRitmos[index]);
                //console.log(indexRit);
                // console.log(tempRitmos[index].ritmos[indexRit].tempo);
                // console.log(tempo);
                // console.log(velocidade);
                tempRitmos[index].ritmos[indexRit] = {
                    legenda: legenda,
                    tempo: tempRitmos[index].ritmos[indexRit].tempo + ' - ' + tempo[1] + ':' + tempo[2],
                    velocidade: tempRitmos[index].ritmos[indexRit].velocidade + ' - ' + velocidade
                };



                //devemos atualizar o ritmo, agrupando a legenda(TODO)
            }



            if ($scope.inArray("Corrida")) {
                $scope.disabledCorrida = "Corrida";
            }
            if ($scope.inArray("Ciclismo")) {
                $scope.disabledCiclismo = "Ciclismo";
            }
            if ($scope.inArray("Natação")) {
                $scope.disabledNatacao = "Natação";
            }





        }
        $scope.show = $scope.disabledCorrida;
        $scope.cms.ritmosEscolhidos = $scope.cms.ritmosNovo.Corrida;

        $scope.alteraModalidadeRitmo = function(modalidade) {

                switch (modalidade) {

                    case 1:
                        $scope.show = $scope.disabledCorrida;
                        $scope.cms.ritmosEscolhidos = $scope.cms.ritmosNovo.Corrida;
                        break;

                    case 2:
                        $scope.show = $scope.disabledCiclismo;
                        $scope.cms.ritmosEscolhidos = $scope.cms.ritmosNovo.Ciclismo;
                        break;

                    case 3:
                        $scope.show = $scope.disabledNatacao;
                        console.log($scope.cms.ritmosNovo);
                        $scope.cms.ritmosEscolhidos = $scope.cms.ritmosNovo.Natação;
                        break;
                }
            }
            //verifica se a array funcionou




        $scope.show = 'Corrida';
        /*if
        $scope.disabledCliclismo = 'ng-disabled=false';*/

        $scope.posts = tempRitmos;
    })
    .controller('ZonasFC', function($rootScope, $http, $scope, $location, $ionicPopup, LogFactory) {
        $scope.nomeUsuario = LogFactory.getUsername();
        $scope.fc = cmsData.fc;
    })
    .controller('mpr', function($rootScope, $http, $scope, $location, $ionicPopup, LogFactory) {
        $scope.nomeUsuario = LogFactory.getUsername();
        $(document).ready(function() {
            /*$(".bar-energized").addClass("bloquear");*/
        });
        $scope.theHeight = function() {
            return window.innerHeight - 235;
        }
    })
    .controller('TreinoDoDia', function($rootScope, $http, $scope, $location, $ionicPopup, $sce, LogFactory) {
        $scope.nomeUsuario = LogFactory.getUsername();

        var mesatual = parseInt(new Date().getMonth() + 1);
        $scope.datames = mesatual;
        $scope.datadia = new Date().getDate();
        var planilha = false,
            ini = '',
            fim = '',
            hoje = parseInt(new Date().getDate());
        var postar;
        var treinoatualiza = false;
        for (var p = 0; p < cmsData.planilhas.length; p++) {
            planilha = cmsData.planilhas[p].planilha;

            ini = planilha.dt_ini_pla.split('.');
            fim = planilha.dt_fim_pla.split('.');
            fim[1] = parseInt(fim[1]);


            console.log('INICIO E FIM');
            console.log(ini);
            console.log(fim);

            if (fim[1] == ini[1]) {
                if (hoje >= ini[0] && hoje <= fim[0]) {
                    break;
                }
            } else if ((mesatual == ini[1] && hoje >= ini[0]) || (mesatual == fim[1] && hoje <= fim[0])) {
                break;
            } else {
                planilha = false;
            }
        }

        // Verifica se foi encontrada uma planilha que abrange o treino do dia.
        if (planilha) {
            var treinos = planilha.treinos,
                treino = false,
                dia_treino = '';
            for (var t = 0; t < treinos.length; t++) {
                treino = treinos[t].treino;
                dia_treino = treino.dt_treino.substr(0, treino.dt_treino.length - 2);
                dia_treino = new Date(dia_treino).getDate();
                if (dia_treino == hoje) {
                    break;
                } else {
                    treino = false;
                }
            }
            treinoatualiza = treino;

        }



        //$scope.posts = cmsData.ss[0].planilha.treinos;
        var $diasemana = retornaDiaSemana(new Date().getDay());

        $scope.diasemana = $diasemana;
        /*$scope.user = planilha.nm_pla;*/

        if (!treinoatualiza) {
            /*  treinoatualiza = "Não há treinos para hoje";*/
            /*$scope.posts = treinoatualiza.replace(/ - /g,'\r\n');*/
            $scope.info = "Não há treinos para ";

        } else {

            $scope.posts = treinoatualiza.ds_treino.replace(/ - /g, '\r\n');
            $scope.info = "Treinos para ";

        }

        $scope.getInfo = function() {
            return $sce.trustAsHtml($scope.info);
        }
    })
    .controller('Inicio', function($rootScope, $http, $scope, $location, $ionicPopup, $state, LogFactory) {
        $scope.nomeUsuario = LogFactory.getUsername();

        function executaSQL(cmsData) {

            //$scope.posts = cmsData.treino_dia.ds_treino.replace(/ - /g,'\r\n');


            var mes = new Date().getMonth() + 1;
            var mesatual = parseInt(mes);
            $scope.datames = retornaMes(mes);


            /*    $scope.datames = mes;*/

            $scope.datadia = new Date().getDate();
            var planilha = false,
                ini = '',
                fim = '',
                hoje = parseInt($scope.datadia);
            var postar;
            var treinoatualiza = false;
            for (var p = 0; p < cmsData.planilhas.length; p++) {
                planilha = cmsData.planilhas[p].planilha;

                ini = planilha.dt_ini_pla.split('.');
                fim = planilha.dt_fim_pla.split('.');
                fim[1] = parseInt(fim[1]);
                /*
                console.log("debug2222");
                console.log(planilha.dt_ini_pla);
                console.log(planilha.dt_fim_pla);
                console.log(fim);
                console.log(ini);
                console.log(hoje);
                console.log(mesatual);
                */

                if (fim[1] == ini[1]) {
                    if (hoje >= ini[0] && hoje <= fim[0]) {
                        break;
                    }
                } else if ((mesatual == ini[1] && hoje >= ini[0]) || (mesatual == fim[1] && hoje <= fim[0])) {
                    break;
                } else {
                    planilha = false;
                }
            }

            console.log(planilha);


            // Verifica se foi encontrada uma planilha que abrange o treino do dia.
            if (planilha) {
                var treinos = planilha.treinos,
                    treino = false,
                    dia_treino = '';
                for (var t = 0; t < treinos.length; t++) {
                    treino = treinos[t].treino;

                    dia_treino = treino.dt_treino.substr(0, treino.dt_treino.length - 2);
                    dia_treino = new Date(dia_treino).getDate();

                    if (dia_treino == hoje) {
                        break;
                    } else {
                        treino = false;
                    }
                }
                treinoatualiza = treino;
                // if (treino) {
                //    treino.treino = true;
                //     return treino;
                //  } else {
                //    return { treino: false };
                //  }
            }

            //$scope.posts = cmsData.planilhas[0].planilha.treinos;
            $diasemana = new Date().getDay();

            $scope.diasemana = retornaDiaSemana($diasemana);
            var str = planilha.nm_pla;
            console.log(str);
            try {
                $rootScope.usuario = str.replace(/[^\w\s]/gi, '').replace(/[^\D]/g, '');
                $scope.user = $rootScope.usuario;
            } catch (err) {
                console.log('teste');
            }


            if (!treinoatualiza) {
                /*  treinoatualiza = "Não há treinos para hoje";*/
                /*$scope.posts = treinoatualiza.replace(/ - /g,'\r\n');*/
                $scope.posts = "Não há treinos para hoje";
            } else {
                $scope.posts = treinoatualiza.ds_treino.replace(/ - /g, '\r\n');
                /*$scope.info = "Treinos para ";*/
            }

        }

        function _verificaCMS() {
            if ($rootScope.cmsData === null || $rootScope.relog === true) {

                var banco = openDatabase("MPR", 1.0, "Cadastro do webservice", 2 * 1024 * 1024);
                banco.transaction(function(t) {
                    t.executeSql("UPDATE tablesql SET flag='true' WHERE flag='false' AND id=" + $rootScope.passid);
                    t.executeSql("SELECT * from tablesql where id = " + $rootScope.passid, [], function(t, results) {
                        var linha = results.rows;



                        console.log('verificaCMS');
                        cmsData = JSON.parse(linha.item(0).cmssql);
                        // console.log(linha.item(0));
                        if ($rootScope.relog == true) {
                            // console.log(linha.item(0));
                            $rootScope.relog = false;

                            executaSQL(cmsData);
                            $state.go('app.planilha');
                        } else {
                            executaSQL(cmsData);
                        }



                    });
                });

            } else {


                cmsData = JSON.parse($rootScope.cmsData);

                executaSQL(cmsData);


            }
        }
        // $rootScope.$broadcast('verificaCMS');
        _verificaCMS();

    })
    .controller('AppInicio', function($rootScope, $http, $scope, $location, $ionicPopup, LogFactory) {
        $scope.nomeUsuario = LogFactory.getUsername();
        $scope.posts = cmsData.treino_dia;
    })
    .controller('Planilha', function($rootScope, $http, $scope, $location, $ionicPopup, $ionicSlideBoxDelegate, $timeout, $ritmosService, $RitmosFactory, LogFactory) {

        $scope.nomeUsuario = LogFactory.getUsername();
        $RitmosFactory.setRitmos(cmsData.ritmos);
        //console.log($RitmosFactory.getRitmo('LeVe'));
        console.log("planilha");

        $scope.getRitmo = function(ritmo) {
            console.log(ritmo);
            var tempRitmo = $RitmosFactory.getRitmo(ritmo);
            var template = '';
            if (tempRitmo.piorTempo !== null) {
                template = '<span>' + tempRitmo.melhorTempo.substr(-5) + ' - ' + tempRitmo.piorTempo.substr(-5) + ' min/km</span>';
                template = template + '<span>' + tempRitmo.melhorVelocidade.toFixed(2).toString() + ' - ' + tempRitmo.piorVelocidade.toFixed(2).toString() + ' km/h</span>';
            } else {
                template = '<span>' + tempRitmo.melhorTempo.substr(-5) + ' min/km</span>';
                template = template + '<span>' + tempRitmo.melhorVelocidade.toFixed(2).toString() + ' km/h</span>';
            }
            $scope.showRitmo = function() {
                var alertPopup = $ionicPopup.alert({
                    title: 'Ritmo',
                    template: template
                });
            };
            $scope.showRitmo();
        };

        var mes = new Date().getMonth() + 1;
        var mesatual = parseInt(mes);
        var treino;

        var planilhas = cmsData.planilhas;
        console.log(cmsData.planilhas);
        var planilha = false,
            ini = '',
            fim = '',
            datacriacao,
            hoje = parseInt(new Date().getDate());
        for (var p = 0; p < cmsData.planilhas.length; p++) {
            planilha = cmsData.planilhas[p].planilha;
            ini = planilha.dt_ini_pla.split('.');
            fim = planilha.dt_fim_pla.split('.');
            var fim = planilha.dt_fim_pla.substr(6, 4) + '-' + planilha.dt_fim_pla.substr(3, 2) + '-' + planilha.dt_fim_pla.substr(0, 2) + 'T12:00:00';
            var inicio = planilha.dt_ini_pla.substr(6, 4) + '-' + planilha.dt_ini_pla.substr(3, 2) + '-' + planilha.dt_ini_pla.substr(0, 2) + 'T12:00:00';
            console.log(fim + ' fimmmm');
            console.log(inicio + ' inicio');


            inicio = new Date(inicio);
            fim = new Date(fim);
            var agora = new Date();

            console.log(fim + ' fimmmm');
            console.log(inicio + ' inicio');
            agora = agora.getTime();
            datacriacao = planilha.dt_atu_pla.split('.')


            fim[1] = parseInt(fim[1]);
            //console.log(fim[1] + '/' + ini[1] + '/' + mesatual + '/' + hoje + '/' + fim[0] + '/' + ini[0]);
            if (agora < fim.getTime()) {

                /*console.log(fim[1]+'/'+ini[1]+'/'+mesatual+'/'+hoje+'/'+fim[0]+'/'+ini[0]);*/
                /*if (fim[1] == ini[1]) {
                    if (hoje >= datacriacao[0] && hoje <= fim[0]) {
                        break;
                    }
                } else if ((mesatual == ini[1] && hoje >= datacriacao[0]) || (mesatual == fim[1] && hoje <= fim[0])) {
                    break;*/

                break;
            } else {
                setTimeout(function() {
                    var mensagem = $rootScope.tentouAtualizarPlanilha ? 'Nenhuma planilha válida disponível. Fale com seu instrutor!' : "Sua planilha expirou, favor atualiza-la!";
                    $scope.showAlert(mensagem);
                }, 1000);
                break;
            }
        }


        function listarPlanilhas(i) {
            planilha = cmsData.planilhas[i].planilha;

            console.log('listarPlanilhas listarPlanilhas ');
            console.log(planilha);

            if (!planilha) planilha = planilhas[0];
            $scope.semanas = [];
            var dataTreino = '',
                semanas = [
                    [],
                    [],
                    [],
                    []
                ],
                dia_ini = new Date(planilha.dt_ini_pla.split('.')[2] + '-' + planilha.dt_ini_pla.split('.')[1] + '-' + planilha.dt_ini_pla.split('.')[0]).getTime(),
                dia_fim = new Date(planilha.dt_fim_pla.split('.')[2] + '-' + planilha.dt_fim_pla.split('.')[1] + '-' + planilha.dt_fim_pla.split('.')[0]).getTime(),
                dia_sem = 0;
            console.log("dia_ini");
            console.log(dia_ini);
            console.log(planilha.dt_ini_pla.split('.')[2] + '-' + planilha.dt_ini_pla.split('.')[1] + '-' + planilha.dt_ini_pla.split('.')[0]);
            console.log("dia_fim");
            console.log(dia_fim);
            console.log(planilha.dt_fim_pla.split('.')[2] + '-' + planilha.dt_fim_pla.split('.')[1] + '-' + planilha.dt_fim_pla.split('.')[0]);
            for (var s = 0; s < semanas.length; s++) {
                for (var d = 0; d <= 6; d++) {
                    if (d === 0) {
                        $dia = "SEG";
                        $data = new Date(dia_ini + ((((s * 7) + d) * (24 * (60 * 60))) * 1000));
                        $data = $data.getUTCDate() + '/' + retornaMes($data.getUTCMonth() + 1);
                    } else if (d === 1) {
                        $dia = "TER";
                        $data = new Date(dia_ini + ((((s * 7) + d) * (24 * (60 * 60))) * 1000));
                        $data = $data.getUTCDate() + '/' + retornaMes($data.getUTCMonth() + 1);
                    } else if (d === 2) {
                        $dia = "QUA";
                        $data = new Date(dia_ini + ((((s * 7) + d) * (24 * (60 * 60))) * 1000));
                        $data = $data.getUTCDate() + '/' + retornaMes($data.getUTCMonth() + 1);
                    } else if (d === 3) {
                        $dia = "QUI";
                        $data = new Date(dia_ini + ((((s * 7) + d) * (24 * (60 * 60))) * 1000));
                        $data = $data.getUTCDate() + '/' + retornaMes($data.getUTCMonth() + 1);
                    } else if (d === 4) {
                        $dia = "SEX";
                        $data = new Date(dia_ini + ((((s * 7) + d) * (24 * (60 * 60))) * 1000));
                        $data = $data.getUTCDate() + '/' + retornaMes($data.getUTCMonth() + 1);
                    } else if (d === 5) {
                        $dia = "SÁB";
                        $data = new Date(dia_ini + ((((s * 7) + d) * (24 * (60 * 60))) * 1000));
                        $data = $data.getUTCDate() + '/' + retornaMes($data.getUTCMonth() + 1);
                    } else if (d === 6) {
                        $dia = "DOM";
                        $data = new Date(dia_ini + ((((s * 7) + d) * (24 * (60 * 60))) * 1000));
                        $data = $data.getUTCDate() + '/' + retornaMes($data.getUTCMonth() + 1);
                    }
                    semanas[s].push({
                        name: $dia,
                        data: ($data.split('/')[0].length == 1 ? '0' : '') + $data,
                        treino: '',
                        modalidade: '',
                        ativar: false, // Verifica esta condição para ativar ou não ao clicar no treino, abrindo se for verdadeiro, e barra se for false
                    });
                }
            }

            console.log('planilha.treinos treino ');
            console.log(planilha.treinos);

            for (i = 0; i < planilha.treinos.length; i++) {
                dataTreino = planilha.treinos[i].treino.dt_treino.substr(0, (planilha.treinos[i].treino.dt_treino.length) - 2);
                dataTreino = new Date(dataTreino);
                console.log('planilha.treinos dataTreino ');
                console.log(dataTreino);
                semana = Math.ceil(((((dataTreino.getTime() - dia_ini) / 1000 / 60 / 60 / 24) + 1) * 4) / (((dia_fim - dia_ini) / 1000 / 60 / 60 / 24) + 1));
                dia_sem = dataTreino.getDay();
                console.log('planilha.treinos semana ');
                console.log(semana);
                console.log(semana);
                dia_sem = dia_sem === 0 ? 7 : dia_sem - 1;
                if (dataTreino.getDay() === 0) {
                    dia_sem = 6;
                    semana = semana - 1;
                }
                semanas[semana - 1][dia_sem].modalidade += planilha.treinos[i].treino.ds_modalidade;
                var mod = semanas[semana - 1][dia_sem].modalidade;
                treino = planilha.treinos[i].treino.ds_treino;

                treino = treino.replace("CONFORTÁVEL", '<b class="novoVerde" ng-click="mprEvent(\'conf\')">CONFORTÁVEL</b>');
                treino = treino.replace("CONFORTAVEL", '<b class="novoVerde" ng-click="mprEvent(\'conf\')">CONFORTÁVEL</b>');
                treino = treino.replace("confortável", '<b class="novoVerde" ng-click="mprEvent(\'conf\')">CONFORTÁVEL</b>');
                treino = treino.replace("confortavel", '<b class="novoVerde" ng-click="mprEvent(\'conf\')">CONFORTÁVEL</b>');
                treino = treino.replace("FIRME", '<b class="novoVermelho" ng-click="mprEvent(\'firm\')">FIRME</b>');
                treino = treino.replace("firme", '<b class="novoVermelho" ng-click="mprEvent(\'firm\')">FIRME</b>');
                treino = treino.replace("MODERADO", '<b class="novoAmarelo" ng-click="mprEvent(\'mod\')">MODERADO</b>');
                treino = treino.replace("moderado", '<b class="novoAmarelo" ng-click="mprEvent(\'mod\')">MODERADO</b>');
                treino = treino.replace("FORTE", '<b class="novoRosa" ng-click="mprEvent(\'fort\')">FORTE</b>');
                treino = treino.replace("forte", '<b class="novoRosa" ng-click="mprEvent(\'fort\')">FORTE</b>');
                treino = treino.replace(/leve/g, '<b class="novoAzul" ng-click="mprEvent(\'lev\')">LEVE</b>');
                treino = treino.replace(/Leve/g, '<b class="novoAzul" ng-click="mprEvent(\'lev\')">LEVE</b>');
                treino = treino.replace(/LEVE/g, '<b class="novoAzul" ng-click="mprEvent(\'lev\')">LEVE</b>');
                if (mod == "Treino" || mod == "") {
                    semanas[semana - 1][dia_sem].treino += treino;
                } else {
                    semanas[semana - 1][dia_sem].treino += "<span></span><b>" + planilha.treinos[i].treino.ds_modalidade + '</b>\r\n' + treino + '\r\n';
                }
                semanas[semana - 1][dia_sem].ativar = 'dia';
            }
            console.log('treino treino ');
            console.log(treino);
            $scope.regex_date = /\./g;
            $scope.show = 'true';
            var datecriacao = planilha.dt_atu_pla.split('.')[0] + ' ' + convertemes(planilha.dt_atu_pla.split('.')[1]) + ' ' + planilha.dt_atu_pla.split('.')[2]
            $scope.datecriacao = datecriacao;
            $scope.groups = [];
            return semanas;

        }


        $scope.nextSlide = function() {
            $ionicSlideBoxDelegate.next();
        };
        $scope.previousSlide = function() {
            $ionicSlideBoxDelegate.previous();
        };

        /*legenda = legenda.replace("confortável", "<n style='color:#006BCE;'>confortável</n>");
        legenda = legenda.replace("Confortavel", "<n style='color:#006BCE;'>confortável</n>");
        legenda = legenda.replace("confortavel", "<n style='color:#006BCE;'>confortável</n>");
        legenda = legenda.replace("Firme", "<n style='color:#ff9700'>firme</n>");
        legenda = legenda.replace("firme", "<n style='color:#ff9700'>firme</n>");
        legenda = legenda.replace("moderado", "<n style='color:#04af01'>moderado</n>");
        legenda = legenda.replace("Moderado", "<n style='color:#04af01'>moderado</n>");
        legenda = legenda.replace("forte", "<n style='color:red'>forte</n>");
        legenda = legenda.replace("Forte", "<n style='color:red'>forte</n>");*/


        $scope.semanasAnteriores = listarPlanilhas(1);
        $scope.semanas = listarPlanilhas(0);

        console.log($scope.semanasAnteriores + ' ' + 'semanas anteriores ');


        $scope.PrimeiroDiaPlanilhaAnterior = $scope.semanasAnteriores[0][0].data;
        $scope.UltimoDiaPlanilhaAnterior = $scope.semanasAnteriores[3][6].data;
        $scope.PrimeiroDiaPlanilhaAtual = $scope.semanas[0][0].data;
        $scope.UltimoDiaPlanilhaAtual = $scope.semanas[3][6].data;


        var data = new Date();
        data = data.getDate();



        for (var i = 0; i < $scope.semanas.length; i++) {

            for (var j = 0; j < $scope.semanas[i].length; j++) {
                // console.log($scope.semanas[i][j].data);

                var dia = $scope.semanas[i][j].data.substr(0, 2);
                if (dia == data) {


                    $timeout(function() {
                        $ionicSlideBoxDelegate.slide(i);
                    }, 1000);


                    return;
                }
            }
        }


    })

.controller('Mensageria', function($rootScope, $http, $scope, $location, $ionicPopup, LogFactory, appVersion, $interval, base_url, $ionicLoading, $localstorage, $ionicScrollDelegate) {
    $scope.nomeUsuario = LogFactory.getUsername();
    $scope.user = {
        email: $localstorage.getObject('userEmail'),
        mensagens: []
    };

    $scope.mostra = {
        pagCaixaDeEntrada: true,
        pagNovaMsg: false,
        pagMsg: false
    };

    // pag-nova-msg
    $scope.mostraListaDestinatarios = false;
    $scope.destinatarios = [];
    $scope.nmDestinatarios = [];
    $scope.nmDestinatario = {
        valor: ''
    };
    $scope.nmAssunto = {
        valor: ''
    };
    $scope.nmMensagem = {
        valor: ''
    };

    $scope.msg = {};
    $scope.mMensagem = {
        valor: ''
    };

    $scope.data = {
        hoje: new Date()
    };
    $scope.data.dia = $scope.data.hoje.getDate();
    $scope.data.mes = $scope.data.hoje.getMonth() + 1;
    $scope.data.ano = $scope.data.hoje.getFullYear();

    $scope.mostraPag = function(pag, index) {
        for (var i in $scope.mostra) $scope.mostra[i] = false;
        $scope.mostra[pag] = true;

        if (pag === 'pagCaixaDeEntrada') carregaMsgs();
        if (pag === 'pagNovaMsg') carregaListaDestinatarios();
        if (pag === 'pagMsg' && typeof index !== 'undefined') $scope.msg = $scope.user.mensagens[index];

        $ionicScrollDelegate.scrollTop();

        return false;
    };

    $scope.voltar = function() {
        var pagAtual;

        for (var pag in $scope.mostra) {
            if ($scope.mostra[pag] === true) {
                pagAtual = pag;
            }
        }

        switch (pagAtual) {
            case 'pagCaixaDeEntrada':
                window.history.back();
                break;
            case 'pagNovaMsg':
            case 'pagMsg':
            default:
                $scope.mostraPag('pagCaixaDeEntrada');
                break;
        }

        return false;
    };

    function carregaMsgs() {
        $ionicLoading.show({
            template: 'Carregando'
        });

        $http({
            method: 'POST',
            data: {
                user_id: $rootScope.passid
            },
            url: base_url + 'getMensagens',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            timeout: 1000 * 15
        }).success(function(data) {
            if (data.status) {
                if ($scope.user.mensagens.length !== data.mensagens.length) {
                    $scope.user.mensagens.length = 0;

                    for (var i = 0, len = data.mensagens.length; i < len; i++) {
                        var msg = data.mensagens[i];
                        msg.remetentes = formataRemetentes(msg.professores);
                        //msg.dataFormatada = formataData(msg.data);

                        $scope.user.mensagens.push(msg);
                    }
                }

                console.log('$scope.user.mensagens', $scope.user.mensagens);
            } else {
                $ionicPopup.alert({
                    title: 'Não foi possível carregar mensagens',
                    template: data.mensagem
                });
            }

            $ionicLoading.hide();
        }).error(function(data) {
            console.log('Erro ao carregar lista de mensagens: ', data);

            $ionicPopup.alert({
                title: 'Erro ao carregar lista de mensagens',
                template: data
            });
            $ionicLoading.hide();
        });
    }

    carregaMsgs();

    function formataRemetentes(remetentes) {
        var separador = ', ';
        var remetentes = JSON.parse(remetentes);
        var remetentesFormatados = '';

        for (var i = 0, len = remetentes.length; i < len; i++) {
            if (i === 0) separador = '';
            else if (i === len - 1) separador = ' e ';

            remetentesFormatados += separador + remetentes[i].user_name;
        }

        return remetentesFormatados;
    }

    function formataData(data) {
        var data = {
            hoje: new Date(data)
        };
        data.dia = data.hoje.getDate();
        data.mes = data.hoje.getMonth() + 1;
        data.ano = data.hoje.getFullYear();
        data.hora = data.hoje.getHours() + ':' + data.hoje.getMinutes();

        if (data.dia === $scope.data.dia && data.mes === $scope.data.mes && data.ano === $scope.data.ano) {
            return data.hora;
        } else if (data.ano === $scope.data.ano) {
            return data.dia + '/' + data.mes;
        } else {
            return data.dia + '/' + data.mes + '/' + data.ano;
        }
    }

    $scope.toggleDestinatario = function(destinatario, index) {
        if (destinatario.selecionado === true) {
            $scope.nmDestinatarios.splice(index, 1);
        } else {
            $scope.nmDestinatarios.push(destinatario);
        }

        destinatario.selecionado = !destinatario.selecionado;
    };

    function carregaListaDestinatarios() {
        if ($scope.destinatarios.length === 0) {
            $http({
                method: 'GET',
                url: base_url + 'getProfessores'
            }).success(function(data) {
                for (var i = 0, len = data.length; i < len; i++) {
                    $scope.destinatarios.push(data[i]);
                }
                console.log('carregaListaDestinatarios $scope.destinatarios', $scope.destinatarios);
            }).error(function() {
                $ionicPopup.alert({
                    title: 'Erro ao carregar lista de destinatários'
                });
            });
        }
    }

    $scope.focusNmDestinatario = function() {
        $scope.mostraListaDestinatarios = true;
    };

    $scope.blurNmDestinatario = function() {
        $scope.mostraListaDestinatarios = false;

        var virg = $scope.nmDestinatario.valor.split(',');

        if (virg.length > 1) {
            console.log('virg.length', virg);
            for (var i = 0, len = virg.length; i < len; i++) {
                if (virg[i].indexOf(';') > -1) {
                    var pontoEVirg = virg[i].split(';');

                    console.log('pontoEVirg', pontoEVirg);

                    if (pontoEVirg.length > 1) {
                        console.log('pontoEVirg.length > 1', pontoEVirg);
                        for (var j = 0, len = pontoEVirg.length; j < len; j++) {
                            console.log('j');
                            var index = pesquisaPorDestinatario(pontoEVirg[j]);
                            if (index > -1) {
                                console.log('pontoEVirg[j] valido', pontoEVirg[j], 'index', index, '$scope.destinatarios[index]', $scope.destinatarios[index]);
                                adcNmDestinatario($scope.destinatarios[index]);
                            } else {
                                console.log('pontoEVirg[j] invalido', pontoEVirg[j], 'index', index);
                                adcNmDestinatario(pontoEVirg[j], true);
                            }
                        }
                    }
                } else {
                    var index = pesquisaPorDestinatario(virg[i]);
                    if (index > -1) {
                        console.log('virg[i] valido', virg[i], 'index', index, '$scope.destinatarios[index]', $scope.destinatarios[index]);
                        adcNmDestinatario($scope.destinatarios[index]);
                    } else {
                        console.log('virg[i] invalido', virg[i], 'index', index);
                        adcNmDestinatario(virg[i], true);
                    }
                }
            }
        } else if ($scope.nmDestinatario.valor.length) {
            var index = pesquisaPorDestinatario($scope.nmDestinatario.valor);
            console.log('index', index);
            if (index > -1) {
                console.log('$scope.nmDestinatario.valor valido', $scope.nmDestinatario.valor, 'index', index, '$scope.destinatarios[index]', $scope.destinatarios[index]);
                adcNmDestinatario($scope.destinatarios[index]);
            } else if (index === -1) {
                console.log('$scope.nmDestinatario.valor invalido', $scope.nmDestinatario.valor, 'index', index);
                adcNmDestinatario($scope.nmDestinatario.valor);
            }
        }

        console.log('$scope.nmDestinatarios', $scope.nmDestinatarios);
        $scope.nmDestinatario.valor = "";
    };

    function adcNmDestinatario(destinatario, invalido) {
        if (invalido) {
            $scope.nmDestinatarios.push({
                user_email: destinatario,
                invalido: true
            });
        } else {
            destinatario.selecionado = true;
            $scope.nmDestinatarios.push(destinatario);
        }
    }

    // retorna index do destinatário. Caso não encontrado, retorna -1. Caso encontrado e já adicionado aos destinatários da nova mensagem, retorna -2.
    function pesquisaPorDestinatario(email) {
        if ($scope.destinatarios.length) {
            for (var i = 0, len = $scope.destinatarios.length; i < len; i++) {
                var email = email.trim();
                console.log('email: ', email)
                console.log('pesquisaPorDestinatario $scope.destinatarios[i].user_email', $scope.destinatarios[i].user_email);
                if ($scope.destinatarios[i].user_email === email) {
                    if (estaEmNmDestinatarios(email)) return -2;
                    else return i;
                }
            }
        }

        return -1;
    }

    function estaEmNmDestinatarios(email) {
        for (var i = 0, len = $scope.nmDestinatarios.length; i < len; i++) {
            if ($scope.nmDestinatarios[i].user_email === email) return true;
        }

        return false;
    }

    $scope.removeNmDestinatario = function(destinatario, index) {
        console.log('removeDestinatario index', index);
        $scope.nmDestinatarios.splice(index, 1);
        destinatario.selecionado = false;

        if (destinatario.invalido) $scope.nmDestinatario.valor = destinatario.user_email;
    };

    $scope.nmEnviar = function() {
        var numInvalidos = 0;
        var title, desc = 'A mensagem só pode ser enviada aos emails dos professores.';

        if ($scope.nmDestinatarios.length) {
            for (var i = 0, len = $scope.nmDestinatarios.length; i < len; i++) {
                if ($scope.nmDestinatarios[i].invalido) {
                    numInvalidos++;
                }
            }
        } else {
            $ionicPopup.alert({
                title: 'Destinatário vazio',
                template: 'Selecione ou digite ao menos um destinatário.'
            });

            return false;
        }

        if (numInvalidos) {
            title = 'Destinatário inválido';
            desc = desc + ' Toque no destinatário inválido, em vermelho, para removê-lo.';

            if (numInvalidos > 1) {
                title = 'Destinatários inválidos';
                desc = desc + ' Toque nos destinatários inválidos, em vermelho, para removê-los.';
            }

            $ionicPopup.alert({
                title: 'Destinatário inválido',
                template: desc
            });

            return false;
        }

        if (!$scope.nmAssunto.valor && !$scope.nmMensagem.valor.length) {
            $ionicPopup.alert({
                title: 'Campos assunto e mensagem vazios',
                template: 'Para enviar a mensagem, preencha ao menos um.'
            });

            return false;
        }

        sendMessage({
            professores: $scope.nmDestinatarios,
            mensagem: $scope.nmMensagem.valor,
            assunto: $scope.nmAssunto.valor,
        });

        return false;
    };

    $scope.mEnviar = function() {
        if (!$scope.mMensagem.valor.length) {
            $ionicPopup.alert({
                title: 'Campo mensagem vazio',
                template: 'Para enviar a mensagem, preencha o campo.'
            });

            return false;
        }

        sendMessage({
            professores: JSON.parse($scope.msg.professores),
            mensagem: $scope.mMensagem.valor,
            assunto: 'Re: ' + $scope.msg.assunto
        });

        return false;
    };

    function sendMessage(dados) {
        $ionicLoading.show({
            template: 'Enviando mensagem.'
        });
        console.log($scope.user.email);

        $http({
            method: 'POST',
            url: base_url + 'sendMessage',
            data: {
                professores: dados.professores,
                mensagem: dados.mensagem,
                assunto: dados.assunto,
                user_id: $rootScope.passid,
                user_email: $scope.user.email
            },
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            timeout: 1000 * 15
        }).success(function(data) {
            if (data.status) {
                $ionicPopup.alert({
                    title: 'Mensagem enviada'
                });

                $scope.nmDestinatarios.length = 0;
                $scope.nmDestinatario.valor = '';
                $scope.nmAssunto.valor = '';
                $scope.nmMensagem.valor = '';
                $scope.mMensagem.valor = '';
                $scope.mostraPag('pagCaixaDeEntrada');
            } else {
                $ionicPopup.alert({
                    title: 'Mensagem não enviada',
                    template: data.mensagem
                });
            }

            $ionicLoading.hide();
        }).error(function() {
            $ionicPopup.alert({
                title: 'Erro, mensagem não enviada'
            });
            $ionicLoading.hide();
        });
    }
})

.controller('Cronometro', function($rootScope, $http, $scope, $location, $ionicPopup, LogFactory, appVersion, $interval, $localstorage, base_url, $state) {
    $scope.nomeUsuario = LogFactory.getUsername();
    $scope.teste = {
        millis: 10
    };

    $scope.selectedProf = {};
    $scope.printEnd = $localstorage.getObject('print');
    $scope.iniciado = false;
    $scope.correndo = false;

    $scope.professores = [];

    $scope.mdFimBtn = false;
    $scope.textoCompartilharProf = {};
    $scope.textoCompartilharProf.texto = '';
    $scope.icon = true;


    $scope.laps = [];
    $scope.tempo = {};
    $scope.lapAtual = numLap($scope.laps.length + 1);

    $scope.watchPosition;
    $scope.posInicial = $scope.posAtual = {}; // longitude, latitude
    $scope.distPercorrida = {}; // km
    $scope.minKmLap = $scope.minKmTotal = '00:00';

    $scope.millisTotal = 0;
    $scope.millisTemp = 0;

    $scope.getProfessores = function() {
        $http({
            method: 'GET',
            url: base_url + 'getProfessores'
        }).success(function(data) {

            $scope.professores = data;

            var p = {};
            p.user_name = 'Treinador';
            $scope.professores.unshift(p);
            $scope.selectedProf.prof = $scope.professores[0];
        }).error(function() {
            $ionicPopup.alert({
                title: 'Erro ao carregar lista de destinatários'
            });
        });
    };

    if ($state.current.name == 'app.compartilhar') $scope.getProfessores();

    $scope.print = function() {

        return $scope.printEnd.path;
        // return 'oi oi oi ';
    }

    var opcoesGeo = {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 3000
    };

    $scope.share = function() {


        $scope.montaShareTexto();

        if (navigator.screenshot) {
            navigator.screenshot.save(function(error, res) {
                if (error) {
                    console.error(error);
                } else {


                    $scope.$apply(function() {

                        $scope.printEnd.path = res.filePath;
                        $localstorage.setObject('print', {
                            path: res.filePath
                        });
                    });

                }
            }, 'jpg', 100);
        }


    }

    $scope.montaShareTexto = function() {

        console.log($scope.laps);
    }

    $scope.confirmaCompartilhamento = function() {



        console.log('Fb_Icon', $scope.ficon);
        console.log('Pf_Icon', $scope.icon);
        if ($scope.ficon) {




            //     alert('ENTROU no SHARE FB');
            //      window.plugins.socialsharing.shareViaFacebook('Message via Facebook',  null , null /* url */, function() {
            //     console.log('share ok')
            // }, function(errormsg){alert(errormsg)})



            window.plugins.socialsharing.shareViaFacebook('Message via Facebook', $scope.printEnd.path, null /* url */ ,
                function() {

                    alert('sucesso');
                },
                function(errormsg) {
                    alert('Erro ao compatilhar');
                })
        }


        if (!$scope.icon) {

            // $rootScope.distPercorrida = $scope.distPercorrida.total;
            // $rootScope.tempoTotal = $scope.calculaTempo();
            // $rootScope.velMedia = $scope.minKmLap;
            // $rootScope.laps = $scope.laps;


            $scope.user = {
                email: $localstorage.getObject('userEmail'),
                mensagens: []
            };

            var dados = {
                user_id: $rootScope.passid,
                user_email: $scope.user.email,
                professor_id: $scope.selectedProf.prof.user_id,
                tempoTotal: $rootScope.tempoTotal,
                distanciaPercorrida: $rootScope.distPercorrida,
                velocidadeMedia: $rootScope.velMedia,
                voltas: $rootScope.laps
            }


            $http({
                    method: 'POST',
                    url: base_url + 'compartilharTreino',
                    data: dados,
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                })
                .success(function(data, status, headers, config) {

                    alert('Treino compartilhado com sucesso.');

                })
                .error(function(data) {
                    alert();

                });

        }



    }

    $scope.switchCompartilhamento = function(icon) {

        if (icon == 'f') {
            $scope.ficon = !$scope.ficon;
        } else {
            $scope.icon = !$scope.icon;
        }
    }

    $scope.start = function() {
        $scope.getCurrentPosition();
        $scope.iniciado = true;
        $scope.correndo = true;
        $scope.$broadcast('timer-start');


        $scope.acompanhaPos();
    };

    $scope.play = function() {
        $scope.getCurrentPosition();
        $scope.correndo = true;
        $scope.$broadcast('timer-resume');
        $scope.acompanhaPos();
    };

    $scope.pause = function() {
        $scope.correndo = false;
        $scope.$broadcast('timer-stop');
        window.navigator.geolocation.clearWatch($scope.watchPosition);
    };

    $scope.stop = function() {

        $scope.novaLap($scope.tempo);

        var data = Date.now();

        /*console.log('dista total');
        console.log($scope.distPercorrida.total);
        console.log($scope.calculaTempo()); 
        console.log($scope.minKmLap);*/


        $localstorage.addTreino($scope.laps, data, $scope.distPercorrida.total.abreviada, $scope.calculaTempo());




        $rootScope.distPercorrida = $scope.distPercorrida.total.abreviada;
        $rootScope.tempoTotal = $scope.calculaTempo();
        $rootScope.velMedia = $scope.minKmLap;
        $rootScope.laps = $scope.laps;


        $scope.millisTotal = 0;
        $scope.tempo.millis = 0;

        var a = $localstorage.getObject('treinos');

        console.log($localstorage.getObject('treinos'));
        console.log('ENTROU');
        window.navigator.geolocation.clearWatch($scope.watchPosition);
        $scope.iniciado = false;
        $scope.$broadcast('timer-reset');
        $scope.laps.length = 0;
        $scope.minKmLap = $scope.minKmTotal = '00:00';
        resetaDistanciaPercorrida('total');
        window.navigator.geolocation.clearWatch($scope.watchPosition);

        console.log('SAIU');

    };

    $scope.toMillis = function(millis) {
        var millis = +('' + millis).substr(-3, 2);
        if (millis < 10) millis = '0' + millis;

        return millis;
    };

    $scope.novaLap = function(lap) {


        console.log(lap);



        $scope.millisTotal += lap.millis;

        var novaLap = {
            num: numLap($scope.laps.length + 1),
            tempo: {
                hours: lap.hours,
                min: lap.minutes,
                seg: lap.seconds,
                millis: $scope.toMillis(lap.millis)
            },
            dist: $scope.distPercorrida.lap.abreviada
        };

        // somaTotalLaps();
        $scope.laps.splice(0, 0, novaLap);
        $scope.lapAtual = numLap($scope.laps.length + 1);
        $scope.minKmLap = '00:00';

        $scope.$broadcast('timer-reset');
        $scope.$broadcast('timer-resume');
        resetaDistanciaPercorrida();
    };

    $scope.$on('timer-tick', function(event, args) {
        $scope.tempo = args;
    });

    $scope.calculaTempo = function() {

        var ms = $scope.millisTotal + $scope.tempo.millis,
            min = (ms / 1000 / 60) << 0,
            sec = (ms / 1000) % 60;

        var secString = sec.toString();
        var secFormatada = '0' + secString.split('.')[0];
        // secFormatada = '0' + secFormatada[0];
        secFormatada = secFormatada.substring(secFormatada.length - 2, secFormatada.length);

        var millisFormatada = '00' + secString.split('.')[1];
        millisFormatada = millisFormatada.substring(millisFormatada.length - 3, millisFormatada.length - 2);

        var hour;
        if (min >= 60) {

            hour = '0' + min / 60 + ':';
            min = min % 60;
        } else {
            hour = '';
        }
        if (min < 10) {
            min = '0' + min;
        }
        var tempo = hour + min + ':' + secFormatada + ":" + millisFormatada;
        return tempo;

    }




    function numLap(num) {
        if (num < 10) num = '0' + num;
        return 'L-' + num;
    }

    function distancia(lon1, lat1, lon2, lat2) {
        var R = 6371; // Radius of the earth in km
        var dLat = (lat2 - lat1).toRad(); // Javascript functions in radians
        var dLon = (lon2 - lon1).toRad();
        var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1.toRad()) * Math.cos(lat2.toRad()) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        var d = R * c; // Distance in km
        return d;
    }

    /** Converts numeric degrees to radians */
    if (typeof(Number.prototype.toRad) === "undefined") {
        Number.prototype.toRad = function() {
            return this * Math.PI / 180;
        }
    }

    $scope.getCurrentPosition = function() {
        window.navigator.geolocation.getCurrentPosition(function(pos) {
            $scope.posInicial = $scope.posAtual = {
                longitude: pos.coords.longitude,
                latitude: pos.coords.latitude
            };
            // $scope.posInicial = $scope.posAtual = {
            //     longitude: -46.65, 
            //     latitude: -23.5
            // };
        }, null, opcoesGeo);
    };

    $scope.acompanhaPos = function() {
        if (typeof $scope.posAtual.latitude == 'undefined')
            $scope.getCurrentPosition();

        $scope.watchPosition = window.navigator.geolocation.watchPosition(function(pos) {
            console.log('acompanhaPos long', pos.coords.longitude, 'acompanhaPos lat', pos.coords.latitude);
            var coords = pos.coords;

            $scope.distPercorrida.total.exata = $scope.distPercorrida.total.exata + distancia($scope.posAtual.longitude, $scope.posAtual.latitude, coords.longitude, coords.latitude);
            $scope.distPercorrida.lap.exata = $scope.distPercorrida.lap.exata + distancia($scope.posAtual.longitude, $scope.posAtual.latitude, coords.longitude, coords.latitude);

            $scope.distPercorrida.total.abreviada = +$scope.distPercorrida.total.exata.toFixed(2);
            $scope.distPercorrida.lap.abreviada = +$scope.distPercorrida.lap.exata.toFixed(2);

            console.log('acompanhaPos distPercorrida.lap.exata', $scope.distPercorrida.lap.exata, 'acompanhaPos distPercorrida.total.exata', $scope.distPercorrida.total.exata);

            $scope.posAtual = {
                longitude: coords.longitude,
                latitude: coords.latitude
            };

            if ($scope.distPercorrida.lap.exata > 0.01) {
                // $scope.minKmTotal = minKm($scope.tempo.millis / 1000 / 60, $scope.distPercorrida.total.exata);
                $scope.minKmLap = minKm($scope.tempo.millis, $scope.distPercorrida.lap.exata);
            }

            // console.log('distPercorrida.lap.exata', $scope.distPercorrida.lap.exata, 'distPercorrida.total.exata', $scope.distPercorrida.total.exata, 'minKmTotal', $scope.minKmTotal, 'minKmLap', $scope.minKmLap);
        }, null, opcoesGeo);
    };

    function minKm(min, km) {



        min = parseInt(min / 1000) / 60;


        var minKm = min / km;

        var min = Math.floor(minKm);
        if (min < 10) min = '0' + min;

        var seg = Math.round(minKm % 1 * 60);
        if (seg < 10) seg = '0' + seg;

        return min + ':' + seg;
    }

    function resetaDistanciaPercorrida(total) {
        $scope.distPercorrida.lap = {
            exata: 0,
            abreviada: 0,
        };

        if (total) {
            $scope.distPercorrida.total = {
                exata: 0,
                abreviada: 0
            }
        }
    }

    resetaDistanciaPercorrida('total');

    $scope.shortMonth = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dec"];

    $scope.setRelogio = function() {
        $scope.hoje = new Date();
        $scope.dia = $scope.hoje.getDate();
        if ($scope.dia < 10) {
            $scope.dia = "0" + $scope.dia;
        }
        $scope.hora = $scope.hoje.getHours();
        if ($scope.hora < 10) {
            $scope.hora = "0" + $scope.hora;
        }
        $scope.minuto = $scope.hoje.getMinutes();
        if ($scope.minuto < 10) {
            $scope.minuto = "0" + $scope.minuto;
        }

        $scope.hoje = $scope.dia + "/" + $scope.shortMonth[$scope.hoje.getMonth()] + " " + $scope.hora + ":" + $scope.minuto;
    };

    $scope.setRelogio();
    var interv = $interval($scope.setRelogio, 1000);


    $scope.$on('$destroy', function() {
        if (interv) {
            $interval.cancel(interv);
        }
    });

    $scope.showHour = function(hour) {

        var hour = $scope.tempo.hours;

        if (hour >= 1) {
            return true;
        } else {
            return false;
        }
    };


    $scope.ficon = false;
    $scope.getCurrentPosition();
    $scope.confirmStop = function() {

        $scope.montaShareTexto();

        if (navigator.screenshot) {
            navigator.screenshot.save(function(error, res) {
                if (error) {
                    console.error(error);
                } else {


                    $scope.$apply(function() {

                        $scope.printEnd.path = res.filePath;
                        $localstorage.setObject('print', {
                            path: res.filePath
                        });
                    });

                    // window.plugins.socialsharing.shareViaFacebook('Message via Facebook',  res.filePath , null /* url */, function() {
                    // console.log('share ok')
                    // }, function(errormsg){alert(errormsg)})


                }
            }, 'jpg', 100);
        }


        var confirmPopup = $ionicPopup.confirm({
            template: 'Você deseja encerrar seu treino?',
            cancelText: 'Não',
            okText: 'Sim'
        });
        confirmPopup.then(function(res1) {
            if (res1) {
                $scope.stop();
                $scope.share = function() {
                    var share = $ionicPopup.confirm({
                        template: 'Deseja compartilhar seu desempenho?',
                        cancelText: 'Não',
                        okText: 'Sim'
                    });
                    share.then(function(res2) {
                        if (res2) {
                            if (navigator.connection) {
                                if (navigator.connection.type == Connection.NONE) {
                                    $ionicPopup.show({
                                            title: "Sem Conexão",
                                            content: "Verifique sua conexão com a internet."
                                        })
                                        .then(function(result) {
                                            if (!result) {
                                                ionic.Platform.exitApp();
                                            }
                                        });
                                } else {
                                    $state.go('app.compartilhar');
                                }
                            }
                        } else {
                            $location.path('app/inicio');
                        }
                    });
                }();
            } else {
                console.log('Fim');
            }
        });
    };


    $scope.confirmStopOut = function() {
        var confirmPopup = $ionicPopup.confirm({
            template: 'Você deseja encerrar seu treino?',
            cancelText: 'Não',
            okText: 'Sim'
        });
        $scope.montaShareTexto();

        if (navigator.screenshot) {
            navigator.screenshot.save(function(error, res) {
                if (error) {
                    console.error(error);
                } else {


                    $scope.$apply(function() {

                        $scope.printEnd.path = res.filePath;
                        $localstorage.setObject('print', {
                            path: res.filePath
                        });
                    });

                    // window.plugins.socialsharing.shareViaFacebook('Message via Facebook',  res.filePath , null /* url */, function() {
                    // console.log('share ok')
                    // }, function(errormsg){alert(errormsg)})


                }
            }, 'jpg', 100);
        }
        confirmPopup.then(function(res1) {
            if (res1) {
                $scope.stop();
                $scope.share = function() {
                    var share = $ionicPopup.confirm({
                        template: 'Deseja compartilhar seu desempenho?',
                        cancelText: 'Não',
                        okText: 'Sim'
                    });
                    share.then(function(res2) {
                        if (res2) {
                            $location.path('app-out/compartilhar');
                        } else {
                            $location.path('app-out/mpr');
                        }
                    });
                }();
            } else {
                console.log('Fim');
            }
        });
    };

    $scope.trocouProf = function() {


        if (typeof $scope.selectedProf.prof.user_id == "undefined") {
            $scope.icon = true;
        } else {
            $scope.icon = false;
        }

        //
        console.log($scope.selectedProf);
    }

})

.controller('historico', function($rootScope, $http, $scope, $location, LogFactory, appVersion, $interval, $localstorage) {

    $scope.nomeUsuario = LogFactory.getUsername();
    $scope.mes = ["janeiro", "fevereiro", "março", "abril", "maio", "junho", "julho",
        "agosto", "setembro", "outubro", "novembro", "dezembro"
    ];
    $scope.treinos = $localstorage.getObject('treinos');
    console.log($scope.treinos);

    $scope.formataData = function(timestamp) {

        var d = new Date(timestamp);
        return d.getDate() + " de " + $scope.mes[d.getMonth()] +
            " - " + d.getHours() + ":" + d.getMinutes();
    }
})


// --------------------- CMS ----------------------------- //
.controller('cms', function($rootScope, $http, $scope, $location, $ionicPopup, LogFactory, appVersion, base_url, $state, $ionicLoading, $localstorage) {

    $scope.nomeUsuario = LogFactory.getUsername();




    $scope.getLocaisTreinos = function() {
        console.log('funcao get locais treinos');
        var data = $localstorage.getObject('locaisdetreino');

        //console.log(typeof data.professores == 'undefined');
        if (data == null || data == 'null' || typeof data == 'null' || typeof data.professores == 'undefined') {

            if (window.Connection) {
                console.log(navigator.connection.type);
                if (navigator.connection.type == Connection.NONE) {
                    var alertPopup = $ionicPopup.alert({
                        title: 'Sem locais sincronizados',
                        template: 'Também não há conexão com a internet para a sincronização, conecte-se e tente novamente.'
                    });
                    alertPopup.then(function(res) {
                        $state.go('app.inicio');
                    });


                } else {

                    $ionicLoading.show({    
                        template: 'Carregando'  
                    });
                    console.log("carregando locais");
                    $http({
                        method: 'GET',
                        url: base_url + 'getLocaisTreinos'
                    }).success(function(data) {
                        $ionicLoading.hide();
                        $localstorage.setObject('locaisdetreino', data);
                        data = data;
                        $scope.professores = [{
                            user_id: 0,
                            user_name: 'Professor: todos',
                            user_email: null
                        }];
                        for (var i = 0; i < data.professores.length; i++) {
                            $scope.professores.push(data.professores[i]);
                        }
                        $scope.modalidades = [{
                            modalidade_id: 0,
                            modalidade_nome: 'Modalidade: todas',
                            modalidade_treino: null,
                            modalidade_prova: null
                        }];
                        for (var i = 0; i < data.modalidades.length; i++) {
                            $scope.modalidades.push(data.modalidades[i]);
                        }

                        console.log($scope.professores);
                        console.log($scope.modalidades);
                        $scope.selectedProf = $scope.professores[0];
                        $scope.selectedMod = $scope.modalidades[0];
                        $scope.locaisTreinos = data.treinos;
                    }).error(function() {
                        $ionicLoading.hide();
                        var alertPopup = $ionicPopup.alert({
                            title: 'Erro ao carregar os locais',
                            template: 'Tente novamente mais tarde.'
                        });
                        alertPopup.then(function(res) {
                            $state.go('app.inicio');
                        });
                    });
                }
            } else {

                $ionicLoading.show({    
                    template: 'Carregando'  
                });
                console.log("carregando locais 2");
                $http({
                    method: 'GET',
                    url: base_url + 'getLocaisTreinos'
                }).success(function(data) {
                    $ionicLoading.hide();
                    $localstorage.setObject('locaisdetreino', data);
                    data = data;
                    console.log("data");
                    console.log(data);

                    $scope.professores = [{
                        user_id: 0,
                        user_name: 'Professor: todos',
                        user_email: null
                    }];
                    for (var i = 0; i < data.professores.length; i++) {
                        $scope.professores.push(data.professores[i]);
                    }
                    $scope.modalidades = [{
                        modalidade_id: 0,
                        modalidade_nome: 'Modalidade: todas',
                        modalidade_treino: null,
                        modalidade_prova: null
                    }];
                    for (var i = 0; i < data.modalidades.length; i++) {
                        $scope.modalidades.push(data.modalidades[i]);
                    }


                    console.log($scope.professores);
                    console.log($scope.modalidades);
                    $scope.selectedProf = $scope.professores[0];
                    $scope.selectedMod = $scope.modalidades[0];
                    $scope.locaisTreinos = data.treinos;
                }).error(function() {
                    $ionicLoading.hide();
                    var alertPopup = $ionicPopup.alert({
                        title: 'Erro ao carregar os locais',
                        template: 'Tente novamente mais tarde.'
                    });
                    alertPopup.then(function(res) {
                        $state.go('app.inicio');
                    });
                });
            }
        } else {

            console.log(data.professores);
            console.log("data.professores");
            $scope.professores = [{
                user_id: 0,
                user_name: 'Professor: todos',
                user_email: null
            }];
            for (var i = 0; i < data.professores.length; i++) {
                $scope.professores.push(data.professores[i]);
            }
            $scope.modalidades = [{
                modalidade_id: 0,
                modalidade_nome: 'Modalidade: todas',
                modalidade_treino: null,
                modalidade_prova: null
            }];
            for (var i = 0; i < data.modalidades.length; i++) {
                $scope.modalidades.push(data.modalidades[i]);
            }
            $scope.selectedProf = $scope.professores[0];
            $scope.selectedMod = $scope.modalidades[0];
            $scope.locaisTreinos = data.treinos;
        }
    };



    $scope.filtraProfessor = function(arr, professor) {
        if (professor.user_id == 0) return arr;
        var temp = [];
        for (var i = 0; i < arr.length; i++) {
            var fim = false;
            for (var j = 0; j < arr[i].treino.professores.length && !fim; j++) {
                if (arr[i].treino.professores[j].user_id == professor.user_id) {
                    fim = true;
                    temp.push(arr[i]);
                }
            }
        }
        return temp;
    };

    $scope.filtraModalidade = function(arr, modalidade) {
        if (modalidade.modalidade_id == 0) return arr;
        var temp = [];
        for (var i = 0; i < arr.length; i++) {
            if (arr[i].modalidade.modalidade_id == modalidade.modalidade_id) {
                temp.push(arr[i]);
            }
        }
        return temp;
    };

    $scope.showDia = function(arr, professor, modalidade) {
        var a = $scope.filtraProfessor(arr, professor);
        a = $scope.filtraModalidade(a, modalidade);
        return a.length > 0 ? true : false;
    };

    $scope.showDias = function(arr, professor, modalidade) {
        for (var i = 0; i < arr.length; i++) {
            var a = $scope.filtraProfessor(arr[i].treinos, professor);
            a = $scope.filtraModalidade(a, modalidade);
            if (a.length > 0) return false;
        }
        return true;
    };

    $scope.selectedTreino = LogFactory.getTreino();
    $scope.selectedData = LogFactory.getData();
    console.log($scope.selectedTreino);
    console.log($scope.selectedData);

    $scope.zoomTreino = function(treino, dia) {
        LogFactory.setTreinoData(treino, dia);
        console.log($state.current.name);
        if ($state.current.name == 'app.locaisdetreino') $state.go('app.paginas', {
            id: 0
        });
        if ($state.current.name == 'app-out.locaisdetreino') $state.go('app-out.paginas', {
            id: 0
        });

    };
    console.log($state.current.name);
    if ($state.current.name == 'app.locaisdetreino' || $state.current.name == 'app-out.locaisdetreino') $scope.getLocaisTreinos();

    $scope.initMap = function(lat, lng, nome) {
        var myLatlng = {
            lat: lat,
            lng: lng
        };
        console.log('iniciarMapa');
        console.log(myLatlng);
        var map = new google.maps.Map(document.getElementById('map-canvas'), {
            draggable: false,
            center: myLatlng,
            zoom: 16
        });

        var marker = new google.maps.Marker({
            position: myLatlng,
            map: map
        });
    };

    function executaCms(cmsAdmin) {
        console.log("cmsAdmin00");
        $scope.posts = cmsAdmin;
        var cmsprovas = cmsAdmin.provas;

        var dataatual = new Date().getMonth() + 1;
        var ano = new Date().getYear();
        //Reproduz no select meses
        var dataarray = [];
        for (var m = 0; m < 12; m++) {
            if (dataatual == 13) {
                dataatual = 1;
                ano++;
            }
            $dataatual = (convertemes(dataatual) + '/' + (ano - 100));
            dataarray.push({
                mes: $dataatual
            });
            dataatual++;
        }
        $scope.dataarray = dataarray;
        //Reproduz no select modalidades
        console.log("cmsAdmin2");

        var modalidadesarray = [];
        for (var p = 0; p < cmsprovas.length; p++) {
            if (strInArr(modalidadesarray, cmsprovas[p].prova_modalidade[0].modalidade_nome, 'modalidadesarray') == -1) {
                modalidadesarray.push({
                    modalidadesarray: cmsprovas[p].prova_modalidade[0].modalidade_nome

                });


            }
        }
        $scope.modalidadesarray = modalidadesarray;
        // Reproduz os meses seguintes para a busca
        var count = 0;
        $scope.myMonth = "Todos";
        $scope.myMod = "Todas";
        console.log("cmsAdmin3");

        var provas = new Array();
        for (var i = 0; i < cmsprovas.length; i++) {
            // console.log(i);
            provas[count] = new Array();
            $mes = convertemes(cmsprovas[i].prova_data.split('-')[1]);
            $ano = cmsprovas[i].prova_data.split('-')[0].substr(2, 2);
            $dia = cmsprovas[i].prova_data.split('-')[2];
            $nome = cmsprovas[i].prova_nome;
            $local = cmsprovas[i].prova_local;
            $data = cmsprovas[i].prova_data;
            $distancia = cmsprovas[i].prova_distancia;
            $modalidade = cmsprovas[i].prova_modalidade[0].modalidade_nome;
            /*if (mes == new Date().getMonth()+1) {}*/
            provas[count].push({
                mes: $mes,
                dia: $dia,
                nome: $nome,
                local: $local,
                distancia: $distancia,
                modalidade: $modalidade,
                ano: $ano
            });
            count++;
        }

        function verificaSelect() {
            for (var i = 0; i < cmsprovas.length; i++) {}
        }

        $scope.provas = provas;
        $scope.contato = cmsAdmin.contato;
        // $scope.provas = {};




        /*
            Atualização de provas vindas do webservice
            Parametros: Sem parametros
            Metodo: GET
            endpoint: /getProvas
        */

        $ionicLoading.show({    
            template: 'Carregando'
        });

        $http.get('http://mpr.mobint.com.br/webservice/getprovas').then(function(resp) {

            $ionicLoading.hide();
            $scope.provas = resp.data;
            console.log($scope.provas);

        }, function(err) {

            console.log(err);
        })


        $scope.tratarData = function(data) {

            var dataTratar = new Date(data);

            var mes = (dataTratar.getUTCMonth() + 1);
            var dia = (dataTratar.getUTCDate());

            return (dia < 10 ? '0' + dia : dia) + '/' + (mes < 10 ? '0' + mes : mes);

        }





        if ($location.url().substr(0, 10) === "/app/fotos") {
            var idfoto = $location.search().id;
            $scope.fotos = cmsAdmin.galerias[idfoto].fotos;

            /*
            navigator.camera.getPicture(onSuccess, onFail, {
                quality: 100,
                destinationType: Camera.DestinationType.DATA_URL
            });

            function onSuccess(imageData) {
                // here we can upload imageData to the server
            }
            function onFail(message) {
               alert('Failed because: ' + message);
            }*/



        } else if ($location.url().substr(0, 13) === "/app/galerias") {
            $scope.galerias = cmsAdmin.galerias;
            $scope.fotos = cmsAdmin.galerias[0].fotos;
        }
        // console.log(cmsAdmin);
        if ($location.url().substr(0, 12) === "/app/paginas" || $location.url().substr(0, 16) === "/app-out/paginas") {
            // console.log("teste");
            /*var idpag = $location.search().id;


            $scope.regex = /\|/g;
            $scope.modalidades = cmsAdmin.locais[idpag].modalidades;
            $scope.locais = cmsAdmin.locais[idpag];*/
            //google.maps.event.addDomListener(window, 'load', initialize(cmsAdmin.locais[idpag].local_latitude, cmsAdmin.locais[idpag].local_longitude, cmsAdmin.locais[idpag].local_nome));
            console.log($scope.selectedTreino.local.local_latitude);
            console.log($scope.selectedTreino.local.local_longitude);
            console.log($scope.selectedTreino.local.local_nome);
            google.maps.event.addDomListener(window, 'load', $scope.initMap(parseFloat($scope.selectedTreino.local.local_latitude), parseFloat($scope.selectedTreino.local.local_longitude), $scope.selectedTreino.local.local_nome));
        } else {
            $scope.locais = cmsAdmin.locais;

        }
    }
    if ($rootScope.cmsad === null) {
        var banco = openDatabase("MPR", 1.0, "Cadastro do webservice", 2 * 1024 * 1024);
        banco.transaction(function(fn) {
            fn.executeSql("SELECT cmsadmin from tablesqlcms WHERE id=1", [], function(fn, results) {
                var linha = results.rows;
                cmsAdmin = JSON.parse(linha.item(0).cmsadmin);
                console.log("dentro");
                executaCms(cmsAdmin);
            });
        });
    } else {
        //cmsAdmin = JSON.parse($rootScope.cmsad);
        cmsAdmin = ($rootScope.cmsad);
        executaCms(cmsAdmin);
        console.log("dentroelse");
        console.log($scope.posts);
        console.log("dentroelse2");

        /*    console.log(cmsAdmin.galerias[0]);
        console.log(cmsAdmin.galerias[0].fotos[0]);*/
        /*console.log(cmsAdmin);*/
        /*$scope.posts = cmsAdmin;
        $scope.galerias = cmsAdmin.galerias;
        $scope.fotos = cmsAdmin.galerias[0].fotos;
        $scope.locais = cmsAdmin.locais;
        if($location.url().substr(0,10) === "/app/fotos"){
            var idfot = $location.search().id;
            $scope.fotos = cmsAdmin.galerias[idfot].fotos;
        }

        if($location.url().substr(0,12) === "/app/paginas" || $location.url().substr(0,16) === "/app-out/paginas"){
            console.log($location.url().substr(0,12));
            var idpag = $location.search().id;

            $scope.modalidades = cmsAdmin.locais[idpag].modalidades;
            $scope.locais = cmsAdmin.locais[idpag];
            google.maps.event.addDomListener(window, 'load', initialize(cmsAdmin.locais[idpag].local_latitude,cmsAdmin.locais[idpag].local_longitude, cmsAdmin.locais[idpag].local_nome));
        }
        */

    }

    var data = new Date();

    $scope.dataAtual = data.getHours() + ':' + ('0' + data.getMinutes()).slice(-2) + ' - '

    + ('0' + data.getDate()).slice(-2) + '/' + ('0' + (data.getMonth() + 1)).slice(-2) + '/' + (data.getYear() - 100);


    $scope.appVersion = appVersion;
    $scope.logFactory = LogFactory.getInfo();

    console.log($scope.logFactory);
    console.log("dentroelse3logfactory");


    $scope.usuario = $rootScope.usuario;
    console.log($scope.usuario);
    console.log("dentroelse3lougsuario");

    if ($scope.usuario === null || JSON.stringify($scope.usuario) == '{}') {
        $scope.usuario = 'Usuário deslogado';
        $scope.dtAtualizacao = '00/00/0000';
    } else {
        var planilha = cmsData.planilhas[0].planilha;
        var d = new Date(planilha.dt_ini_pla.split('.')[2] + '-' + planilha.dt_ini_pla.split('.')[1] + '-' + planilha.dt_ini_pla.split('.')[0]);

        $scope.dtAtualizacao = ("0" + d.getDate()).slice(-2) + '/' + ("0" + (d.getMonth() + 1)).slice(-2) + '/' + d.getFullYear();
    }


    navigator.geolocation.getCurrentPosition(function(position) {
        $scope.posicao = {
            'lat': position.coords.latitude,
            'lng': position.coords.longitude
        };
        console.log('Latitude: ' + position.coords.latitude + '\n' +
            'Longitude: ' + position.coords.longitude + '\n' +
            'Altitude: ' + position.coords.altitude + '\n' +
            'Accuracy: ' + position.coords.accuracy + '\n' +
            'Altitude Accuracy: ' + position.coords.altitudeAccuracy + '\n' +
            'Heading: ' + position.coords.heading + '\n' +
            'Speed: ' + position.coords.speed + '\n' +
            'Timestamp: ' + position.timestamp + '\n');
    }, function onError(error) {
        console.log('code: ' + error.code + '\n' +
            'message: ' + error.message + '\n');
    }, null);



    console.log("fim");

    $scope.abrirSite = function() {

        var ref = window.open('http://www.mobint.com.br', '_blank', 'location=yes');
    }
})



.controller('fotos', function($rootScope, $http, $scope, $location, $ionicPopup, LogFactory) {
        $scope.nomeUsuario = LogFactory.getUsername();
        //cmsAdmin = JSON.parse(linha.item(0).cmsadmin);
        //$scope.fotos = cmsAdmin.galerias[0].fotos;
    })
    .controller('FeedbackDeTreino', function($rootScope, $http, $scope, $location, $ionicPopup, $ionicLoading, base_url, LogFactory) {
        $scope.nomeUsuario = LogFactory.getUsername();
        if ($rootScope.online) {

            $scope.feedbackForm = {
                id: $rootScope.passid,
                tipoTreino: 'normal',
                dataTreino: null,
                horaTreino: null,
                //modalidade : null,
                descricao: null,
                duracao: '00:00:00',
                tempInicio: '00:00:00'
            };

            $scope.confirmFeedback = function() {
                /* console.log($scope.feedbackForm.duracao);*/

                   
                $ionicLoading.show({    
                    template: 'Carregando'   
                });
                /*console.log($scope.feedbackForm.tempInicio.split(':')[0]);
                console.log($scope.feedbackForm.tempInicio.split(':')[1].substr(0,2));

                console.log($scope.feedbackForm.duracao.split(':')[0]);
                console.log($scope.feedbackForm.duracao.split(':')[1]);
                console.log($scope.feedbackForm.duracao.split(':')[2].substr(0,2));*/

                replace_duracao_1 = $scope.feedbackForm.duracao.replace(":", "");
                replace_duracao_2 = replace_duracao_1.replace(":", "");

                replace_tempInicio = $scope.feedbackForm.tempInicio.replace(":", "");


                console.log(replace_tempInicio);
                // console.log(replace_tempInicio.substr(0, 2) + ":" + replace_tempInicio.substr(2, 2));


                if (replace_duracao_2.substr(4, 2) == "") {
                    var segundos = "00";
                } else {
                    var segundos = replace_duracao_2.substr(4, 2);
                }
                console.log("testeFeedBack");

                var dados = $.param({
                    id: $scope.feedbackForm.id,
                    tipoTreino: $scope.feedbackForm.tipoTreino,
                    dataTreino: $scope.feedbackForm.dataTreino,
                    horaTreino: replace_tempInicio.substr(0, 2) + ":" + replace_tempInicio.substr(2, 2),
                    //modalidade : $scope.feedbackForm,
                    descricao: $scope.feedbackForm.descricao,
                    horaDuracao: replace_duracao_2.substr(0, 2),
                    minutoDuracao: replace_duracao_2.substr(2, 2),
                    segundoDuracao: segundos
                });

                console.log(dados);
                console.log("testeFeedBackPos");
                $http({
                        method: 'POST',
                        url: base_url + 'feedback',
                        data: dados,
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded'
                        }
                    })
                    .success(function(data, status, headers, config) {

                        var form = document.getElementById("idForm");
                        form.reset();   
                        $ionicLoading.hide();
                        $scope.feedbackForm = {
                            id: $rootScope.passid,
                            tipoTreino: 'normal',
                            dataTreino: null,
                            horaTreino: null,
                            //modalidade : null,
                            descricao: null,
                            duracao: '00:00:00',
                            tempInicio: '00:00:00'
                        };
                        $scope.showAlert('Seu feedback foi enviado com sucesso!');

                    })
                    .error(function(data) {
                        alert("Houve um erro ao enviar seu Feedback.");
                        $ionicLoading.hide();
                    });
            };

            $scope.doFeedback = function() {
                if ($scope.feedbackForm.descricao == null || $scope.feedbackForm.descricao == '') {
                    var confirmPopup = $ionicPopup.show({
                        title: 'MPR',
                        template: '<p>Deseja enviar feedback sem descrição?</p>',
                        buttons: [{
                            text: 'Cancelar',
                            onTap: function(e) {
                                return false;
                            }
                        }, {
                            text: 'Enviar',
                            type: 'button-positive',
                            onTap: function(e) {
                                return true;
                            }
                        }]
                    });
                    confirmPopup.then(function(res) {
                        if (res) {
                            $scope.confirmFeedback();
                        } else {

                        }
                    });
                } else {
                    $scope.confirmFeedback();
                }

            };
        } else {
            $scope.showAlert('Sem conexão com a internet para enviar Feedback!');
            $scope.disable = "disabled";

        }

    });