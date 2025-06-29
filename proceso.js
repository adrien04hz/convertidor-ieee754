//conversion base diez a binario
//con punto flotante
function recopilarElementos(){
    //elementos de html
    let entradaDecimal = document.getElementById("valor_decimal").value;
    let salidaBinario = document.getElementById("valor_binario");
    let salidaHexa = document.getElementById("valor_hexadecimal");
    let elementoExponente = document.getElementById("exponente");
    let elementoExpTexto = document.getElementById("code_exponente");
    let elementoSigno = document.getElementById("signo_numero");
    let elementoSigTexto = document.getElementById("code_sign");
    let elementoBoxSign = document.getElementById("signob");
    let elementoMantissaTexto = document.getElementById("code_decimales");
    let elementoValorMantissa = document.getElementById("decimales");
    let TablaEnteros = document.getElementById("tabla_enteros");
    let TablaFracc = document.getElementById("tabla_frac");
    
    //filas de las tablas a modificar
    let filas = TablaEnteros.rows;
    let fila2 = TablaFracc.rows;


    //Borrar filas en caso de que existan
    while(filas.length > 1){
        TablaEnteros.deleteRow(filas.length -1 );
    }

    while(fila2.length > 1){
        TablaFracc.deleteRow(fila2.length -1 );
    }


    //variables auxiliares
    let respuesta = "";
    let signo;
    let aux;
    let cuentaHastaPunto = 0;
    let tienePunto = false;
    let exponente = 127;
    let mantissaCodificacion;
    let expCodificacion;
    let binarioTotal = "";

    
    if(entradaDecimal != 0){
        //verificacion de signo
        if(entradaDecimal < 0){
            elementoSigno.textContent = "-1";
            elementoSigTexto.textContent = "1";
            elementoBoxSign.checked = true;
            signo = "1"
        }else{
            elementoSigno.textContent = "+1";
            elementoSigTexto.textContent = "0";
            elementoBoxSign.checked = false;
            signo = "0";
        }

        //negativo o no, el procedimiento es igual
        //sacar el valor absoluto
        entradaDecimal = Math.abs(entradaDecimal);
        
        //dividir el numero en parte entera
        //y parte decimal
        let parte_entera = Math.trunc(entradaDecimal);
        let parte_entera2 = Math.trunc(entradaDecimal);
        let parte_decimal = entradaDecimal - parte_entera;

        
        //solo convierte parte entera
        if(parte_entera != 0){
            while(parte_entera != 0){ 

                TablaEnteros.insertRow(-1).innerHTML = '<tr><td>' + parte_entera.toString() + '</td><td>' + "2" + '</td><td>' + Math.trunc(parte_entera / 2).toString() +'</td><td>' + (parte_entera % 2).toString() + '</td></tr>';
                
                aux = parte_entera % 2;
                respuesta = aux.toString() + respuesta;

                parte_entera = Math.trunc(parte_entera / 2);
            }
            document.getElementById("enteroSalidaTabla").value = respuesta;
        }else{
            document.getElementById("enteroSalidaTabla").value = "0";
        }

        //si es decimal entra al if para operar
        //activando bandera de que tiene punto 
        //decimal
        if(parte_decimal != 0){
            respuesta = respuesta + ".";

            for(let i = 0; i < 23; i++){
                aux = parte_decimal * 2;

                TablaFracc.insertRow(-1).innerHTML = '<tr><td>' + parte_decimal.toString() + '</td><td>' + "2" + '</td><td>' + (aux - Math.trunc(aux)).toString()  +'</td><td>' + Math.trunc(aux).toString() + '</td></tr>';
                
                
                respuesta = respuesta + Math.trunc(aux).toString();
                parte_decimal = aux - Math.trunc(aux);
            }

            tienePunto = true;
        }


        if(tienePunto){
            //cuenta hacia la izquierda
            //se suma a 127
            if(parte_entera2 != 0){
                for(let i = 0; i < respuesta.length; i++){
                    if(respuesta.charAt(i) != '.'){
                        //numero de digitos antes del punto
                        cuentaHastaPunto++;
                    }else{
                        break;
                    }
                }

                cuentaHastaPunto--;
                exponente = exponente + cuentaHastaPunto;

            }else{
                //cuenta hacia la derecha
                //se resta a 127
                for(let i = 0; i < respuesta.length; i++){
                    if(respuesta.charAt(i) != '1'){
                        //numero de digitos antes del punto
                        cuentaHastaPunto--;
                    }else{
                        break;
                    }
                }

                exponente = exponente + cuentaHastaPunto;
            }
        }else{

            cuentaHastaPunto = respuesta.length;
            exponente = exponente + --cuentaHastaPunto;

        }


        //modifica valores de exponente en html
        elementoExponente.textContent = cuentaHastaPunto;
        elementoExpTexto.textContent = exponente;

        //cadena de la codificacion del apartado de exponente en binario
        expCodificacion = convierteBinario(exponente);

        if(parte_entera2 != 0){
            mantissaCodificacion = mantissaModifica(respuesta);
        }else{
            mantissaCodificacion = mantissaModifica2(respuesta, Math.abs(cuentaHastaPunto));
        }
        

        mantissaCodificacion = mantissaCodificacion.substring(0,23);


        if(expCodificacion.length < 8){
            while(expCodificacion.length < 8){
                expCodificacion = "0" + expCodificacion;
            }    
        }

        let valorMantisa = parseInt(mantissaCodificacion, 2);

        //valor mantissa texto
        elementoMantissaTexto.textContent = valorMantisa;
        elementoValorMantissa.textContent = "1 + " + ((entradaDecimal / Math.pow(2,cuentaHastaPunto)) -  1).toString();


        //numero decimal completamente binario
        binarioTotal = signo + expCodificacion + mantissaCodificacion;


        if(binarioTotal.length < 32){
            while(binarioTotal.length < 32){
                binarioTotal = binarioTotal + "0";
            }
        }


        //codificacion con checkbox
        boxesExponente(expCodificacion);
        boxesMantisa(mantissaCodificacion);

        //salida en hexadecimal
        salidaHexa.value = hexaSalida(binarioTotal);

        //salida binario completo
        salidaBinario.value = binarioTotal;
    }else{
        location.reload();
    }
}   


//funcion para convertir decimal a binario
function convierteBinario(numero){
    let respuesta = "";
    while(numero != 0){  
        aux = numero % 2;
        respuesta = aux.toString() + respuesta;

        numero = Math.trunc(numero / 2);
    }
    return respuesta;
}


//funcion para codificar mantissa
//en caso de que haya numero con parte entera
function mantissaModifica(cadena){
    let nueva = "";

    for(let i = 1; i < cadena.length; i++){
        if(cadena.charAt(i) != '.'){
            nueva = nueva + cadena.charAt(i);
        }
    }

    return nueva;
}


//modifica mantissa en cado de que solo sean 
//numeros sin parte entera, puro decimal
function mantissaModifica2(cadena, saltos){
    let nueva = "";

    for(let i = ++saltos; i < cadena.length; i++){
        nueva = nueva + cadena.charAt(i);
    }

    return nueva;
}


//codificacion a checkbox
function boxesExponente(cadena){
    for(let i = 0; i < cadena.length; i++){
        let indice = i;
        let aux = "e" + (++indice).toString();
        
        if(cadena.charAt(i) == "1"){
            document.getElementById(aux).checked = true;
        }else{
            document.getElementById(aux).checked = false;
        }
    }
}

function boxesMantisa(cadena){
    for(let i = 0; i < cadena.length; i++){
        let indice = i;
        let aux = "m" + (++indice).toString();
        
        if(cadena.charAt(i) == "1"){
            document.getElementById(aux).checked = true;
        }else{
            document.getElementById(aux).checked = false;
        }
    }
}


//binario a hexadecimal
function hexaSalida(binario){
    let cuatro = "";
    let hexaSalida = "";

    while(binario != ""){
        for(let i = 0; i <= 3; i++){
            cuatro = cuatro + binario.charAt(i);
        }

        binario = binario.substring(4);

        switch(parseInt(cuatro,2)){
            case 0:
                hexaSalida = hexaSalida + "0";
                break;
            case 1:
                hexaSalida = hexaSalida + "1";
                break;
            case 2:
                hexaSalida = hexaSalida + "2";
                break;
            case 3:
                hexaSalida = hexaSalida + "3";
                break;
            case 4:
                hexaSalida = hexaSalida + "4";
                break;
            case 5:
                hexaSalida = hexaSalida + "5";
                break;
            case 6:
                hexaSalida = hexaSalida + "6";
                break;
            case 7:
                hexaSalida = hexaSalida + "7";
                break;
            case 8:
                hexaSalida = hexaSalida + "8";
                break;
            case 9:
                hexaSalida = hexaSalida + "9";
                break;
            case 10:
                hexaSalida = hexaSalida + "a";
                break;
            case 11:
                hexaSalida = hexaSalida + "b";
                break;
            case 12:
                hexaSalida = hexaSalida + "c";
                break;
            case 13:
                hexaSalida = hexaSalida + "d";
                break;
            case 14:
                hexaSalida = hexaSalida + "e";
                break;
            case 15:
                hexaSalida = hexaSalida + "f";
                break;
        }

        cuatro = "";
    }

    return hexaSalida;
}
