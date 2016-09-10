//Switch to errors only
'use strict';

// const BasePacket = require('./BasePacket.js');
const Packets = require('./Packets');
const PacketTypes = require('./PacketTypes.js');
const Parsers = require('./Parsers.js');

const IPP = {
  currentlyReading: false,
  packetIndex: 1,                                                               //Setting this to 1 to follow the interface documentation
  packet: {},
  emitter: null,

  parser: (emitter, buffer)=>{                                                  //Register emitter and split buffer into bytes for parsing
    IPP.emitter = emitter;                                                        //Registering emitter
    for(let i = 0; i < buffer.length; i++){                                       //Splitting buffer into bytes
      IPP.parseIncomingByte(buffer.readUInt8(i));                                   //Parsing each byte
    }
  },
  parseIncomingByte: (byte)=>{                                                  //Parse incoming bytes
    if(!IPP.currentlyReading && byte === 0x02){                                    //Packet Start Byte
      IPP.currentlyReading = true;                                                  //Changing to reading state
      IPP.packet = {};                                                              //Clearing packet for next packet
      IPP.packetIndex = 2;                                                          //Move to correct byte index
    }
    else if(IPP.packetIndex === 2){                                               //Packet Type Byte
      IPP.parsePacketType(byte);                                                    //Parse Packet Type
      IPP.buildPacket(byte);                                                        //Build Packet based on type
      IPP.packetIndex++;                                                            //Move to next byte index
    }
    else{
      Parsers[IPP.packet.commandNumber](byte, IPP.packetIndex, IPP.packet, IPP.completePacket); //Parse packet data based on packet type
      IPP.packetIndex++;                                                            //Move to next byte index
    }
  },

  parsePacketType: (byte)=>{                                                    //Parse packet type byte
    IPP.packet.commandNumber = byte;                                              //Record byte
    IPP.packet.type = PacketTypes[byte];                                          //Looking up byte meaning in dictionary
  },
  buildPacket: (type)=>{
    IPP.packet = Object.assign(IPP.packet, Packets[type]);
  },
  completePacket: ()=>{                                                         //Close packet and send event to listeners
    IPP.emitter.emit('packet', IPP.packet);                                       //Send parsed packet to listeners

    IPP.currentlyReading = false;                                                 //Resetting reading state
    IPP.packet = {};                                                              //Resetting packet data
    IPP.packetIndex = 0;                                                          //Resetting read index
  }
}

module.exports = IPP;
