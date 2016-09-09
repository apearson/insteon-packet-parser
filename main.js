//Switch to errors only
'use strict';

const IPP = {
  currentlyReading: false,
  packetIndex: 1,
  packet: {
    type: null,
    from: [],
    to: [],
    flag: null,
    cmd1: null,
    cmd2: null,
    extendedData: []
  },
  emitter: null,

  parser: (emitter, buffer)=>{
    //Registering emitter
    IPP.emitter = emitter;

    //console.log(buffer);

    //Splitting buffer into bytes and parsing each
    for(let i = 0; i < buffer.length; i++){
      IPP.parseIncomingByte(buffer.readUInt8(i));
    }
  },
  parseIncomingByte: (byte)=>{
    //Starting to read buffer
    if(!IPP.currentlyReading && byte == 0x02){
      //Starting read
      IPP.currentlyReading = true;

      //Moving to next index
      IPP.packetIndex++;
    }
    else if(IPP.packetIndex === 2){
      IPP.parsePacketType(byte);
    }
    else if(IPP.packet.type == 'command'){
      IPP.parseStandardCommand(byte);
    }
    else if(IPP.packet.type == 'extended'){
      IPP.parseExtendedMessage(byte);
    }
    else if(IPP.packet.type == 'standard'){
      IPP.parseStandardMessage(byte);
    }
  },

  parsePacketType: (byte)=>{
    switch(byte){
      case 0x50:
        IPP.packet.type = 'standard';
        break;
      case 0x51:
        IPP.packet.type = 'extended';
        break;
      case 0x62:
        IPP.packet.type = 'command';
    }

    IPP.packetIndex++;
  },

  /* Commands */
  parseStandardCommand: (byte)=>{
    if(IPP.packetIndex > 2 && IPP.packetIndex < 6){ //To
      IPP.packet.to.push(byte);
      IPP.packetIndex++;
    }
    else if(IPP.packetIndex === 6){
      IPP.packet.flag = byte;
      IPP.packetIndex++;
    }
    else if(IPP.packetIndex == 7){ //Cmd1
      IPP.packet.cmd1 = byte;
      IPP.packetIndex++;
    }
    else if(IPP.packetIndex == 8){ //Cmd2
      IPP.packet.cmd2 = byte;
      IPP.packetIndex++;

      //Complete Packet
      IPP.completePacket();
    }
  },
  parseExtendedCommand: (byte)=>{
  },

  /* Messages */
  parseStandardMessage: (byte)=>{
    if(IPP.packetIndex > 2 && IPP.packetIndex < 6){ //From
      IPP.packet.from.push(byte);
      IPP.packetIndex++;
    }
    else if(IPP.packetIndex > 5 && IPP.packetIndex < 9){ //To
      IPP.packet.to.push(byte);
      IPP.packetIndex++;
    }
    else if(IPP.packetIndex == 9){ //Flag
      IPP.packet.flag = byte;
      IPP.packetIndex++;
    }
    else if(IPP.packetIndex == 10){ //Cmd1
      IPP.packet.cmd1 = byte;
      IPP.packetIndex++;
    }
    else if(IPP.packetIndex == 11){  //Cmd2
      IPP.packet.cmd2 = byte;
      IPP.packetIndex++;

      //Packet Complete
      IPP.completePacket();
    }
  },
  parseExtendedMessage: (byte)=>{
    if(IPP.packetIndex > 2 && IPP.packetIndex < 6){ //From
      IPP.packet.from.push(byte);
      IPP.packetIndex++;
    }
    else if(IPP.packetIndex > 5 && IPP.packetIndex < 9){ //To
      IPP.packet.to.push(byte);
      IPP.packetIndex++;
    }
    else if(IPP.packetIndex == 9){ //Flag
      IPP.packet.flag = byte;
      IPP.packetIndex++;
    }
    else if(IPP.packetIndex == 10){ //Cmd1
      IPP.packet.cmd1 = byte;
      IPP.packetIndex++;
    }
    else if(IPP.packetIndex == 11){ //Cmd2
      IPP.packet.cmd2 = byte;
      IPP.packetIndex++;
    }
    else if(IPP.packetIndex > 11 && IPP.packetIndex < 25){ //Extended Data
      IPP.packet.extendedData.push(byte);
      IPP.packetIndex++;

      //Complete Packet
      if(packetIndex == 24){
        IPP.completePacket();
      }
    }
  },

  /* Packet Complete */
  completePacket: ()=>{
    //Send parsed packet
    IPP.emitter.emit('packet', IPP.packet);

    //Clearing packet data
    IPP.currentlyReading = false;
    IPP.packetIndex = 1;
    IPP.packet = {
      type: null,
      from: [],
      to: [],
      flag: null,
      cmd1: null,
      cmd2: null,
      extendedData: []
    };
  }
}

module.exports = IPP;
