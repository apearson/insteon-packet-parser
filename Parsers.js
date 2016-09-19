'use strict;'                                                                   //Switch to errors only

module.exports = {
  //Packet Type parsers
  0x50: (byte, index, packet) => {
    if (index > 2 && index < 6) {                                              //From
      packet.from.push(byte);
    } else if (index > 5 && index < 9) {                                        //To
      packet.to.push(byte);
    } else if (index == 9) {                                                    //Flag
      packet.flag = byte;
    } else if (index == 10) {                                                   //Cmd1
      packet.cmd1 = byte;
    } else if (index == 11) {                                                   //Cmd2
      packet.cmd2 = byte;
      return true;                                                                //Finished with packet
    }

    return false;                                                               //Not finished with packet
  },
  0x51: (byte, index, packet) => {
    if (index > 2 && index < 6) { //From
      packet.from.push(byte);
    } else if (index > 5 && index < 9) { //To
      packet.to.push(byte);
    } else if (index == 9) { //Flag
      packet.flag = byte;
    } else if (index == 10) { //Cmd1
      packet.cmd1 = byte;
    } else if (index == 11) { //Cmd2
      packet.cmd2 = byte;
    } else if (index > 11 && index < 25) { //Extended Data
      packet.extendedData.push(byte);

      //Complete Packet
      if (index == 24) {
        return true;
      }
    }

    return false;
  },
  0x52: (byte, index, packet) => {
    if(index === 3){
      packet.rawX10 = byte;
    }
    else{
      packet.x10Flag = byte;

      //Complete Packet
      return true;
    }

    return false;
  },
  0x53: (byte, index, packet) => {
    if(index === 3){
      packet.linkCode = byte;
    }
    else if(index === 4){
      packet.allLinkGroup = byte;
    }
    else if(index > 4 && index < 8){
      packet.from.push(byte);
    }
    else if(index === 8){
      packet.devcat = byte;
    }
    else if(index === 9){
      packet.subcat = byte;
    }
    else if(index === 10){
      packet.firmware = byte;

      //Complete Packet
      return true;
    }

    return false;
  },
  0x54: (byte, index, packet) => {
    packet.event = byte;

    return true;
  },
  0x55: (byte, index, packet) => {
    //No Parsing needed
    return true;
  },
  0x56: (byte, index, packet) => {
    if(index === 4){
      packet.allLinkGroup = byte;
    }
    else if(index > 4 && index < 8){
      packet.device.push(byte);

      if(index === 7){
        //Complete Packet
        return true;
      }
    }

    return false;
  },
  0x57: (byte, index, packet) => {
    if(index === 3){
      packet.allLinkRecordFlags = byte;
    }
    else if(index === 4){
      packet.allLinkGroup = byte;
    }
    else if(index > 4 && index < 8){
      packet.from.push(byte);
    }
    else{
      packet.linkData.push(byte);

      if(index === 10){
        //Complete Packet
        return true;
      }
    }

    return false;
  },
  0x58: (byte, index, packet) => {
    if(byte === 0x06){
      packet.status = true;
    }
    else{
      packet.status = false;
    }

    //Complete Packet
    return true;
  },
  0x60: (byte, index, packet) => {
    if(index >= 3 && index <= 5){
      packet.ID.push(byte);
    }
    else if(index === 6){
      packet.devcat = byte;
    }
    else if(index === 7){
      packet.subcat = byte;
    }
    else if(index === 8){
      packet.firmware = byte;
    }
    else{
      if(byte === 0x06){
        packet.success = true;
      }
      else{
        packet.success = false;
      }

      //Complete Packet
      return true;
    }

    return false;
  },
  0x61: (byte, index, packet) => {
    if(index === 3){
      packet.allLinkGroup = byte;
    }
    else if(index === 4){
      packet.allLinkCommand = byte;
    }
    else if(index === 5){
      packet.broadcastCommand2 = byte;
    }
    else{
      if(byte === 0x06){
        packet.success = true;
      }
      else{
        packet.success = false;
      }

      //Complete Packet
      return true;
    }

    return false;
  },
  0x62: (byte, index, packet) => {
    if (index > 2 && index < 6) { //To
      packet.to.push(byte);
    } else if (index === 6) {
      packet.flag = byte;
    } else if (index == 7) { //Cmd1
      packet.cmd1 = byte;
    } else if (index == 8) { //Cmd2
      packet.cmd2 = byte;
    } else {
      if (byte === 0x06) { //ACK
        packet.success = true;
      } else { //NAK
        packet.success = false;
      }
      //Complete Packet
      return true;
    }
    return false;
  },
  0x63: (byte, index, packet) => {
    if(index === 3){
      packet.rawX10 = byte;
    }
    else if(index === 4){
      packet.X10Flag = byte;
    }
    else{
      if(byte === 0x06){
        packet.success = true;
      }
      else{
        packet.success = false;
      }

      //Complete Packet
      return true;
    }
    return false;
  },
  0x64: (byte, index, packet) => {
    if(index === 3){
      packet.linkCode = byte;
    }
    else if(index === 4){
      packet.allLinkGroup = byte;
    }
    else{
      if(byte === 0x06){
        packet.success = true;
      }
      else{
        packet.success = false;
      }

      //Complete Packet
      return true;
    }
    return false;
  },
  0x65: (byte, index, packet) => {
    if(byte === 0x06){
      packet.success = true;
    }
    else{
      packet.success = false;
    }

    //Complete Packet
    return true;
  },
  0x66: (byte, index, packet) => {
    if(index === 3){
      packet.devcat = byte;
    }
    else if(index === 4){
      packet.subcat = byte;
    }
    else if(index === 5){
      packet.firmware = byte;
    }
    else{
      if(byte === 0x06){
        packet.success = true;
      }
      else{
        packet.success = false;
      }

      //Complete Packet
      return true;
    }

    return false;
  },
  0X67: (byte, index, packet) => {
    if(byte === 0x06){
      packet.success = true;
    }
    else{
      packet.success = false;
    }

    //Complete Packet
    return true;
  },
  0x68: (byte, index, packet) => {
    if(index === 3){
      packet.cmd2 = byte;
    }
    else{
      if(byte === 0x06){
        packet.success = true;
      }
      else{
        packet.success = false;
      }

      //Complete Packet
      return true;
    }

    return false;
  },
  0x69: (byte, index, packet) => {
    if(byte === 0x06){
      packet.success = true;
    }
    else{
      packet.success = false;
    }

    //Complete Packet
    return true;
  },
  0x6A: (byte, index, packet) => {
    if(byte === 0x06){
      packet.success = true;
    }
    else{
      packet.success = false;
    }

    //Complete Packet
    return true;
  },
  0x6B: (byte, index, packet) => {
    if(index === 3){
      packet.imConfigurationFlags = byte;
    }
    else{
      if(byte === 0x06){
        packet.success = true;
      }
      else{
        packet.success = false;
      }

      //Complete Packet
      return true;
    }

    return false;
  },
  0x6C: (byte, index, packet) => {
    if(byte === 0x06){
      packet.success = true;
    }
    else{
      packet.success = false;
    }

    //Complete Packet
    return true;
  },
  0x6D: (byte, index, packet) => {
    if(byte === 0x06){
      packet.success = true;
    }
    else{
      packet.success = false;
    }

    //Complete Packet
    return true;
  },
  0x6E: (byte, index, packet) => {
    if(byte === 0x06){
      packet.success = true;
    }
    else{
      packet.success = false;
    }

    //Complete Packet
    return true;
  },
  0X6F: (byte, index, packet) => {
    if(index === 3){
      packet.controlCode = byte;
    }
    else if(index === 4){
      packet.allLinkRecordFlags = byte;
    }
    else if(index === 5){
      packet.allLinkGroup = byte;
    }
    else if(index > 5 && index < 9){
      packet.device.push(byte);
    }
    else if(index > 8 && index < 12){
      packet.device.push(byte);
    }
    else{
      if(byte === 0x06){
        packet.success = true;
      }
      else{
        packet.success = false;
      }

      //Complete Packet
      return true;
    }
    return false;
  },
  0x70: (byte, index, packet) => {
    if(index === 3){
      packet.cmd2 = byte;
    }
    else{
      if(byte === 0x06){
        packet.success = true;
      }
      else{
        packet.success = false;
      }

      //Complete Packet
      return true;
    }
    return false;
  },
  0x71: (byte, index, packet) => {
    if(index === 3){
      packet.cmd1 = byte;
    }
    else if(index === 4){
      packet.cmd2 = byte;
    }
    else{
      if(byte === 0x06){
        packet.success = true;
      }
      else{
        packet.success = false;
      }

      //Complete Packet
      return true;
    }

    return false;
  },
  0x72: (byte, index, packet) => {
    if(index === 3){
      packet.cmd1 = byte;
    }
    else if(index === 4){
      packet.cmd2 = byte;
    }
    else{
      if(byte === 0x06){
        packet.success = true;
      }
      else{
        packet.success = false;
      }

      //Complete Packet
      return true;
    }

    return false;
  },
  0x73: (byte, index, packet) => {
    if(index === 3){
      packet.imConfigurationFlags = byte;
    }
    else{
      if(byte === 0x06){
        packet.success = true;
      }
      else{
        packet.success = false;
      }

      //Complete Packet
      return true;
    }

    return false;
  },
};
