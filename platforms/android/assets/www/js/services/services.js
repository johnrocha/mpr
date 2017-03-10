angular.module('starter.services',[])
.config(function($httpProvider) {
//  $httpProvider.defaults.withCredentials = true;
})

.factory('LogFactory',function($localstorage){
	function isEmpty(obj) {
        if (obj == null) return true;
        if (obj.length > 0)    return false;
        if (obj.length === 0)  return true;
        for (var key in obj) {
            if (hasOwnProperty.call(obj, key)) return false;
        }
        return true;
    }

	var info = {
		platform : null,
		model : null,
		osVersion : null,
		UUID : null
	};

	var _treino = null;
	var _data = null;
	var _username = $localstorage.get('username',null);

	return {
		setInfo : function(platform,model,osVersion, UUID){
			info.platform = platform;
			info.model = model;
			info.osVersion = osVersion;
			info.UUID =UUID;
		},
		getInfo : function(){
			return info;
		},
		setTreinoData : function(treino,data){
			_treino = treino;
			_data = data;
		},
		getTreino : function(){
			return _treino;
		},
		getData : function(){
			return _data;
		},
		getUsername : function(){
			return _username;
		},
		setUsername : function(username){
			var user = username.split('@');
			$localstorage.set('username',user[0]);
			_username = user[0];
		}
	};
})
.factory('$RitmosFactory',function(){

	var _ritmos = null;
	var _searchLegenda = function(legenda){
		var temp = [];
		for(var i = 0; i < _ritmos.length; i++){
			var legendaTemp = _ritmos[i].ritmo.legenda.toUpperCase();
			if(legendaTemp.indexOf(legenda.toUpperCase()) !== -1 ){
				temp.push(_ritmos[i].ritmo);
			}
		}
		return temp;
	};

	var _mergeRitmos = function(ritmos){
		var _merge = {melhorTempo : null, melhorVelocidade : null, piorTempo : null, piorVelocidade : null};
		for(var i = 0; i < ritmos.length; i++){
			if(ritmos[i].tempo.trim() !== ""){
				var tempo = ritmos[i].tempo.split(":");
				var time = 0;
				for(var j = 0; j < tempo.length; j++){
					time = time + (Math.pow(60,tempo.length - j - 1) * parseInt(tempo[j]));
				}
				var velocidade = 3600/time;
				if(i == 0){
					_merge.melhorTempo = ritmos[i].tempo;
					_merge.melhorVelocidade = velocidade;
				}else{
					_merge.piorTempo = ritmos[i].tempo;
					_merge.piorVelocidade = velocidade;
				}
			}
		}
		return _merge;
	};

	return {
		setRitmos : function(ritmos){
			_ritmos = ritmos;
			console.log(_ritmos);
		},
		getRitmo : function(legenda){
			var ritmos = _searchLegenda(legenda);
			var ritmosMerged = _mergeRitmos(ritmos);
			return ritmosMerged;
		}
	};

})

.factory('DBA', function($cordovaSQLite, $q, $ionicPlatform) {
  var self = this;

  // Handle query's and potential errors
  self.query = function (query, parameters) {
    parameters = parameters || [];
    var q = $q.defer();

    $ionicPlatform.ready(function () {
      $cordovaSQLite.execute(db, query, parameters)
        .then(function (result) {
          q.resolve(result);
        }, function (error) {
          console.warn('I found an error');
          console.warn(error);
          q.reject(error);
        });
    });
    return q.promise;
  }

  // Proces a result set
  self.getAll = function(result) {
    var output = [];

    for (var i = 0; i < result.rows.length; i++) {
      output.push(result.rows.item(i));
    }
    return output;
  }

  // Proces a single result
  self.getById = function(result) {
    var output = null;
    output = angular.copy(result.rows.item(0));
    return output;
  }

  return self;
})
.service('$ritmosService', function() {
    
  });

