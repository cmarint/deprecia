angular.module('starter', ['ionic','chart.js'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins.Keyboard) {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

      // Don't remove this line unless you know what you are doing. It stops the viewport
      // from snapping when text inputs are focused. Ionic handles this internally for
      // a much nicer keyboard experience.
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})

.controller('myRangePageCtrl', 
     function ($scope, $http, $stateParams, $ionicLoading, $ionicPopup) {
        var oControl = this;
         
         $scope.mostrar = false;
         $scope.show = function() {
            $ionicLoading.show({
              templateUrl: 'loading.html',
              duration: 5000
            }).then(function(){
               console.log("The loading indicator is now displayed");
               
            });
          };
         $scope.mostrar = true;
         
          $scope.hide = function(){
            $ionicLoading.hide().then(function(){
               console.log("The loading indicator is now hidden");
            });
          };

         $scope.datos = {};
         //$scope.datos.rangeValue = 0;
         //$scope.datos.rangeValue2 = 0;
         $scope.datos.rangeValue3 = 1;
        
        $scope.setGrafico = function() {
            antiguedad = $scope.datos.antiguedad;
            valornuevo = $scope.datos.valornuevo;
            valorresidual = $scope.datos.valorresidual;
            condiciones = $scope.datos.rangeValue3;
            flineal = oControl.fDep_Lineal(vidautil, antiguedad, condiciones, valornuevo, valorresidual);
            fitto = oControl.fDep_FittoCorvini(vidautil, antiguedad, condiciones, valornuevo, valorresidual);
            rossh = oControl.fDep_RossHeidecke(vidautil, antiguedad, condiciones, valornuevo, valorresidual);
            kuen = oControl.fDep_Kuentzle(vidautil, antiguedad, condiciones, valornuevo, valorresidual);
            ross = oControl.fDep_Ross(vidautil, antiguedad, condiciones, valornuevo, valorresidual);
            jans = oControl.fDep_Jans(vidautil, antiguedad, condiciones, valornuevo, valorresidual);
            cole = oControl.fDep_Cole(vidautil, antiguedad, condiciones, valornuevo, valorresidual);
            cons = oControl.fDep_PorcConst(vidautil, antiguedad, condiciones, valornuevo, valorresidual);
            oControl.grafico(cons.toFixed(2),cole.toFixed(2),jans.toFixed(2), ross.toFixed(2), kuen.toFixed(2), rossh.toFixed(2), fitto.toFixed(2), flineal.toFixed(2));
            
        }
    
         $scope.$watch('datos.vidautil',function(val,old){
            antiguedad = $scope.datos.antiguedad;
            rango = antiguedad/val*100;
            
            $scope.datos.rangeValue = parseInt(rango);
            $scope.datos.resultado = rango
            $scope.setGrafico();

         });
         
    
        $scope.setAntiguedad = function(data) {
            vidautil = $scope.datos.vidautil;
            rango = data/vidautil*100;
            $scope.datos.rangeValue = parseInt(rango);
            $scope.setGrafico();
            console.log('Valor cambiado');
        }
        /*
         $scope.$watch('datos.antiguedad',function(val,old){
            vidautil = $scope.datos.vidautil;
            rango = val/vidautil*100;
            console.log('Nuevo valor antiguedad:' + val);
            $scope.datos.rangeValue = parseInt(rango);
            $scope.datos.resultado = rango
         });*/
    
        $scope.$watch('datos.rangeValue',function(val,old){
            vidautil = $scope.datos.vidautil;
            antiguedad = (val/100)*vidautil;
            $scope.datos.antiguedad = antiguedad;
            $scope.setGrafico();
            
            //console.log('val:' + val + '-vidautil:' + vidautil);

         });
         
         $scope.$watch('datos.valornuevo',function(val,old){
            valorresidual = $scope.datos.valorresidual;
            rango = valorresidual/val*100;
            
            $scope.datos.rangeValue2 = parseInt(rango);
            $scope.datos.resultado2 = rango;
            $scope.setGrafico();

         });
    
        $scope.setResidual = function(data) {
            valornuevo = $scope.datos.valornuevo;
            rango = data/valornuevo*100;
            $scope.datos.rangeValue2 = parseInt(rango);
            $scope.setGrafico();
            console.log('Valor cambiado');
        }
         
         /*$scope.$watch('datos.valorresidual',function(val,old){
            valornuevo = $scope.datos.valornuevo;
            rango = val/valornuevo*100;
            
            $scope.datos.rangeValue2 = parseInt(rango);
            $scope.datos.resultado2 = rango
         });*/
    
        $scope.$watch('datos.rangeValue2',function(val,old){
            valornuevo = $scope.datos.valornuevo;
            $scope.datos.valorresidual = (val/100)*valornuevo;
            $scope.setGrafico();

         });
         
         $scope.$watch('datos.rangeValue3',function(val,old){
            $scope.datos.resultado = val;
            dato = val*1;
            if (dato == 1)
            {
                $scope.datos.condiciones = 'Nuevo sin reparaciones';
            } else if (dato == 1.5) {
                $scope.datos.condiciones = 'Excelente sin reparaciones'; 
            } else if (dato == 2) {
                $scope.datos.condiciones = 'Estado excelente: Con daños de poca importancia';
            } else if (dato == 2.5) {
                $scope.datos.condiciones = 'Bueno: Con daños de poca importancia';
            } else if (dato == 3) {
                $scope.datos.condiciones = 'Necesita reparaciones sencillas';
            } else if (dato == 3.5) {
                $scope.datos.condiciones = 'Regular: Necesita reparaciones sencillas';
            } else if (dato == 4) {
                $scope.datos.condiciones = 'Regular: Necesita reparaciones importantes';
            } else if (dato == 4.5) {
                $scope.datos.condiciones = 'Mal estado: Necesita reparaciones importantes';
            } else if (dato == 5) {
                $scope.datos.condiciones = 'Construcción con muy poco o ningún valor';
            } 
             
             
            $scope.setGrafico(); 
             
         });
         
         
    oControl.grafico = function (cons,cole, jans, ross, kuen, rossh,fitto,lineal) {
        $scope.colors = ['#ff6384', '#ff8e72'];
        $scope.labels = ['Porc. Constante ('+cons+'%)', 'Colé ('+cole+'%)', 'Jans ('+jans+'%)', 'Ross ('+ross+'%)', 'Kuentzle ('+kuen+'%)', 'Ross-Heidecke ('+rossh+'%)','Fitto-Corvini ('+fitto+'%)','Lineal ('+lineal+'%)'];
        $scope.series = ['Series A'];
        $scope.data = [
                    [cons, cole, jans, ross, kuen, rossh, fitto, lineal]
        ];
    }

    oControl.fDep_PorcConst = function(p_vida_util, p_antiguedad, p_conservacion, p_valor_nuevo, p_valor_residual) {
        if (p_antiguedad == "0" || p_antiguedad === "") {
            return 0;
      }
      
      if (p_vida_util == "0" || p_vida_util === "") {
        return 0;
      }
      
      if ( p_valor_nuevo == "0" ||  p_valor_nuevo === "") {
        return 0;
      }

      if (  p_valor_residual == "0" ||   p_valor_residual === "") {
        return 0;
      }
      
      antiguedad = parseInt(p_antiguedad);
      vida_util = parseInt(p_vida_util);
      reposicion_nuevo = parseFloat(p_valor_nuevo);
      residual = parseFloat(p_valor_residual);

      fracc = residual / reposicion_nuevo
      raiz = 1 / vida_util
      porc_fijo = 1 - Math.pow( (residual / reposicion_nuevo), (1/vida_util)) 
      aux_monto = reposicion_nuevo
      deprec_acum = 0 
      for (i = 1; i <= antiguedad; i++) {
        mto_deprec = aux_monto * porc_fijo;
        deprec_acum = deprec_acum + mto_deprec;
        porc_periodo = deprec_acum / reposicion_nuevo;
        aux_monto = reposicion_nuevo - deprec_acum;
      }
      valor = Math.round(porc_periodo*10000) / 100  

      return valor;
    }

    oControl.fDep_Cole = function(p_vida_util, p_antiguedad, p_conservacion, p_valor_nuevo, p_valor_residual) {
        if (p_antiguedad == "0" || p_antiguedad === "") {
            return 0;
      }
      
      if (p_vida_util == "0" || p_vida_util === "") {
        return 0;
      }

      antiguedad = parseInt(p_antiguedad);
      vida_util = parseInt(p_vida_util);

      lineal = antiguedad / vida_util;
      
      suma_numero = ((1 + vida_util) * vida_util)/2;
      suma = 0;
      k = vida_util - antiguedad + 1;
      for (i = vida_util; i >= k; i--) {
      suma = suma + (i / suma_numero);
      }
      valor = Math.round(suma * 10000) / 100;

      return valor;
  }

    oControl.fDep_Jans = function(p_vida_util, p_antiguedad, p_conservacion, p_valor_nuevo, p_valor_residual) {
        if (p_antiguedad == "0" || p_antiguedad === "") {
            return 0;
      }
      
      if (p_vida_util == "0" || p_vida_util === "") {
        return 0;
      }

      antiguedad = parseInt(p_antiguedad);
      vida_util = parseInt(p_vida_util);

      lineal = antiguedad / vida_util;
      valor = Math.pow(lineal,(1/0.5)) * 100;
      
      return valor;
    }
    
    oControl.fDep_Ross = function(p_vida_util, p_antiguedad, p_conservacion, p_valor_nuevo, p_valor_residual) {
        if (p_antiguedad == "0" || p_antiguedad === "") {
            return 0;
        }

        if (p_vida_util == "0" || p_vida_util === "") {
            return 0;
        }

        antiguedad = parseInt(p_antiguedad);
        vida_util = parseInt(p_vida_util);

        lineal = antiguedad / vida_util;
        valor = ((lineal+Math.pow(lineal,2))/2 )*100;

        return valor;
    }
    oControl.fDep_Kuentzle = function(p_vida_util, p_antiguedad, p_conservacion, p_valor_nuevo, p_valor_residual) {
        if (p_antiguedad == "0" || p_antiguedad === "") {
            return 0;
        }

        if (p_vida_util == "0" || p_vida_util === "") {
            return 0;
        }

        antiguedad = parseInt(p_antiguedad);
        vida_util = parseInt(p_vida_util);

        lineal = antiguedad / vida_util;
        valor = Math.pow(lineal,2) * 100;

        return valor;
    }

    
    oControl.fDep_Lineal = function (p_vida_util, p_antiguedad, p_conservacion, p_valor_nuevo, p_valor_residual) {
        if (p_antiguedad == "0" || p_antiguedad === "") {
            return 0;
        }

        if (p_vida_util == "0" || p_vida_util === "") {
            return 0;
        }

        antiguedad = parseInt(p_antiguedad);
        vida_util = parseInt(p_vida_util);

        lineal = antiguedad / vida_util;
        valor = Math.round(lineal * 10000) / 100;

        return valor;
    }
    
    
    oControl.fDep_FittoCorvini = function (p_vida_util, p_antiguedad, p_conservacion, p_valor_nuevo, p_valor_residual) {
    if (p_antiguedad == "0" || p_antiguedad === "") {
        return 0;
	}
	
	if (p_vida_util == "0" || p_vida_util === "") {
		return 0;
	}
	
	if (p_conservacion == "99" || p_conservacion === "") {
		return 0;
	}
	
	if ( p_valor_nuevo == "0" ||  p_valor_nuevo === "") {
		return 0;
	}

	if (  p_valor_residual == "0" ||   p_valor_residual === "") {
		return 0;
	}
	
	antiguedad = parseInt(p_antiguedad);
	vida_util = parseInt(p_vida_util);
	clase_sel = parseFloat(p_conservacion);
	reposicion_nuevo = parseFloat(p_valor_nuevo);
	residual = parseFloat(p_valor_residual);
	
	key_compuesta = "0;1;0-0;1,5;0,05-0;2;2,5-0;2,5;8,05-0;3;18,1-0;3,5;33,2-0;4;51,6-0;4,5;75,1-0;5;100-1;1;0,5-1;1,5;0,55-1;2;3,01-1;2,5;8,55-1;3;18,51-1;3,5;33,54-1;4;52,84-1;4,5;75,32-1;5;100-2;1;1,02-2;1,5;1,05-2;2;3,51-2;2,5;9,03-2;3;18,94-2;3,5;33,89-2;4;53,09-2;4,5;75,45-2;5;100-3;1;1,54-3;1,5;1,57-3;2;4,03-3;2,5;9,51-3;3;19,37-3;3,5;34,23-3;4;53,34-3;4,5;75,58-3;5;100-4;1;2,08-4;1,5;2,11-4;2;4,55-4;2,5;10-4;3;19,8-4;3,5;34,59-4;4;53,59-4;4,5;75,71-4;5;100-5;1;2,62-5;1,5;2,65-5;2;5,08-5;2,5;10,5-5;3;20,25-5;3,5;34,95-5;4;53,94-5;4,5;75,85-5;5;100-6;1;3,1-6;1,5;3,21-6;2;5,62-6;2,5;11,01-6;3;20,7-6;3,5;35,32-6;4;54,11-6;4,5;75,99-6;5;100-7;1;3,74-7;1,5;3,77-7;2;6,17-7;2,5;11,53-7;3;21,17-7;3,5;35,7-7;4;54,38-7;4,5;76,13-7;5;100-8;1;4,32-8;1,5;4,35-8;2;6,73-8;2,5;12,06-8;3;21,64-8;3,5;36,09-8;4;54,65-8;4,5;76,27-8;5;100-9;1;4,9-9;1,5;4,93-9;2;7,3-9;2,5;12,6-9;3;22,12-9;3,5;36,43-9;4;54,93-9;4,5;76,41-9;5;100-10;1;5,5-10;1,5;5,53-10;2;7,88-10;2,5;13,15-10;3;22,6-10;3,5;36,87-10;4;55,21-10;4,5;76,56-10;5;100-11;1;6,1-11;1,5;6,13-11;2;8,47-11;2,5;13,7-11;3;23,1-11;3,5;37,27-11;4;55,49-11;4,5;76,71-11;5;100-12;1;6,72-12;1,5;6,75-12;2;9,07-12;2,5;14,27-12;3;23,61-12;3,5;37,68-12;4;55,78-12;4,5;76,86-12;5;100-13;1;7,34-13;1,5;7,37-13;2;9,88-13;2,5;14,84-13;3;24,12-13;3,5;38,1-13;4;56,08-13;4,5;77,02-13;5;100-14;1;7,99-14;1,5;8-14;2;10,3-14;2,5;15,42-14;3;24,53-14;3,5;38,51-14;4;56,38-14;4,5;77,18-14;5;100-15;1;8,62-15;1,5;8,65-15;2;10,93-15;2,5;16,02-15;3;25,16-15;3,5;38,95-15;4;56,69-15;4,5;77,34-15;5;100-16;1;9,29-16;1,5;9,3-16;2;11,57-16;2,5;16,62-16;3;25,7-16;3,5;39,39-16;4;57-16;4,5;77,5-16;5;100-17;1;9,94-17;1,5;9,97-17;2;12,22-17;2,5;17,23-17;3;26,25-17;3,5;39,84-17;4;57,31-17;4,5;77,66-17;5;100-18;1;10,62-18;1,5;10,64-18;2;12,87-18;2,5;17,85-18;3;26,8-18;3,5;40,29-18;4;57,63-18;4,5;77,83-18;5;100-19;1;11,3-19;1,5;11,33-19;2;13,54-19;2,5;18,48-19;3;27,36-19;3,5;40,75-19;4;57,96-19;4,5;78-19;5;100-20;1;12-20;1,5;12,01-20;2;14,22-20;2,5;19,12-20;3;27,93-20;3,5;41,22-20;4;58,29-20;4,5;78,17-20;5;100-21;1;12,7-21;1,5;12,73-21;2;14,91-21;2,5;19,77-21;3;28,51-21;3,5;41,69-21;4;58,62-21;4,5;78,35-21;5;100-22;1;13,42-22;1,5;13,44-22;2;15,6-22;2,5;20,42-22;3;29,09-22;3,5;42,16-22;4;58,96-22;4,5;78,53-22;5;100-23;1;14,14-23;1,5;14,17-23;2;16,31-23;2,5;21,09-23;3;29,68-23;3,5;42,85-23;4;59,3-23;4,5;78,71-23;5;100-24;1;14,92-24;1,5;14,9-24;2;17,03-24;2,5;21,77-24;3;30,28-24;3,5;43,14-24;4;59,85-24;4,5;78,89-24;5;100-25;1;15,62-25;1,5;15,65-25;2;17,75-25;2,5;22,45-25;3;30,89-25;3,5;43,64-25;4;60-25;4,5;79,07-25;5;100-26;1;16,33-26;1,5;16,4-26;2;18,49-26;2,5;23,14-26;3;31,51-26;3,5;44,14-26;4;60,36-26;4,5;79,26-26;5;100-27;1;17,14-27;1,5;17,17-27;2;19,23-27;2,5;23,85-27;3;32,14-27;3,5;44,65-27;4;60,72-27;4,5;79,45-27;5;100-28;1;17,92-28;1,5;17,95-28;2;19,99-28;2,5;24,56-28;3;32,78-28;3,5;45,17-28;4;61,09-28;4,5;79,64-28;5;100-29;1;18,7-29;1,5;18,73-29;2;20,75-29;2,5;25,28-29;3;33,42-29;3,5;45,69-29;4;61,46-29;4,5;79,84-29;5;100-30;1;19,5-30;1,5;19,52-30;2;21,53-30;2,5;26,01-30;3;34,07-30;3,5;46,22-30;4;61,84-30;4,5;80,04-30;5;100-31;1;20,3-31;1,5;20,33-31;2;22,31-31;2,5;26,75-31;3;34,73-31;3,5;46,76-31;4;62,22-31;4,5;80,24-31;5;100-32;1;21,12-32;1,5;21,15-32;2;23,11-32;2,5;27,5-32;3;35,4-32;3,5;47,31-32;4;62,61-32;4,5;80,44-32;5;100-33;1;21,94-33;1,5;21,97-33;2;23,9-33;2,5;28,26-33;3;36,07-33;3,5;47,86-33;4;63-33;4,5;80,64-33;5;100-34;1;22,78-34;1,5;22,8-34;2;24,73-34;2,5;29,03-34;3;36,76-34;3,5;48,42-34;4;63,4-34;4,5;80,85-34;5;100-35;1;23,62-35;1,5;23,64-35;2;25,55-35;2,5;29,8-35;3;37,45-35;3,5;48,98-35;4;63,8-35;4,5;81,06-35;5;100-36;1;24,48-36;1,5;24,5-36;2;26,38-36;2,5;30,59-36;3;38,15-36;3,5;49,55-36;4;64,2-36;4,5;81,27-36;5;100-37;1;25,34-37;1,5;25,34-37;2;27,23-37;2,5;31,38-37;3;38,86-37;3,5;50,13-37;4;64,61-37;4,5;81,48-37;5;100-38;1;26,22-38;1,5;26,24-38;2;28,08-38;2,5;32,19-38;3;39,57-38;3,5;50,71-38;4;65,03-38;4,5;81,7-38;5;100-39;1;27,1-39;1,5;27,12-39;2;28,94-39;2,5;33-39;3;40,3-39;3,5;51,3-39;4;65,45-39;4,5;81,92-39;5;100-40;1;28-40;1,5;28,02-40;2;29,81-40;2,5;33,82-40;3;41,03-40;3,5;51,9-40;4;65,87-40;4,5;82,14-40;5;100-41;1;28,9-41;1,5;28,92-41;2;30,7-41;2,5;34,66-41;3;41,77-41;3,5;52,51-41;4;66,3-41;4,5;82,37-41;5;100-42;1;29,82-42;1,5;29,84-42;2;31,59-42;2,5;35,5-42;3;42,52-42;3,5;53,12-42;4;66,73-42;4,5;82,6-42;5;100-43;1;30,74-43;1,5;30,76-43;2;32,49-43;2,5;36,35-43;3;43,28-43;3,5;53,74-43;4;67,17-43;4,5;82,83-43;5;100-44;1;31,68-44;1,5;31,7-44;2;33,4-44;2,5;37,21-44;3;44,05-44;3,5;54,36-44;4;67,61-44;4,5;83,06-44;5;100-45;1;32,62-45;1,5;32,64-45;2;34,32-45;2,5;38,08-45;3;44,82-45;3,5;54,99-45;4;68,06-45;4,5;83,29-45;5;100-46;1;33,58-46;1,5;33,6-46;2;35,25-46;2,5;38,95-46;3;45,6-46;3,5;55,63-46;4;68,51-46;4,5;83,53-46;5;100-47;1;34,54-47;1,5;34,56-47;2;36,19-47;2,5;39,84-47;3;46,39-47;3,5;56,23-47;4;68,97-47;4,5;83,77-47;5;100-48;1;35,52-48;1,5;35,54-48;2;37,14-48;2,5;40,74-48;3;47,19-48;3,5;56,93-48;4;69,43-48;4,5;84,01-48;5;100-49;1;36,5-49;1,5;36,52-49;2;38,1-49;2,5;41,64-49;3;48-49;3,5;57,59-49;4;69,9-49;4,5;84,25-49;5;100-50;1;37,5-50;1,5;37,52-50;2;39,07-50;2,5;42,56-50;3;48,81-50;3,5;58,25-50;4;70,37-50;4,5;84,5-50;5;100-51;1;38,5-51;1,5;38,52-51;2;40,05-51;2,5;43,48-51;3;49,63-51;3,5;58,92-51;4;70,85-51;4,5;84,75-51;5;100-52;1;39,52-52;1,5;39,53-52;2;41,04-52;2,5;44,41-52;3;50,46-52;3,5;59,6-52;4;71,33-52;4,5;85-52;5;100-53;1;40,54-53;1,5;40,56-53;2;42,04-53;2,5;45,35-53;3;51,3-53;3,5;60,28-53;4;71,82-53;4,5;85,25-53;5;100-54;1;41,58-54;1,5;41,59-54;2;43,05-54;2,5;46,3-54;3;52,15-54;3,5;60,97-54;4;72,31-54;4,5;85,51-54;5;100-55;1;42,62-55;1,5;42,64-55;2;44,07-55;2,5;47,26-55;3;53,01-55;3,5;61,67-55;4;72,8-55;4,5;85,77-55;5;100-56;1;43,68-56;1,5;43,69-56;2;45,1-56;2,5;48,24-56;3;53,87-56;3,5;62,39-56;4;73,3-56;4,5;86,03-56;5;100-57;1;44,74-57;1,5;44,76-57;2;46,14-57;2,5;49,22-57;3;54,74-57;3,5;63,09-57;4;73,81-57;4,5;86,29-57;5;100-58;1;45,82-58;1,5;45,83-58;2;47,19-58;2,5;50,2-58;3;55,62-58;3,5;63,81-58;4;74,32-58;4,5;86,56-58;5;100-59;1;46,9-59;1,5;46,92-59;2;48,25-59;2,5;51,2-59;3;56,51-59;3,5;64,53-59;4;74,83-59;4,5;86,83-59;5;100-60;1;48-60;1,5;48,01-60;2;49,32-60;2,5;52,2-60;3;57,41-60;3,5;65,26-60;4;75,35-60;4,5;87,1-60;5;100-61;1;49,1-61;1,5;49,12-61;2;50,39-61;2,5;53,22-61;3;58,32-61;3,5;66-61;4;75,87-61;4,5;87,38-61;5;100-62;1;50,22-62;1,5;50,23-62;2;51,47-62;2,5;54,25-62;3;58,23-62;3,5;66,75-62;4;76,4-62;4,5;87,66-62;5;100-63;1;51,34-63;1,5;51,26-63;2;52,57-63;2,5;55,28-63;3;60,15-63;3,5;67,5-63;4;76,94-63;4,5;87,94-63;5;100-64;1;52,48-64;1,5;52,49-64;2;53,68-64;2,5;56,32-64;3;61,08-64;3,5;68,26-64;4;77,48-64;4,5;88,22-64;5;100-65;1;53,62-65;1,5;53,64-65;2;54,8-65;2,5;57,38-65;3;62,02-65;3,5;69,02-65;4;78,02-65;4,5;88,5-65;5;100-66;1;54,78-66;1,5;54,79-66;2;55,93-66;2,5;58,44-66;3;62,96-66;3,5;69,79-66;4;78,57-66;4,5;88,79-66;5;100-67;1;55,94-67;1,5;55,95-67;2;57,06-67;2,5;59,51-67;3;63,92-67;3,5;70,57-67;4;79,12-67;4,5;89,08-67;5;100-68;1;57,12-68;1,5;57,13-68;2;58,2-68;2,5;60,59-68;3;64,88-68;3,5;71,36-68;4;79,63-68;4,5;89,37-68;5;100-69;1;58,3-69;1,5;58,31-69;2;59,36-69;2,5;61,68-69;3;65,05-69;3,5;72,15-69;4;80,24-69;4,5;89,66-69;5;100-70;1;59,5-70;1,5;59,51-70;2;60,52-70;2,5;62,78-70;3;66,83-70;3,5;72,95-70;4;80,8-70;4,5;89,96-70;5;100-71;1;60,7-71;1,5;60,71-71;2;61,7-71;2,5;63,88-71;3;67,82-71;3,5;73,75-71;4;81,37-71;4,5;90,26-71;5;100-72;1;61,92-72;1,5;61,93-72;2;62,88-72;2,5;65-72;3;68,81-72;3,5;74,56-72;4;81,95-72;4,5;90,56-72;5;100-73;1;63,14-73;1,5;63,15-73;2;64,08-73;2,5;66,13-73;3;69,81-73;3,5;75,38-73;4;82,53-73;4,5;90,85-73;5;100-74;1;64,38-74;1,5;64,39-74;2;65,28-74;2,5;67,27-74;3;70,83-74;3,5;76,21-74;4;83,12-74;4,5;91,17-74;5;100-75;1;65,62-75;1,5;65,63-75;2;66,49-75;2,5;68,41-75;3;71,85-75;3,5;77,04-75;4;83,71-75;4,5;91,47-75;5;100-76;1;66,88-76;1,5;66,89-76;2;67,71-76;2,5;69,57-76;3;72,87-76;3,5;77,88-76;4;84,3-76;4,5;91,78-76;5;100-77;1;68,14-77;1,5;68,15-77;2;68,95-77;2,5;70,73-77;3;73,91-77;3,5;78,72-77;4;84,9-77;4,5;92,1-77;5;100-78;1;69,42-78;1,5;69,43-78;2;70,19-78;2,5;71,9-78;3;74,95-78;3,5;79,57-78;4;85,5-78;4,5;92,42-78;5;100-79;1;70,7-79;1,5;70,71-79;2;71,44-79;2,5;73,08-79;3;76,01-79;3,5;80,43-79;4;86,11-79;4,5;92,74-79;5;100-80;1;72-80;1,5;73-80;2;72,71-80;2,5;74,28-80;3;77,07-80;3,5;81,3-80;4;86,73-80;4,5;93-80;5;100-81;1;73,3-81;1,5;73,31-81;2;73,98-81;2,5;75,48-81;3;78,14-81;3,5;82,17-81;4;87,35-81;4,5;93,38-81;5;100-82;1;74,62-82;1,5;74,82-82;2;75,26-82;2,5;76,07-82;3;79,21-82;3,5;83,05-82;4;87,97-82;4,5;93,7-82;5;100-83;1;75,94-83;1,5;75,95-83;2;76,56-83;2,5;77,89-83;3;80,3-83;3,5;83,93-83;4;88,6-83;4,5;94,03-83;5;100-84;1;77,48-84;1,5;77,28-84;2;77,85-84;2,5;79,12-84;3;81,39-84;3,5;84,82-84;4;89,23-84;4,5;94,36-84;5;100-85;1;78,62-85;1,5;78,63-85;2;79,16-85;2,5;80,35-85;3;82,49-85;3,5;85,72-85;4;89,87-85;4,5;94,7-85;5;100-86;1;79,98-86;1,5;79,98-86;2;80,48-86;2,5;81,6-86;3;83,6-86;3,5;86,63-86;4;90,51-86;4,5;95,04-86;5;100-87;1;81,34-87;1,5;81,35-87;2;81,82-87;2,5;82,85-87;3;84,72-87;3,5;87,54-87;4;91,16-87;4,5;95,38-87;5;100-88;1;82,72-88;1,5;82,73-88;2;83,16-88;2,5;84,12-88;3;85,85-88;3,5;88,46-88;4;91,81-88;4,5;95,72-88;5;100-89;1;84,1-89;1,5;84,11-89;2;84,51-89;2,5;85,39-89;3;86,93-89;3,5;89,38-89;4;92,47-89;4,5;96,05-89;5;100-90;1;85,5-90;1,5;85,5-90;2;85,87-90;2,5;86,67-90;3;88,12-90;3,5;90,31-90;4;93,13-90;4,5;96,4-90;5;100-91;1;86,9-91;1,5;86,9-91;2;87,23-91;2,5;87,96-91;3;89,27-91;3,5;91,25-91;4;93,79-91;4,5;96,75-91;5;100-92;1;88,32-92;1,5;88,32-92;2;88,61-92;2,5;89,26-92;3;90,43-92;3,5;92,2-92;4;94,46-92;4,5;97,1-92;5;100-93;1;89,74-93;1,5;89,74-93;2;90-93;2,5;90,57-93;3;91,57-93;3,5;93,15-93;4;95,14-93;4,5;97,45-93;5;100-94;1;91,18-94;1,5;91,18-94;2;91,4-94;2,5;91,89-94;3;92,77-94;3,5;94,11-94;4;95,82-94;4,5;97,01-94;5;100-95;1;92,62-95;1,5;92,62-95;2;92,81-95;2,5;93,22-95;3;93,96-95;3,5;95,07-95;4;96,5-95;4,5;98,17-95;5;100-96;1;94,08-96;1,5;94,08-96;2;94,93-96;2,5;94,56-96;3;95,15-96;3,5;96,04-96;4;97,19-96;4,5;98,53-96;5;100-97;1;95,54-97;1,5;95,54-97;2;95,66-97;2,5;95,61-97;3;95,35-97;3,5;97,02-97;4;97,89-97;4,5;98,89-97;5;100-98;1;97,02-98;1,5;97,02-98;2;97,1-98;2,5;97,26-98;3;97,56-98;3,5;98,01-98;4;98,59-98;4,5;98,26-98;5;100-99;1;98,5-99;1,5;98,5-99;2;98,54-99;2,5;99,63-99;3;98,78-99;3,5;99-99;4;99,29-99;4,5;99,63-99;5;100-100;1;100-100;1,5;100-100;2;100-100;2,5;100-100;3;100-100;3,5;100-100;4;100-100;4,5;100-100;5;100-";
	arr_edad_clases = key_compuesta.split("-");
	edad_actual = Math.round((antiguedad / vida_util)*100);
	index_edad_clase = edad_actual * 9 + clase_sel;	// por cada edad viene 10 (0 a 9) clases
	arr_edad_clase_valor = arr_edad_clases[index_edad_clase].split(";");
	valor_clase = parseFloat(arr_edad_clase_valor[2].replace(",","."));
	valor = Math.round(valor_clase*100) / 100;

	return valor;
}
    oControl.fDep_RossHeidecke = function(p_vida_util, p_antiguedad, p_conservacion, p_valor_nuevo, p_valor_residual) {
    if (p_antiguedad == "0" || p_antiguedad === "") {
        return 0;
	}
	
	if (p_vida_util == "0" || p_vida_util === "") {
		return 0;
	}
	
	if (p_conservacion == "99" || p_conservacion === "") {
		return 0;
	}
	
	if ( p_valor_nuevo == "0" ||  p_valor_nuevo === "") {
		return 0;
	}

	if (  p_valor_residual == "0" ||   p_valor_residual === "") {
		return 0;
	}
	
	antiguedad = parseInt(p_antiguedad);
	vida_util = parseInt(p_vida_util);
	clase_sel = parseFloat(p_conservacion);
	reposicion_nuevo = parseInt(p_valor_nuevo);
	residual = parseInt(p_valor_residual);
	
	depreciacion = (reposicion_nuevo - residual) * (valor_clase / 100);
	aux_val = depreciacion / reposicion_nuevo;
	valor = Math.round((depreciacion / reposicion_nuevo) * 10000) / 100;

	return valor;
}

    
})
