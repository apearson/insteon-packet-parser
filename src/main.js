//Switch to errors only
'use strict';

const Packets = require('./Packets.js');

let packetTypeNeeded = true;    //Packet Type undefined?
let packet = {completed: true}; //Template Packet

const IPP = {
  parser: (emitter, buffer)=>{                                                  //Register emitter and split buffer into bytes for parsing
    IPP.emitter = emitter;                                                        //Registering emitter
    for(let i = 0; i < buffer.length; i++){                                       //Splitting buffer into bytes
      IPP.parseIncomingByte(buffer.readUInt8(i), emitter);                          //Parsing each byte
    }
  },
  parseIncomingByte: (byte, emitter)=>{                                           //Parse incoming bytes
    //console.log(packet.bytesNeeded());
    if(packet.completed && byte === 0x02){                                        //Packet Start Byte
      packetTypeNeeded = true;
    }
    else if(packet.completed && packetTypeNeeded){                                //Packet Type Byte
      packetTypeNeeded = false;
      packet = new Packets[byte](emitter);
    }
    else if(!packet.completed){
      packet.parse(byte);
    }
    else{
      console.log('Got garbage data: ' + byte.toString(16));
    }
  }
}

module.exports = IPP;
