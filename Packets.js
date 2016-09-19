'use strict;'                                                                   //Switch to errors only

module.exports = {
  0x50: function packet(emitter){
    self = this;

    self.emitter = emitter;
    self.bytesNeeded = function(){return self.packetLength - self.index};
    self.packetLength = 11;
    self.index = 2;
    self.completed = false;

    /* Packet Data */
    self.type = 'Standard Message Received';
    self.from = [];
    self.to = [];
    self.flags = null;
    self.cmd1 = null;
    self.cmd2 = null;
    self.ack = null;

    self.parse = function(byte){
      self.index++;

      if (self.index > 2 && self.index <= 5) {
        self.from.push(byte);
      } else if (self.index >= 6 && self.index <= 8) {
        self.to.push(byte);
      } else if (self.index == 9) {
        self.flags = byte;
      } else if (self.index == 10) {
        self.cmd1 = byte;
      } else if (self.index == 11) {
        self.cmd2 = byte;
      } else if(self.index == 12){
        self.ack = byte;
      }

      if(self.bytesNeeded() === 0){ self.complete(); }
    };

    self.complete = function(){
      self.completed = true;

      let packet = {
        type:  self.type,
        from:  self.from,
        to:    self.to,
        flags: self.flags,
        cmd1:  self.cmd1,
        cmd2:  self.cmd2,
      };

      //Sending completed packet back
      self.emitter.emit('packet', packet);
    };
  },
  0x51: function packet(emitter){
    self = this;

    self.emitter = emitter;
    self.bytesNeeded = function(){return self.packetLength - self.index};
    self.packetLength = 25;
    self.index = 2;
    self.completed = false;

    /* Packet Data */
    self.type = 'Extended Message Received';
    self.from = [];
    self.to = [];
    self.flags = null;
    self.cmd1 = null;
    self.cmd2 = null;
    self.extendedData = [];

    self.parse = function(byte){
      self.index++;

      if (index > 2 && self.index < 6) { //From
        self.from.push(byte);
      } else if (self.index > 5 && self.index < 9) { //To
        self.to.push(byte);
      } else if (self.index == 9) { //Flag
        self.flag = byte;
      } else if (self.index == 10) { //Cmd1
        self.cmd1 = byte;
      } else if (self.index == 11) { //Cmd2
        self.cmd2 = byte;
      } else if (self.index >= 12 && self.index <= 24) { //Extended Data
        self.extendedData.push(byte);
      }

      if(self.bytesNeeded() === 0){ self.complete(); }
    };

    self.complete = function(){
      self.completed = true;

      let packet = {
        type:  self.type,
        from:  self.from,
        to:    self.to,
        flags: self.flags,
        cmd1:  self.cmd1,
        cmd2:  self.cmd2,
        extendedData: self.extendedData
      };

      //Sending completed packet back
      self.emitter.emit('packet', packet);
    };
  },
  0x52: function packet(emitter){
    self = this;

    self.emitter = emitter;
    self.bytesNeeded = function(){return self.packetLength - self.index};
    self.packetLength = 4;
    self.index = 2;
    self.completed = false;

    /* Packet Data */
    self.type = 'X10 Received';
    self.rawX10 = null;
    self.X10Flag = null;

    self.parse = function(byte){
      self.index++;

      if(self.index === 3){
        self.rawX10 = byte;
      }
      else if(self.index === 4){
        self.x10Flag = byte;
      }

      if(self.bytesNeeded() === 0){ self.complete(); }
    };

    self.complete = function(){
      self.completed = true;

      let packet = {
        type:  self.type,
        rawX10: self.rawX10,
        X10Flag:  self.X10Flag,
      };

      //Sending completed packet back
      self.emitter.emit('packet', packet);
    };

  },
  0x53: function packet(emitter){
    self = this;

    self.emitter = emitter;
    self.bytesNeeded = function(){return self.packetLength - self.index};
    self.index = 2;
    self.packetLength = 10;
    self.completed = false;

    /* Packet Data */
    self.type = 'ALL-Linking Completed';
    self.linkCode = null;
    self.allLinkGroup = null;
    self.from = [];
    self.devcat = null;
    self.subcat = null;
    self.firmware = null;

    self.parse = function(byte){
      self.index++;

      if(self.index === 3){
        self.linkCode = byte;
      }
      else if(self.index === 4){
        self.allLinkGroup = byte;
      }
      else if(self.index >= 5 && self.index <= 7){
        self.from.push(byte);
      }
      else if(self.index === 8){
        self.devcat = byte;
      }
      else if(self.index === 9){
        self.subcat = byte;
      }
      else if(self.index === 10){
        self.firmware = byte;
      }

      if(self.bytesNeeded() === 0){ self.complete(); }
    };

    self.complete = function(){
      self.completed = true;

      let packet = {
        type: self.type,
        linkCode:  self.linkCode,
        allLinkGroup: self.allLinkGroup,
        from:  self.from,
        devcat: self.devcat,
        subcat: self.subcat,
        firmware: self.firmware
      };

      //Sending completed packet back
      self.emitter.emit('packet', packet);
    };
  },
  0x54: function packet(emitter){
    self = this;

    self.emitter = emitter;
    self.bytesNeeded = function(){return self.packetLength - self.index};
    self.index = 2;
    self.packetLength = 3;
    self.completed = false;

    /* Packet Data */
    self.type = 'Button Event Report';
    self.event = null;

    self.parse = function(byte){
      self.index++;

      packet.event = byte;

      self.complete();
    };

    self.complete = function(){
      self.completed = true;

      let packet = {
        type: self.type,
        type: self.event,
      };

      //Sending completed packet back
      self.emitter.emit('packet', packet);
    };


  },
  0x55: function packet(emitter){
    self = this;

    self.emitter = emitter;
    self.bytesNeeded = function(){return self.packetLength - self.index};
    self.index = 2;
    self.packetLength = 2;
    self.completed = false;

    /* Packet Data */
    self.type = 'User Reset Detected';

    self.complete = function(){
      self.completed = true;

      let packet = {
        type: self.type,
      };

      //Sending completed packet back
      self.emitter.emit('packet', packet);
    };

    self.complete();
  },
  0x56: function packet(emitter){
    self = this;

    self.emitter = emitter;
    self.bytesNeeded = function(){return self.packetLength - self.index};
    self.index = 2;
    self.packetLength = 7;
    self.completed = false;

    /* Packet Data */
    self.type = 'ALL-Link Cleanup Failure Report';
    self.allLinkGroup = null;
    self.device = [];

    self.parse = function(byte){
      self.index++;

      if(self.index === 4){
        self.allLinkGroup = byte;
      }
      else if(self.index >= 5 && self.index <= 7){
        self.device.push(byte);
      }

      if(self.bytesNeeded() === 0){ self.complete(); }
    };

    self.complete = function(){
      self.completed = true;

      let packet = {
        type: self.type,
        allLinkGroup:  self.allLinkGroup,
        device:  self.device,
      };

      //Sending completed packet back
      self.emitter.emit('packet', packet);
    };

  },
  0x57: function packet(emitter){
    self = this;

    self.emitter = emitter;
    self.bytesNeeded = function(){return self.packetLength - self.index};
    self.index = 2;
    self.packetLength = 10;
    self.completed = false;

    /* Packet Data */
    self.type = 'ALL-Link Record Response';
    self.allLinkRecordFlags = null;
    self.allLinkGroup = null;
    self.from = [];
    self.linkData = [];

    self.parse = function(byte){
      self.index++;

      if(self.index === 3){
        self.allLinkRecordFlags = byte;
      }
      else if(self.index === 4){
        self.allLinkGroup = byte;
      }
      else if(self.index >= 5 && self.index <= 7){
        self.from.push(byte);
      }
      else if(self.index >= 8 && self.index <= 10){
        self.linkData.push(byte);
      }

      if(self.bytesNeeded() === 0){ self.complete(); }
    };

    self.complete = function(){
      self.completed = true;

      let packet = {
        type: self.type,
        allLinkRecordFlags:  self.allLinkGroup,
        allLinkGroup:  self.allLinkGroup,
        from:  self.from,
        linkData:  self.linkData,
      };

      //Sending completed packet back
      self.emitter.emit('packet', packet);
    };
  },
  0x58: function packet(emitter){
    self = this;

    self.emitter = emitter;
    self.bytesNeeded = function(){return self.packetLength - self.index};
    self.index = 2;
    self.packetLength = 3;
    self.completed = false;

    /* Packet Data */
    self.type = 'ALL-Link Cleanup Status Report';
    self.status = null;

    self.parse = function(byte){
      self.index++;

      if(byte === 0x06){
        self.status = true;
      }
      else{
        self.status = false;
      }

      if(self.bytesNeeded() === 0){ self.complete(); }
    };

    self.complete = function(){
      self.completed = true;

      let packet = {
        type: self.type,
        status:  self.status,
      };

      //Sending completed packet back
      self.emitter.emit('packet', packet);
    };
  },
  0x60: function packet(emitter){
    self = this;

    self.emitter = emitter;
    self.bytesNeeded = function(){return self.packetLength - self.index};
    self.index = 2;
    self.packetLength = 9;
    self.completed = false;

    /* Packet Data */
    self.type = 'Get IM Info';
    self.ID = [],
    self.devcat = null;
    self.subcat = null;
    self.firmware = null;
    self.success = null;

    self.parse = function(byte){
      self.index++;

      if(self.index >= 3 && self.index <= 5){
        self.ID.push(byte);
      }
      else if(self.index === 6){
        self.devcat = byte;
      }
      else if(self.index === 7){
        self.subcat = byte;
      }
      else if(self.index === 8){
        self.firmware = byte;
      }
      else{
        if(byte === 0x06){
          self.success = true;
        }
        else{
          self.success = false;
        }
      }

      if(self.bytesNeeded() === 0){ self.complete(); }
    };

    self.complete = function(){
      self.completed = true;

      let packet = {
        type: self.type,
        ID:  self.ID,
        devcat:  self.devcat,
        subcat:  self.subcat,
        firmware:  self.firmware,
        success:  self.success,
      };

      //Sending completed packet back
      self.emitter.emit('packet', packet);
    };
  },
  0x61: function packet(emitter){
    self = this;

    self.emitter = emitter;
    self.bytesNeeded = function(){return self.packetLength - self.index};
    self.index = 2;
    self.packetLength = 6;
    self.completed = false;

    /* Packet Data */
    self.type = 'Send ALL-Link Command';
    self.allLinkGroup = null;
    self.allLinkCommand = null;
    self.broadcastCommand2 = null;
    self.success = null;

    self.parse = function(byte){
      self.index++;

      if(self.index === 3){
        self.allLinkGroup = byte;
      }
      else if(self.index === 4){
        self.allLinkCommand = byte;
      }
      else if(self.index === 5){
        self.broadcastCommand2 = byte;
      }
      else{
        if(byte === 0x06){
          self.success = true;
        }
        else{
          self.success = false;
        }
      }

      if(self.bytesNeeded() === 0){ self.complete(); }
    };

    self.complete = function(){
      self.completed = true;

      let packet = {
        type: self.type,
        allLinkGroup:  self.allLinkGroup,
        allLinkCommand:  self.allLinkCommand,
        broadcastCommand2:  self.broadcastCommand2,
        success:  self.success,
      };

      //Sending completed packet back
      self.emitter.emit('packet', packet);
    };
  },
  0x62: function packet(emitter){
    self = this;

    self.emitter = emitter;
    self.bytesNeeded = function(){return self.packetLength - self.index};
    self.index = 2;
    self.packetLength = 23;
    self.completed = false;

    /* Packet Data */
    self.type = 'Send INSTEON Message';
    self.to = [];
    self.flags = null,
    self.cmd1 = null;
    self.cmd2 = null;
    self.success = null;

    self.parse = function(byte){
      self.index++;

      if (self.index >= 3 && self.index <= 5) { //To
        self.to.push(byte);
      } else if (self.index === 6) {
        self.flag = byte;
      } else if (self.index === 7) { //Cmd1
        self.cmd1 = byte;
      } else if (self.index === 8) { //Cmd2
        self.cmd2 = byte;
      } else {
        if (byte === 0x06) { //ACK
          self.success = true;
        } else { //NAK
          self.success = false;
        }
      }

      if(self.bytesNeeded() === 0){ self.complete(); }
    };

    self.complete = function(){
      self.completed = true;

      let packet = {
        type: self.type,
        to:  self.to,
        flags:  self.flags,
        cmd1:  self.cmd1,
        cmd2:  self.cmd2,
        success:  self.success,
      };

      //Sending completed packet back
      self.emitter.emit('packet', packet);
    };
  },
  0x63: function packet(emitter){
    self = this;

    self.emitter = emitter;
    self.bytesNeeded = function(){return self.packetLength - self.index};
    self.index = 2;
    self.packetLength = 5;
    self.completed = false;

    /* Packet Data */
    self.type = 'Send X10';
    self.rawX10 = null;
    self.X10Flag = null;
    self.success = null;

    self.parse = function(byte){
      self.index++;

      if(self.index === 3){
        self.rawX10 = byte;
      }
      else if(self.index === 4){
        self.X10Flag = byte;
      }
      else{
        if(byte === 0x06){
          self.success = true;
        }
        else{
          self.success = false;
        }
      }

      if(self.bytesNeeded() === 0){ self.complete(); }
    };

    self.complete = function(){
      self.completed = true;

      let packet = {
        type: self.type,
        rawX10:  self.rawX10,
        X10Flag:  self.X10Flag,
        success:  self.success,
      };

      //Sending completed packet back
      self.emitter.emit('packet', packet);
    };
  },
  0x64: function packet(emitter){
    self = this;

    self.emitter = emitter;
    self.bytesNeeded = function(){return self.packetLength - self.index};
    self.index = 2;
    self.packetLength = 5;
    self.completed = false;

    /* Packet Data */
    self.type = 'Start ALL-Linking';
    self.linkCode = null;
    self.allLinkGroup = null;
    self.success = null;

    self.parse = function(byte){
      self.index++;

      if(self.index === 3){
        self.linkCode = byte;
      }
      else if(self.index === 4){
        self.allLinkGroup = byte;
      }
      else{
        if(byte === 0x06){
          self.success = true;
        }
        else{
          self.success = false;
        }
      }

      if(self.bytesNeeded() === 0){ self.complete(); }
    };


    self.complete = function(){
      self.completed = true;

      let packet = {
        type: self.type,
        linkCode:  self.linkCode,
        allLinkGroup:  self.allLinkGroup,
        success:  self.success,
      };

      //Sending completed packet back
      self.emitter.emit('packet', packet);
    };
  },
  0x65: function packet(emitter){
    self = this;

    self.emitter = emitter;
    self.bytesNeeded = function(){return self.packetLength - self.index};
    self.index = 2;
    self.packetLength = 3;
    self.completed = false;

    /* Packet Data */
    self.type = 'Cancel ALL-Linking';
    self.success = null;

    self.parse = function(byte){
      self.index++;

      if(byte === 0x06){
        self.success = true;
      }
      else{
        self.success = false;
      }

      if(self.bytesNeeded() === 0){ self.complete(); }
    };

    self.complete = function(){
      self.completed = true;

      let packet = {
        type: self.type,
        success:  self.success,
      };

      //Sending completed packet back
      self.emitter.emit('packet', packet);
    };
  },
  0x66: function packet(emitter){
    self = this;

    self.emitter = emitter;
    self.bytesNeeded = function(){return self.packetLength - self.index};
    self.index = 2;
    self.packetLength = 6;
    self.completed = false;

    /* Packet Data */
    self.type = 'Set Host Device Category';
    self.devcat = null;
    self.subcat = null;
    self.firmware = null;
    self.success = null;

    self.parse = function(byte){
      self.index++;

      if(self.index === 3){
        self.devcat = byte;
      }
      else if(self.index === 4){
        self.subcat = byte;
      }
      else if(self.index === 5){
        self.firmware = byte;
      }
      else{
        if(byte === 0x06){
          self.success = true;
        }
        else{
          self.success = false;
        }
      }

      if(self.bytesNeeded() === 0){ self.complete(); }
    };

    self.complete = function(){
      self.completed = true;

      let packet = {
        type: self.type,
        devcat:  self.devcat,
        subcat:  self.subcat,
        firmware:  self.firmware,
        success:  self.success,
      };

      //Sending completed packet back
      self.emitter.emit('packet', packet);
    };
  },
  0x67: function packet(emitter){
    self = this;

    self.emitter = emitter;
    self.bytesNeeded = function(){return self.packetLength - self.index};
    self.index = 2;
    self.packetLength = 3;
    self.completed = false;

    /* Packet Data */
    self.type = 'Reset the IM';
    self.success = null;

    self.parse = function(byte){
      self.index++;

      if(byte === 0x06){
        self.success = true;
      }
      else{
        self.success = false;
      }

      if(self.bytesNeeded() === 0){ self.complete(); }
    };

    self.complete = function(){
      self.completed = true;

      let packet = {
        type: self.type,
        success:  self.success,
      };

      //Sending completed packet back
      self.emitter.emit('packet', packet);
    };
  },
  0x68: function packet(emitter){
    self = this;

    self.emitter = emitter;
    self.bytesNeeded = function(){return self.packetLength - self.index};
    self.index = 2;
    self.packetLength = 4;
    self.completed = false;

    /* Packet Data */
    self.type = 'Set ACK Message Byte';
    self.cmd2 = null;
    self.success = null;

    self.parse = function(byte){
      self.index++;

      if(self.index === 3){
        self.cmd2 = byte;
      }
      else{
        if(byte === 0x06){
          self.success = true;
        }
        else{
          self.success = false;
        }
      }

      if(self.bytesNeeded() === 0){ self.complete(); }
    };

    self.complete = function(){
      self.completed = true;

      let packet = {
        type: self.type,
        cmd2:  self.cmd2,
        success:  self.success,
      };

      //Sending completed packet back
      self.emitter.emit('packet', packet);
    };
  },
  0x69: function packet(emitter){
    self = this;

    self.emitter = emitter;
    self.bytesNeeded = function(){return self.packetLength - self.index};
    self.index = 2;
    self.packetLength = 3;
    self.completed = false;

    /* Packet Data */
    self.type = 'Get First ALL-Link Record';
    self.success = null;

    self.parse = function(byte){
      self.index++;

      if(byte === 0x06){
        self.success = true;
      }
      else{
        self.success = false;
      }

      if(self.bytesNeeded() === 0){ self.complete(); }
    };

    self.complete = function(){
      self.completed = true;

      let packet = {
        type: self.type,
        success:  self.success,
      };

      //Sending completed packet back
      self.emitter.emit('packet', packet);
    };
  },
  0x6A: function packet(emitter){
    self = this;

    self.emitter = emitter;
    self.bytesNeeded = function(){return self.packetLength - self.index};
    self.index = 2;
    self.packetLength = 3;
    self.completed = false;

    /* Packet Data */
    self.type = 'Get Next ALL-Link Record';
    self.success = null;

    self.parse = function(byte){
      self.index++;

      if(byte === 0x06){
        self.success = true;
      }
      else{
        self.success = false;
      }

      if(self.bytesNeeded() === 0){ self.complete(); }
    };

    self.complete = function(){
      self.completed = true;

      let packet = {
        type: self.type,
        success:  self.success,
      };

      //Sending completed packet back
      self.emitter.emit('packet', packet);
    };
  },
  0x6B: function packet(emitter){
    self = this;

    self.emitter = emitter;
    self.bytesNeeded = function(){return self.packetLength - self.index};
    self.index = 2;
    self.packetLength = 4;
    self.completed = false;

    /* Packet Data */
    self.type = 'Set IM Configuration';
    self.imConfigurationFlags = null;
    self.success = null;

    self.parse = function(byte){
      self.index++;

      if(self.index === 3){
        self.imConfigurationFlags = byte;
      }
      else{
        if(byte === 0x06){
          self.success = true;
        }
        else{
          self.success = false;
        }
      }

      if(self.bytesNeeded() === 0){ self.complete(); }
    };

    self.complete = function(){
      self.completed = true;

      let packet = {
        type: self.type,
        imConfigurationFlags:  self.imConfigurationFlags,
        success:  self.success,
      };

      //Sending completed packet back
      self.emitter.emit('packet', packet);
    };
  },
  0x6C: function packet(emitter){
    self = this;

    self.emitter = emitter;
    self.bytesNeeded = function(){return self.packetLength - self.index};
    self.index = 2;
    self.packetLength = 3;
    self.completed = false;

    /* Packet Data */
    self.type = 'Get ALL-Link Record for Sender';
    self.success = null;

    self.parse = function(byte){
      self.index++;

      if(byte === 0x06){
        self.success = true;
      }
      else{
        self.success = false;
      }

      if(self.bytesNeeded() === 0){ self.complete(); }
    };

    self.complete = function(){
      self.completed = true;

      let packet = {
        type: self.type,
        success:  self.success,
      };

      //Sending completed packet back
      self.emitter.emit('packet', packet);
    };
  },
  0x6D: function packet(emitter){
    self = this;

    self.emitter = emitter;
    self.bytesNeeded = function(){return self.packetLength - self.index};
    self.index = 2;
    self.packetLength = 3;
    self.completed = false;

    /* Packet Data */
    self.type = 'LED On';
    self.success = null;

    self.parse = function(byte){
      self.index++;

      if(byte === 0x06){
        self.success = true;
      }
      else{
        self.success = false;
      }

      if(self.bytesNeeded() === 0){ self.complete(); }
    };

    self.complete = function(){
      self.completed = true;

      let packet = {
        type: self.type,
        success:  self.success,
      };

      //Sending completed packet back
      self.emitter.emit('packet', packet);
    };
  },
  0x6E: function packet(emitter){
    self = this;

    self.emitter = emitter;
    self.bytesNeeded = function(){return self.packetLength - self.index};
    self.index = 2;
    self.packetLength = 3;
    self.completed = false;

    /* Packet Data */
    self.type = 'LED Off';
    self.success = null;

    self.parse = function(byte){
      self.index++;

      if(byte === 0x06){
        self.success = true;
      }
      else{
        self.success = false;
      }

      if(self.bytesNeeded() === 0){ self.complete(); }
    };

    self.complete = function(){
      self.completed = true;

      let packet = {
        type: self.type,
        success:  self.success,
      };

      //Sending completed packet back
      self.emitter.emit('packet', packet);
    };

  },
  0x6F: function packet(emitter){
    self = this;

    self.emitter = emitter;
    self.bytesNeeded = function(){return self.packetLength - self.index};
    self.index = 2;
    self.packetLength = 12;
    self.completed = false;

    /* Packet Data */
    self.type = 'Manage ALL-Link Record';
    self.controlCode = null;
    self.allLinkRecordFlags = null;
    self.allLinkGroup = null;
    self.device = [];
    self.linkData = [];
    self.success = null;

    self.parse = function(byte){
      self.index++;

      if(self.index === 3){
        self.controlCode = byte;
      }
      else if(self.index === 4){
        self.allLinkRecordFlags = byte;
      }
      else if(self.index === 5){
        self.allLinkGroup = byte;
      }
      else if(self.index > 5 && self.index < 9){
        self.device.push(byte);
      }
      else if(self.index > 8 && self.index < 12){
        self.device.push(byte);
      }
      else{
        if(byte === 0x06){
          self.success = true;
        }
        else{
          self.success = false;
        }
      }

      if(self.bytesNeeded() === 0){ self.complete(); }
    };

    self.complete = function(){
      self.completed = true;

      let packet = {
        type: self.type,
        controlCode:  self.controlCode,
        allLinkRecordFlags:  self.allLinkRecordFlags,
        allLinkGroup:  self.allLinkGroup,
        device:  self.device,
        linkData:  self.linkData,
        success:  self.success,
      };

      //Sending completed packet back
      self.emitter.emit('packet', packet);
    };
  },
  0x70: function packet(emitter){
    self = this;

    self.emitter = emitter;
    self.bytesNeeded = function(){return self.packetLength - self.index};
    self.index = 2;
    self.packetLength = 4;
    self.completed = false;

    /* Packet Data */
    self.type = 'Set NAK Message Byte';
    self.cmd2 = null;
    self.success = null;

    self.parse = function(byte){
      self.index++;

      if(self.index === 3){
        self.cmd2 = byte;
      }
      else{
        if(byte === 0x06){
          self.success = true;
        }
        else{
          self.success = false;
        }
      }

      if(self.bytesNeeded() === 0){ self.complete(); }
    };

    self.complete = function(){
      self.completed = true;

      let packet = {
        type: self.type,
        cmd2:  self.cmd2,
        success:  self.success,
      };

      //Sending completed packet back
      self.emitter.emit('packet', packet);
    };
  },
  0x71: function packet(emitter){
    self = this;

    self.emitter = emitter;
    self.bytesNeeded = function(){return self.packetLength - self.index};
    self.index = 2;
    self.packetLength = 5;
    self.completed = false;

    /* Packet Data */
    self.type = 'Set ACK Message Two Bytes';
    self.cmd1 = null;
    self.cmd2 = null;
    self.success = null;

    self.parse = function(byte){
      self.index++;

      if(self.index === 3){
        self.cmd1 = byte;
      }
      else if(self.index === 4){
        self.cmd2 = byte;
      }
      else{
        if(byte === 0x06){
          self.success = true;
        }
        else{
          self.success = false;
        }
      }

      if(self.bytesNeeded() === 0){ self.complete(); }
    };

    self.complete = function(){
      self.completed = true;

      let packet = {
        type: self.type,
        cmd1:  self.cmd1,
        cmd2:  self.cmd2,
        success:  self.success,
      };

      //Sending completed packet back
      self.emitter.emit('packet', packet);
    };
  },
  0x72: function packet(emitter){
    self = this;

    self.emitter = emitter;
    self.bytesNeeded = function(){return self.packetLength - self.index};
    self.index = 2;
    self.packetLength = 3;
    self.completed = false;

    /* Packet Data */
    self.type = 'RF Sleep';
    self.cmd1 = null;
    self.cmd2 = null;
    self.success = null;

    self.parse = function(byte){
      self.index++;

      if(self.index === 3){
        self.cmd1 = byte;
      }
      else if(self.index === 4){
        self.cmd2 = byte;
      }
      else{
        if(byte === 0x06){
          self.success = true;
        }
        else{
          self.success = false;
        }
      }

      if(self.bytesNeeded() === 0){ self.complete(); }
    };

    self.complete = function(){
      self.completed = true;

      let packet = {
        type: self.type,
        cmd1:  self.cmd1,
        cmd2:  self.cmd2,
        success:  self.success,
      };

      //Sending completed packet back
      self.emitter.emit('packet', packet);
    };
  },
  0x73: function packet(emitter){
    self = this;

    self.emitter = emitter;
    self.bytesNeeded = function(){return self.packetLength - self.index};
    self.index = 2;
    self.packetLength = 6;
    self.completed = false;

    /* Packet Data */
    self.type = 'Get IM Configuration';
    self.imConfigurationFlags = null;
    self.success = null;

    self.parse = function(byte){
      self.index++;

      if(self.index === 3){
        self.imConfigurationFlags = byte;
      }
      else{
        if(byte === 0x06){
          self.success = true;
        }
        else{
          self.success = false;
        }
      }

      if(self.bytesNeeded() === 0){ self.complete(); }
    };

    self.complete = function(){
      self.completed = true;

      let packet = {
        type: self.type,
        imConfigurationFlags:  self.imConfigurationFlags,
        success:  self.success,
      };

      //Sending completed packet back
      self.emitter.emit('packet', packet);
    };
  },
};
