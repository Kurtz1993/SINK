var chart;
var enviados =[0,0,0,0]; //Paquetes enviados por robot.
var tipo1Recibidos = [0,0,0,0]; //Recibidos por robot.
var tipo2Recibidos = [0,0,0,0]; //Recibidos por robot.
var tipo1PorRobot = [0,0,0,0];
var tipo2PorRobot = [0,0,0,0];
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
    }
];
//Procesa el paquete y actualiza la gráfica y los datos.
var ProcessPacket = function (paquete){
    var porcentajeRecibidos;
    var recibido;
    var enviado;    //Paquetes totales enviados por el robot.
    //Paquete recibido.
    if(paquete.id){
        //Se define si es tipo 1 o tipo 2...
        if(paquete.tipo == 1){
            tipo1PorRobot[paquete.idRobot - 1] = paquete.id;
            tipo1Recibidos[paquete.idRobot - 1]++;  //Se agrega uno más a los paquetes de tipo1 recibidos por este robot.
            recibido = tipo1Recibidos[paquete.idRobot - 1];
            //Se calcula el porcentaje de los paquetes que el SINK ha recibido de este robot.
            porcentajeRecibidos = (recibido * 100) / tipo1PorRobot[paquete.idRobot - 1];
            chartData[paquete.idRobot - 1].tipo1 = porcentajeRecibidos.toFixed(2); //Se actualizan los datos para la gráfica.
            totalTipo1++;   //Se añade un paquete más a los recibidos por el SINK de este tipo
        }
        //Ídem anterior, para paquetes tipo 2...
        else{
            tipo2PorRobot[paquete.idRobot - 1] = paquete.id;
            tipo2Recibidos[paquete.idRobot - 1]++;
            recibido = tipo2Recibidos[paquete.idRobot - 1];
            porcentajeRecibidos = (recibido * 100) / tipo2PorRobot[paquete.idRobot - 1];
            chartData[paquete.idRobot - 1].tipo2 = porcentajeRecibidos.toFixed(2);
            totalTipo2++;
        }
        totalRecibidos++;
    }
    enviados[paquete.idRobot - 1] = tipo1PorRobot[paquete.idRobot - 1] + tipo2PorRobot[paquete.idRobot - 1];
    totalPaquetes = tipo1PorRobot[0] + tipo1PorRobot[1] + tipo1PorRobot[2] + tipo1PorRobot[3] +
                    tipo2PorRobot[0] + tipo2PorRobot[1] + tipo2PorRobot[2] + tipo2PorRobot[3];
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
    valueAxis.title = "Received packets";
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
};

AmCharts.ready(function (){
    RecargarGrafica();
    recargar = true;
});