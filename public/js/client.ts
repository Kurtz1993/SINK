var tipoPkt: Array<number> = [0, 0];
var NewPacket = (idRobot): IPacket => {
  var packet: IPacket;
  var probabilidad: number = (99 * Math.random() + 1);        //Genera un número aleatorio del 1 - 100.
  var tipo: number = Math.round(1 * Math.random() + 1);       //Genera un 1 o un 2.
  tipoPkt[tipo - 1]++;
  if (probabilidad > 10) {
    packet.id = tipoPkt[tipo - 1];              //Asigna al paquete el ID del paquete que envía el robot. 
    packet.valor = Math.round((100 * Math.random() + 0));     //Asigna el valor contenido en el sensor.
    packet.idRobot = idRobot;                       //Asigna el ID del robot.
    packet.tipo = tipo;                             //Asigna el tipo de paquete enviado.
  }
  return packet;
};