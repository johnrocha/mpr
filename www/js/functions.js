function abrir(id){
  var index;
  index = parseInt(id)+1;
  if(!($('.dia:nth-child('+index+') .item-stable').hasClass("active"))){
    $('.dia:nth-child('+index+')').find('.item-stable').addClass('activeted');
    $('.dia:nth-child('+index+')').find('.item-stable').addClass('active');
    $('.dia:nth-child('+index+')').find('.item-accordion').removeClass('ng-hide');
    $('.dia:nth-child('+index+')').find('.item-stable').removeClass('activeted');
    var maioraltura = $('.slider-slides .slider-slide:nth-child(1) .dia:nth-child('+index+') p').height();
    console.log(maioraltura);
    var substituialtura = false;
    for(var x = 2; x <= 4; x++){
     if($('.slider-slides .slider-slide:nth-child('+x+') .dia:nth-child('+index+') p').height() > maioraltura){
       maioraltura = $('.slider-slides .slider-slide:nth-child('+x+') .dia:nth-child('+index+') p').height();
     }
 
     if($('.slider-slides .slider-slide:nth-child('+x+') .dia:nth-child('+index+') p').height() !== maioraltura){
       substituialtura = true;
     }
    
   }
   

   if(substituialtura){
    $('.slider-slides .slider-slide .dia:nth-child('+index+') p').height(maioraltura);
  }
} 
else if($('.dia:nth-child('+index+') .item-stable').hasClass("active")){
 $('.dia:nth-child('+index+')').find('.item-stable').removeClass('active');
 $('.dia:nth-child('+index+')').find('.item-accordion').addClass('ng-hide');
}
}
var map;
function initialize(lat, lon, localnome) {
  var myLatlng = new google.maps.LatLng(lat,lon);
  var mapOptions = {
    center: myLatlng,
    disableDefaultUI: true,
    zoom: 17,
    streetViewControl: false
  };
  map = new google.maps.Map(document.getElementById('map-canvas'),
    mapOptions);
  var marker = new google.maps.Marker({
    position: myLatlng,
    map: map,
    title: localnome
  });  
}

function convertemes(mes){

  if(mes == 1){
    mes = "jan";
  } else if(mes == 2){
    mes = "fev";
  } else if(mes == 3){
    mes = "mar";
  } else if(mes == 4){
    mes = "abr";
  } else if(mes == 5){
    mes = "mai";
  } else if(mes == 6){
    mes = "jun";
  } else if(mes == 7){
    mes = "jul";
  } else if(mes == 8){
    mes = "ago";
  } else if(mes == 9){
    mes = "set";
  } else if(mes == 10){
    mes = "out";
  } else if(mes == 11){
    mes = "nov";
  } else if(mes == 12){
    mes = "dez";
  }

  return  mes;

}

function strInArr(arr, str, nome) {
  for(i = 0; i < arr.length; i++) {
    if(arr[i].modalidadesarray == str) {
      return i ; 
    }
      if(arr[i].ritmosarray == str) {
      return i ; 
    }
  }
  return -1;
}

function verificaItem(){

  document.getElementById('hid').value=document.getElementById('hid').value+1;
  document.getElementById('divi').visibe=false;
}

function retornaMes(mes) {
  

    if (mes == 1) {
        mes = "jan";
    } else if (mes == 2) {
        mes = "fev";
    } else if (mes == 3) {
        mes = "mar";
    } else if (mes == 4) {
        mes = "abr";
    } else if (mes == 5) {
        mes = "mai";
    } else if (mes == 6) {
        mes = "jun";
    } else if (mes == 7) {
        mes = "jul";
    } else if (mes == 8) {
        mes = "ago";
    } else if (mes == 9) {
        mes = "set";
    } else if (mes == 10) {
        mes = "out";
    } else if (mes == 11) {
        mes = "nov";
    } else if (mes == 12) {
        mes = "dez";
    }
    
    return mes;
}

function retornaDiaSemana(diasemana) {
    if (diasemana === 0) {
        diasemana = "domingo";
    } else if (diasemana === 1) {
        diasemana = "segunda-feira";
    } else if (diasemana === 2) {
        diasemana = "terça-feira";
    } else if (diasemana === 3) {
        diasemana = "quarta-feira";
    } else if (diasemana === 4) {
        diasemana = "quinta-feira";
    } else if (diasemana === 5) {
        diasemana = "sexta-feira";
    } else if (diasemana === 5) {
        diasemana = "sábado";
    } else {
        diasemana = "hoje";
    }
    
    return diasemana;
}