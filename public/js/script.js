var chart;
var enviados =[0,0,0,0,0,0,0]; //Paquetes enviados por robot.
var tipo1Recibidos = [0,0,0,0,0,0,0]; //Recibidos por robot.
var tipo2Recibidos = [0,0,0,0,0,0,0]; //Recibidos por robot.
var tipo1PorRobot = [0,0,0,0,0,0,0];
var tipo2PorRobot = [0,0,0,0,0,0,0];
var recargar = false;
var idSimulacion;   //Usada para parar la simulación
var totalPaquetes = 0;
var totalRecibidos = 0;
var totalTipo1 = 0;
var totalTipo2 = 0;

//Un objeto que contiene los datos para la gráfica.
var chartData = [
    {
        "robot": "Robot 1",
        "tipo1": 0,
        "tipo2": 0
    },
    {
        "robot": "Robot 2",
        "tipo1": 0,
        "tipo2": 0
    },
    {
        "robot": "Robot 3",
        "tipo1": 0,
        "tipo2": 0
    },
    {
        "robot": "Robot 4",
        "tipo1": 0,
        "tipo2": 0
    },
    {
        "robot": "Robot 5",
        "tipo1": 0,
        "tipo2": 0
    },
    {
        "robot": "Robot 6",
        "tipo1": 0,
        "tipo2": 0
    },
    {
        "robot": "Robot 7",
        "tipo1": 0,
        "tipo2": 0
    }
];
//Fórmula random -->  ((max - min) * Math.random()) + min
//Crea un nuevo paquete y lo envía. La probabilidad de perder un paquete es de 12% para este ejemplo.
var NuevoPaquete = function (){
    var packet = {};
    var idRobot = Math.round(6 * Math.random() + 1);    //Genera un ID de robot aleatorio del 1 al 7.
    var probabilidad = (99 * Math.random() + 1);        //Genera un número aleatorio del 1 - 100.
    var tipo = Math.round(1 * Math.random() + 1);       //Genera un 1 o un 2.
    if(probabilidad > 12){
        packet.id = enviados[idRobot - 1];              //Asigna al paquete el ID del paquete que envía el robot.
        //packet.valor = (150 * Math.random() + 0);     //Asigna el valor contenido en el sensor.
        packet.idRobot = idRobot;                       //Asigna el ID del robot.
        packet.tipo = tipo;                             //Asigna el tipo de paquete enviado.
    }

    //Estas sumas se efectúan aún y cuando el paquete se perdió...
    if(tipo == 1) tipo1PorRobot[idRobot - 1]++;         //Se van sumando los paquetes generados por tipo...
    else tipo2PorRobot[idRobot - 1]++;
    enviados[idRobot - 1]++;                            //... Los paquetes generados en total por el robot...
    totalPaquetes++;                                    //... Y los paquetes de todos los robots
    return packet;
};

//Procesa el paquete y actualiza la gráfica y los datos.
var ProcesarPaquete = function (paquete){
    var porcentajeRecibidos;
    var recibido;
    var enviado = enviados[paquete.idRobot - 1];    //Paquetes totales enviados por el robot.
    //Paquete recibido.
    if(paquete.id){
        //Se define si es tipo 1 o tipo 2...
        if(paquete.tipo == 1){
            tipo1Recibidos[paquete.idRobot - 1]++;  //Se agrega uno más a los paquetes de tipo1 recibidos por este robot.
            recibido = tipo1Recibidos[paquete.idRobot - 1];
            //Se calcula el porcentaje de los paquetes que el SINK ha recibido de este robot.
            porcentajeRecibidos = (recibido * 100) / enviado;
            chartData[paquete.idRobot - 1].tipo1 = porcentajeRecibidos.toFixed(2); //Se actualizan los datos para la gráfica.
            totalTipo1++;   //Se añade un paquete más a los recibidos por el SINK de este tipo
        }
        //Ídem anterior, para paquetes tipo 2...
        else{
            tipo2Recibidos[paquete.idRobot - 1]++;
            recibido = tipo2Recibidos[paquete.idRobot - 1];
            porcentajeRecibidos = (recibido * 100) / enviado;
            chartData[paquete.idRobot - 1].tipo2 = porcentajeRecibidos.toFixed(2);
            totalTipo2++;
        }
        totalRecibidos++;
    }
    ActualizarInformacion();
    RecargarGrafica();
};

//Recarga la gráfica para que los cambios se vean reflejados.
var RecargarGrafica = function (){
    // SERIAL CHART
    chart = new AmCharts.AmSerialChart();
    chart.dataProvider = chartData;
    chart.categoryField = "robot";
    if(recargar == false) chart.startDuration = 1;
    chart.plotAreaBorderColor = "#DADADA";
    chart.plotAreaBorderAlpha = 1;
    // this single line makes the chart a bar chart
    chart.rotate = false;

    // AXES
    // Category
    var categoryAxis = chart.categoryAxis;
    categoryAxis.gridPosition = "start";
    categoryAxis.gridAlpha = 0.1;
    categoryAxis.axisAlpha = 0;

    // Value
    var valueAxis = new AmCharts.ValueAxis();
    valueAxis.title = "Porcentaje de paquetes recibidos";
    valueAxis.axisAlpha = 0;
    valueAxis.gridAlpha = 0.1;
    valueAxis.unit="%";
    //valueAxis.position = "top";
    chart.addValueAxis(valueAxis);

    // GRAPHS
    // first graph
    var graph1 = new AmCharts.AmGraph();
    graph1.type = "column";
    graph1.title = "Tipo 1";
    graph1.valueField = "tipo1";
    graph1.balloonText = "Paquetes recibidos: [[value]]%";
    graph1.lineAlpha = 0;
    graph1.fillColors = "#ADD981";
    graph1.fillAlphas = 1;
    chart.addGraph(graph1);

    // second graph
    var graph2 = new AmCharts.AmGraph();
    graph2.type = "column";
    graph2.title = "Tipo 2";
    graph2.valueField = "tipo2";
    graph2.balloonText = "Paquetes recibidos: [[value]]%";
    graph2.lineAlpha = 0;
    graph2.fillColors = "#81acd9";
    graph2.fillAlphas = 1;
    chart.addGraph(graph2);

    // LEGEND
    var legend = new AmCharts.AmLegend();
    chart.addLegend(legend);

    chart.creditsPosition = "top-right";

    // WRITE
    chart.write("chartdiv");
};

//Inicia la simulación.
var IniciarSimulacion = function(){
    //Genera y procesa un paquete cada 100ms.
    idSimulacion = setInterval(function(){
        var object = NuevoPaquete();
        ProcesarPaquete(object);
    }, 100);
    $('#iniciarSim').hide(0, function(){
        $('#detenerSim').show(0);
        $('.informacion').slideUp(500);
    });
};

//Detiene la simulación
var DetenerSimulacion = function(){
    clearInterval(idSimulacion);
    $('#detenerSim').hide(0, function(){
        $('#iniciarSim').show(0);
        $('.informacion').slideDown(500);
    });
};

var Toggle = function(item){
    $('#info-'+item).slideToggle(500);
};

//Actualiza la información en los paneles correspondientes.
var ActualizarInformacion = function(){
    var totalPerdidos = 100 - (totalRecibidos * 100 / totalPaquetes);
    $('#info-sink span.transmitidos').html(totalPaquetes);
    $('#info-sink span.recibidos').html(totalRecibidos);
    $('#info-sink span.tipo1').html(totalTipo1);
    $('#info-sink span.tipo2').html(totalTipo2);
    $('#info-sink span.perdidos').html(totalPerdidos.toFixed(2) + "%");

    var perdidos1 = 100 - ((tipo1Recibidos[0]+tipo2Recibidos[0]) * 100 / enviados[0]);
    $('#robot1 span.transmitidos').html(enviados[0]);
    $('#robot1 span.tipo1').html(tipo1PorRobot[0]);
    $('#robot1 span.tipo2').html(tipo2PorRobot[0]);
    $('#robot1 span.perdidos').html(perdidos1.toFixed(2) + "%");

    var perdidos2 = 100 - ((tipo1Recibidos[1]+tipo2Recibidos[1]) * 100 / enviados[1]);
    $('#robot2 span.transmitidos').html(enviados[1]);
    $('#robot2 span.tipo1').html(tipo1PorRobot[1]);
    $('#robot2 span.tipo2').html(tipo2PorRobot[1]);
    $('#robot2 span.perdidos').html(perdidos2.toFixed(2) + "%");

    var perdidos3 = 100 - ((tipo1Recibidos[2]+tipo2Recibidos[2]) * 100 / enviados[2]);
    $('#robot3 span.transmitidos').html(enviados[2]);
    $('#robot3 span.tipo1').html(tipo1PorRobot[2]);
    $('#robot3 span.tipo2').html(tipo2PorRobot[2]);
    $('#robot3 span.perdidos').html(perdidos3.toFixed(2) + "%");

    var perdidos4 = 100 - ((tipo1Recibidos[3]+tipo2Recibidos[3]) * 100 / enviados[3]);
    $('#robot4 span.transmitidos').html(enviados[3]);
    $('#robot4 span.tipo1').html(tipo1PorRobot[3]);
    $('#robot4 span.tipo2').html(tipo2PorRobot[3]);
    $('#robot4 span.perdidos').html(perdidos4.toFixed(2) + "%");

    var perdidos5 = 100 - ((tipo1Recibidos[4]+tipo2Recibidos[4]) * 100 / enviados[4]);
    $('#robot5 span.transmitidos').html(enviados[4]);
    $('#robot5 span.tipo1').html(tipo1PorRobot[4]);
    $('#robot5 span.tipo2').html(tipo2PorRobot[4]);
    $('#robot5 span.perdidos').html(perdidos5.toFixed(2) + "%");

    var perdidos6 = 100 - ((tipo1Recibidos[5]+tipo2Recibidos[5]) * 100 / enviados[5]);
    $('#robot6 span.transmitidos').html(enviados[5]);
    $('#robot6 span.tipo1').html(tipo1PorRobot[5]);
    $('#robot6 span.tipo2').html(tipo2PorRobot[5]);
    $('#robot6 span.perdidos').html(perdidos6.toFixed(2) + "%");

    var perdidos7 = 100 - ((tipo1Recibidos[6]+tipo2Recibidos[6]) * 100 / enviados[6]);
    $('#robot7 span.transmitidos').html(enviados[6]);
    $('#robot7 span.tipo1').html(tipo1PorRobot[6]);
    $('#robot7 span.tipo2').html(tipo2PorRobot[6]);
    $('#robot7 span.perdidos').html(perdidos7.toFixed(2) + "%");
};

AmCharts.ready(function (){
    RecargarGrafica();
    recargar = true;
});