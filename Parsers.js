'use strict';                                                                   //Switch to errors only

module.exports = {
  //Packet Type parsers
  0x50: (byte, index, packet, complete) => {
    if (index > 2 && packet < 6) { //From
      packet.from.push(byte);
    } else if (index > 5 && index < 9) { //To
      packet.to.push(byte);
    } else if (index == 9) { //Flag
      packet.flag = byte;
    } else if (index == 10) { //Cmd1
      packet.cmd1 = byte;
    } else if (index == 11) { //Cmd2
      packet.cmd2 = byte;

      //Packet Complete
      complete();
    }
  },
  0x51: (byte, index, packet, complete) => {
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
        complete();
      }
    }
  },
  0x52: (byte, index, packet, complete) => {},
  0x53: (byte, index, packet, complete) => {},
  0x54: (byte, index, packet, complete) => {},
  0x55: (byte, index, packet, complete) => {},
  0x56: (byte, index, packet, complete) => {},
  0x57: (byte, index, packet, complete) => {},
  0x58: (byte, index, packet, complete) => {},
  0x60: (byte, index, packet, complete) => {},
  0x61: (byte, index, packet, complete) => {},
  0x62: (byte, index, packet, complete) => {
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
      complete();
    }
  },
  0x63: (byte, index, packet, complete) => {},
  0x64: (byte, index, packet, complete) => {},
  0x65: (byte, index, packet, complete) => {},
  0x66: (byte, index, packet, complete) => {},
  0X67: (byte, index, packet, complete) => {},
  0x68: (byte, index, packet, complete) => {},
  0x69: (byte, index, packet, complete) => {},
  0x6A: (byte, index, packet, complete) => {},
  0x6B: (byte, index, packet, complete) => {},
  0x6C: (byte, index, packet, complete) => {},
  0x6D: (byte, index, packet, complete) => {},
  0x6E: (byte, index, packet, complete) => {},
  0X6F: (byte, index, packet, complete) => {},
  0x70: (byte, index, packet, complete) => {},
  0x71: (byte, index, packet, complete) => {},
  0x72: (byte, index, packet, complete) => {},
  0x73: (byte, index, packet, complete) => {},
};
