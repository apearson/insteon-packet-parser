/* Packet abstract base class */
class Packet{
  constructor(length, index, completed){
    /* Abstract class check */
    if(new.target === Packet){
      throw new TypeError('Cannot construct Packet instances directly');
    }

    /* Packet metadata */
    this.packetLength = length;
    this.index = index;
    this.completed = completed;

    /* Packet Data */
    this.packet = {
      id: 0x00,
      type: 'Abstract Packet',
    };
  }
  bytesNeeded(){
    return this.packetLength - this.index;
  }
}

/* Packet Parsing Classes */
module.exports = {
  0x50: class extends Packet{
    constructor(){
      /* Constructing super class */
      super(11, 2, false);

      /* Packet Data */
      this.packet = {
        id: 0x50,
        type: 'Standard Message Received',
        from: [],
        to: [],
        flags: null,
        maxHops: null,
        hopsLeft: null,
        extended: false,
        meaning: null,
        cmd1: null,
        cmd2: null,
      };
    }
    parse(byte){
      /* Moving to next index */
      this.index++;

      /* Determining where to place byte */
      if(this.index >= 3 && this.index <= 5){
        this.packet.from.push(byte);
      }
      else if(this.index >= 6 && this.index <= 8){
        this.packet.to.push(byte);
      }
      else if(this.index === 9){
        this.packet.flags = byte;

        /* Reading Flags */
        this.packet.maxHops = (byte & 3);
        this.packet.hopsLeft = ((byte & 12) >> 2);
        this.packet.extended = !!(byte & 16);
        this.packet.meaning = ((byte & 224) >> 5);

        /* Intrupting Meaning Flag */
        switch(this.packet.meaning){
          case 0:
            this.packet.meaning = 'Direct Message'; break;
          case 1:
            this.packet.meaning = 'ACK of Direct Message'; break;
          case 2:
            this.packet.meaning = 'Group Cleanup Direct Message'; break;
          case 3:
            this.packet.meaning = 'ACK of Group Cleanup Direct Message'; break;
          case 4:
            this.packet.meaning = 'Broadcast Message'; break;
          case 5:
            this.packet.meaning = 'NAK of Direct Message'; break;
          case 6:
            this.packet.meaning = 'Group Broadcast Message'; break;
          case 7:
            this.packet.meaning = 'NAK of Group Cleanup Direct Message'; break;
        }
      }
      else if (this.index == 10){
        this.packet.cmd1 = byte;
      } 
      else if(this.index == 11){
        this.packet.cmd2 = byte;
      }

      /* Check no more data is need, call completed */
      if(this.bytesNeeded() === 0){
        this.completed = true; 
      }
    }
  },
  0x51:class extends Packet{
    constructor(){
      /* Constructing super class */
      super(25, 2, false);

      /* Packet Data */
      this.packet = {
        id: 0x51,
        type: 'Extended Message Received',
        from: [],
        to: [],
        flags: null,
        maxHops: null,
        hopsLeft: null,
        extended: false,
        meaning: null,
        cmd1: null,
        cmd2: null,
        extendedData: [],
      };
    }
    parse(byte){
      /* Moving to next index */
      this.index++;
      
      /* Determining where to place byte */
      if(this.index >= 3 && this.index <= 5){
        this.packet.from.push(byte);
      }
      else if(this.index >= 6 && this.index <= 8){
        this.packet.to.push(byte);
      }
      else if(this.index === 9){
        this.packet.flags = byte;

        /* Reading Flags */
        this.packet.maxHops = (byte & 3);
        this.packet.hopsLeft = ((byte & 12) >> 2);
        this.packet.extended = !!(byte & 16);
        this.packet.meaning = ((byte & 224) >> 5);

        /* Intrupting Meaning Flag */
        switch(this.packet.meaning){
          case 0:
            this.packet.meaning = 'Direct Message'; break;
          case 1:
            this.packet.meaning = 'ACK of Direct Message'; break;
          case 2:
            this.packet.meaning = 'Group Cleanup Direct Message'; break;
          case 3:
            this.packet.meaning = 'ACK of Group Cleanup Direct Message'; break;
          case 4:
            this.packet.meaning = 'Broadcast Message'; break;
          case 5:
            this.packet.meaning = 'NAK of Direct Message'; break;
          case 6:
            this.packet.meaning = 'Group Broadcast Message'; break;
          case 7:
            this.packet.meaning = 'NAK of Group Cleanup Direct Message'; break;
        }
      }
      else if (this.index == 10){
        this.packet.cmd1 = byte;
      } 
      else if(this.index == 11){
        this.packet.cmd2 = byte;
      }
      else if(this.index >= 12 && this.index <= 25){
        this.packet.extendedData.push(byte);
      }

      /* Check no more data is need, call completed */
      if(this.bytesNeeded() === 0){
        this.completed = true; 
      }
    }
  },
  0x52:class extends Packet{
    constructor(){
      /* Constructing super class */
      super(4, 2, false);

      /* Packet Data */
      this.packet = {
        id: 0x52,
        type: 'X10 Received',
        rawX10: null,
        X10Flag: null
      };
    }
    parse(byte){
      /* Moving to next index */
      this.index++;

      /* Determining where to place byte */
      if(this.index === 3){
        this.packet.rawX10 = byte;
      }
      else if(this.index === 4){
        this.packet.x10Flag = byte;
      }

      /* Check no more data is need, call completed */
      if(this.bytesNeeded() === 0){
        this.completed = true; 
      }
    }
  },
  0x53:class extends Packet{
    constructor(){
      /* Constructing super class */
      super(10, 2, false);

      /* Packet Data */
      this.packet = {
        id: 0x53,
        type: 'ALL-Linking Completed',
        linkCode:  null,
        allLinkGroup: null,
        from:  [],
        devcat: null,
        subcat: null,
        firmware: null
      };
    }
    parse(byte){
      /* Moving to next index */
      this.index++;

      /* Determining where to place byte */
      if(this.index === 3){
        this.packet.linkCode = byte;
      }
      else if(this.index === 4){
        this.packet.allLinkGroup = byte;
      }
      else if(this.index >= 5 && this.index <= 7){
        this.packet.from.push(byte);
      }
      else if(this.index === 8){
        this.packet.devcat = byte;
      }
      else if(this.index === 9){
        this.packet.subcat = byte;
      }
      else if(this.index === 10){
        this.packet.firmware = byte;
      }

      /* Check no more data is need, call completed */
      if(this.bytesNeeded() === 0){
        this.completed = true; 
      }
    }
  },
  0x54:class extends Packet{
    constructor(){
      /* Constructing super class */
      super(3, 2, false);

      /* Packet Data */
      this.packet = {
        id: 0x54,
        type: 'Button Event Report',
        event: null
      };
    }
    parse(byte){
      /* Moving to next index */
      this.index++;

      /* Determining where to place byte */
      this.packet.event = byte;

      /* Check no more data is need, call completed */
      if(this.bytesNeeded() === 0){
        this.completed = true; 
      }
    }
  },
  0x55:class extends Packet{
    constructor(){
      /* Constructing super class */
      super(2, 2, true);

      /* Packet Data */
      this.packet = {
        id: 0x55,
        type: 'User Reset Detected',
      };
    }
    parse(byte){
      return byte;
    }
  },
  0x56:class extends Packet{
    constructor(){
      /* Constructing super class */
      super(7, 2, false);

      /* Packet Data */
      this.packet = {
        id: 0x56,
        type: 'ALL-Link Cleanup Failure Report',
        allLinkGroup: null,
        device: []
      };
    }
    parse(byte){
      /* Moving to next index */
      this.index++;

      /* Determining where to place byte */
      if(this.index === 4){
        this.packet.allLinkGroup = byte;
      }
      else if(this.index >= 5 && this.index <= 7){
        this.packet.device.push(byte);
      }

      /* Check no more data is need, call completed */
      if(this.bytesNeeded() === 0){
        this.completed = true; 
      }
    }
  },
  0x57:class extends Packet{
    constructor(){
      /* Constructing super class */
      super(10, 2, false);

      /* Packet Data */
      this.packet = {
        id: 0x57,
        type: 'ALL-Link Record Response',
        recordType: null,
        allLinkGroup: null,
        from:  [],
        linkData:  []
      };
    }
    parse(byte){
      /* Moving to next index */
      this.index++;
      
      /* Determining where to place byte */
      if(this.index === 3){
        if((byte & 64) != 0){ 
          this.packet.recordType = 'Controller'; 
        }
        else {
          this.packet.recordType = 'Responder'; 
        }
      }
      else if(this.index === 4){
        this.packet.allLinkGroup = byte;
      }
      else if(this.index >= 5 && this.index <= 7){
        this.packet.from.push(byte);
      }
      else if(this.index >= 8 && this.index <= 10){
        this.packet.linkData.push(byte);
      }

      /* Check no more data is need, call completed */
      if(this.bytesNeeded() === 0){
        this.completed = true; 
      }
    }
  },
  0x58:class extends Packet{
    constructor(){
      /* Constructing super class */
      super(3, 2, false);

      /* Packet Data */
      this.packet = {
        id: 0x58,
        type: 'ALL-Link Cleanup Status Report',
        status: null
      };
    }
    parse(byte){
      /* Moving to next index */
      this.index++;
      
      /* Determining where to place byte */
      if(byte === 0x06){
        this.packet.status = true;
      }
      else if(byte === 0x15){
        this.packet.status = false;
      }

      /* Check no more data is need, call completed */
      if(this.bytesNeeded() === 0){
        this.completed = true; 
      }
    }
  },
  0x60:class extends Packet{
    constructor(){
      /* Constructing super class */
      super(9, 2, false);

      /* Packet Data */
      this.packet = {
        id: 0x60,
        type: 'Get IM Info',
        ID: [],
        devcat: null,
        subcat: null,
        firmware: null,
        success: null
      };
    }
    parse(byte){
      /* Moving to next index */
      this.index++;
      
      /* Determining where to place byte */
      if(this.index >= 3 && this.index <= 5){
        this.packet.ID.push(byte);
      }
      else if(this.index === 6){
        this.packet.devcat = byte;
      }
      else if(this.index === 7){
        this.packet.subcat = byte;
      }
      else if(this.index === 8){
        this.packet.firmware = byte;
      }
      else if(this.index === 9){
        if(byte === 0x06){
          this.packet.success = true;
        }
        else if(byte === 0x15){
          this.packet.success = false;
        }
      }

      /* Check no more data is need, call completed */
      if(this.bytesNeeded() === 0){
        this.completed = true; 
      }
    }
  },
  0x61:class extends Packet{
    constructor(){
      /* Constructing super class */
      super(6, 2, false);

      /* Packet Data */
      this.packet = {
        id: 0x61,
        type: 'Send ALL-Link Command',
        allLinkGroup: null,
        allLinkCommand:  null,
        broadcastCommand2: null,
        success: null,
      };
    }
    parse(byte){
      /* Moving to next index */
      this.index++;

      /* Determining where to place byte */
      if(this.index === 3){
        this.packet.allLinkGroup = byte;
      }
      else if(this.index === 4){
        this.packet.allLinkCommand = byte;
      }
      else if(this.index === 5){
        this.packet.broadcastCommand2 = byte;
      }
      else if(this.index === 6){
        if(byte === 0x06){
          this.packet.success = true;
        }
        else if(byte === 0x15){
          this.packet.success = false;
        }
      }

      /* Check no more data is need, call completed */
      if(this.bytesNeeded() === 0){
        this.completed = true; 
      }
    }
  },
  0x62:class extends Packet{
    constructor(){
      /* Constructing super class */
      super(9, 2, false);

      /* Packet Data */
      this.packet = {
        id: 0x62,
        type: 'Send INSTEON Message',
        to: [],
        flags: null,
        cmd1: null,
        cmd2: null,
        success: null
      };
    }
    parse(byte){
      /* Moving to next index */
      this.index++;
      
      /* Determining where to place byte */
      if(this.index >= 3 && this.index <= 5){
        this.packet.to.push(byte);
      }
      else if(this.index === 6){
        this.packet.flag = byte;
      }
      else if(this.index === 7){
        this.packet.cmd1 = byte;
      }
      else if(this.index === 8){
        this.packet.cmd2 = byte;
      }
      else if(this.index === 9){
        if(byte === 0x06){
          this.packet.success = true;
        }
        else if(byte === 0x15){
          this.packet.success = false;
        }
      }

      /* Check no more data is need, call completed */
      if(this.bytesNeeded() === 0){
        this.completed = true; 
      }
    }
  },
  0x63:class extends Packet{
    constructor(){
      /* Constructing super class */
      super(5, 2, false);

      /* Packet Data */
      this.packet = {
        id: 0x63,
        type: 'Send X10',
        rawX10: null,
        X10Flag: null,
        success: null
      };
    }
    parse(byte){
      /* Moving to next index */
      this.index++;
      
      /* Determining where to place byte */
      if(this.index === 3){
        this.packet.rawX10 = byte;
      }
      else if(this.index === 4){
        this.packet.X10Flag = byte;
      }
      else if(this.index === 5){
        if(byte === 0x06){
          this.packet.success = true;
        }
        else if(byte === 0x15){ 
          this.packet.success = false;
        }
      }

      /* Check no more data is need, call completed */
      if(this.bytesNeeded() === 0){
        this.completed = true; 
      }
    }
  },
  0x64:class extends Packet{
    constructor(){
      /* Constructing super class */
      super(5, 2, false);

      /* Packet Data */
      this.packet = {
        id: 0x64,
        type: 'Start ALL-Linking',
        linkCode:  null,
        allLinkGroup:  null,
        success:  null,
      };
    }
    parse(byte){
      /* Moving to next index */
      this.index++;

      /* Determining where to place byte */
      if(this.index === 3){
        this.packet.linkCode = byte;
      }
      else if(this.index === 4){
        this.packet.allLinkGroup = byte;
      }
      else if(this.index === 5){
        if(byte === 0x06){
          this.packet.success = true;
        }
        else if(byte === 0x15){
          this.packet.success = false;
        }
      }

      /* Check no more data is need, call completed */
      if(this.bytesNeeded() === 0){
        this.completed = true; 
      }
    }
  },
  0x65:class extends Packet{
    constructor(){
      /* Constructing super class */
      super(3, 2, false);

      /* Packet Data */
      this.packet = {
        id: 0x65,
        type: 'Cancel ALL-Linking',
        success:  null
      };
    }
    parse(byte){
      /* Moving to next index */
      this.index++;
      
      /* Determining where to place byte */
      if(byte === 0x06){
        this.packet.success = true;
      }
      else if(byte === 0x15){
        this.packet.success = false;
      }

      /* Check no more data is need, call completed */
      if(this.bytesNeeded() === 0){
        this.completed = true; 
      }
    }
  },
  0x66:class extends Packet{
    constructor(){
      /* Constructing super class */
      super(6, 2, false);

      /* Packet Data */
      this.packet = {
        id: 0x66,
        type: 'Set Host Device Category',
        devcat: null,
        subcat: null,
        firmware: null,
        success: null
      };
    }
    parse(byte){
      /* Moving to next index */
      this.index++;
      
      /* Determining where to place byte */
      if(this.index === 3){
        this.packet.devcat = byte;
      }
      else if(this.index === 4){
        this.packet.subcat = byte;
      }
      else if(this.index === 5){
        this.packet.firmware = byte;
      }
      else if(this.index === 6){
        if(byte === 0x06){
          this.packet.success = true;
        }
        else if(byte === 0x15){
          this.packet.success = false;
        }
      }

      /* Check no more data is need, call completed */
      if(this.bytesNeeded() === 0){
        this.completed = true; 
      }
    }
  },
  0x67:class extends Packet{
    constructor(){
      /* Constructing super class */
      super(3, 2, false);

      /* Packet Data */
      this.packet = {
        id: 0x67,
        type: 'Reset the IM',
        success: null
      };
    }
    parse(byte){
      /* Moving to next index */
      this.index++;

      /* Determining where to place byte */
      if(byte === 0x06){
        this.packet.success = true;
      }
      else  if(byte === 0x15){
        this.packet.success = false;
      }

      /* Check no more data is need, call completed */
      if(this.bytesNeeded() === 0){
        this.completed = true; 
      }
    }
  },
  0x68:class extends Packet{
    constructor(){
      /* Constructing super class */
      super(4, 2, false);

      /* Packet Data */
      this.packet = {
        id: 0x68,        
        type: 'Set ACK Message Byte',
        cmd2:  null,
        success:  null,
      };
    }
    parse(byte){
      /* Moving to next index */
      this.index++;
      
      if(this.index === 3){
        this.packet.cmd2 = byte;
      }
      else if(this.index === 4){
        if(byte === 0x06){
          this.packet.success = true;
        }
        else{
          this.packet.success = false;
        }
      }

      /* Check no more data is need, call completed */
      if(this.bytesNeeded() === 0){
        this.completed = true; 
      }
    }
  },
  0x69:class extends Packet{
    constructor(){
      /* Constructing super class */
      super(3, 2, false);

      /* Packet Data */
      this.packet = {
        id: 0x69,
        type: 'Get First ALL-Link Record',
        success:  null
      };
    }
    parse(byte){
      /* Moving to next index */
      this.index++;

      /* Determining where to place byte */
      if(byte === 0x06){
        this.packet.success = true;
      }
      else if(byte === 0x15){
        this.packet.success = false;
      }

      /* Check no more data is need, call completed */
      if(this.bytesNeeded() === 0){
        this.completed = true; 
      }
    }
  },
  0x6A:class extends Packet{
    constructor(){
      /* Constructing super class */
      super(3, 2, false);

      /* Packet Data */
      this.packet = {
        id: 0x6A,
        type: 'Get Next ALL-Link Record',
        success: null
      };
    }
    parse(byte){
      /* Moving to next index */
      this.index++;

      /* Determining where to place byte */
      if(byte === 0x06){
        this.packet.success = true;
      }
      else if(byte === 0x15){
        this.packet.success = false;
      }

      /* Check no more data is need, call completed */
      if(this.bytesNeeded() === 0){
        this.completed = true; 
      }
    }
  },
  0x6B:class extends Packet{
    constructor(){
      /* Constructing super class */
      super(4, 2, false);

      /* Packet Data */
      this.packet = {
        id: 0x6B,
        type: 'Set IM Configuration',
        autoLinking: null,
        monitorMode: null,
        autoLED: null,
        deadman: null,
        success:  null
      };
    }
    parse(byte){
      /* Moving to next index */
      this.index++;
      
      /* Determining where to place byte */
      if(this.index === 3){
        /* Reading Flags */
        this.packet.autoLinking = !(byte & 128);
        this.packet.monitorMode = !!(byte & 64);
        this.packet.autoLED = !(byte & 32);
        this.packet.deadman = !(byte & 16);
      }
      else if(this.index === 4){
        if(byte === 0x06){
          this.packet.success = true;
        }
        else if(byte === 0x15){
          this.packet.success = false;
        }
      }

      /* Check no more data is need, call completed */
      if(this.bytesNeeded() === 0){
        this.completed = true; 
      }
    }
  },
  0x6C:class extends Packet{
    constructor(){
      /* Constructing super class */
      super(3, 2, false);

      /* Packet Data */
      this.packet = {
        id: 0x6C,
        type: 'Get ALL-Link Record for Sender',
        success: null
      };
    }
    parse(byte){
      /* Moving to next index */
      this.index++;
      
      /* Determining where to place byte */
      if(byte === 0x06){
        this.packet.success = true;
      }
      else if(byte === 0x15){
        this.packet.success = false;
      }

      /* Check no more data is need, call completed */
      if(this.bytesNeeded() === 0){
        this.completed = true; 
      }
    }
  },
  0x6D:class extends Packet{
    constructor(){
      /* Constructing super class */
      super(3, 2, false);

      /* Packet Data */
      this.packet = {
        id: 0x6D,
        type: 'LED On',
        success: null
      };
    }
    parse(byte){
      /* Moving to next index */
      this.index++;
      
      /* Determining where to place byte */
      if(byte === 0x06){
        this.packet.success = true;
      }
      else{
        this.packet.success = false;
      }

      /* Check no more data is need, call completed */
      if(this.bytesNeeded() === 0){
        this.completed = true; 
      }
    }
  },
  0x6E:class extends Packet{
    constructor(){
      /* Constructing super class */
      super(3, 2, false);

      /* Packet Data */
      this.packet = {
        id: 0x6E,
        type: 'LED Off',
        success: null
      };
    }
    parse(byte){
      /* Moving to next index */
      this.index++;
      
      /* Determining where to place byte */
      if(byte === 0x06){
        this.packet.success = true;
      }
      else if(byte === 0x15){
        this.packet.success = false;
      }

      /* Check no more data is need, call completed */
      if(this.bytesNeeded() === 0){
        this.completed = true; 
      }
    }
  },
  0x6F:class extends Packet{
    constructor(){
      /* Constructing super class */
      super(12, 2, false);

      /* Packet Data */
      this.packet = {
        id: 0x6F,
        type: 'Manage ALL-Link Record',
        controlCode: null,
        recordType: null,
        allLinkGroup: null,
        device: [],
        linkData: [],
        success: null,
      };
    }
    parse(byte){
      /* Moving to next index */
      this.index++;

      /* Determining where to place byte */
      if(this.index === 3){
        this.packet.controlCode = byte;
      }
      else if(this.index === 4){
        if((byte & 64) != 0){ 
          this.packet.recordType = 'Controller';
        }
        else {
          this.packet.recordType = 'Responder';
        }
      }
      else if(this.index === 5){
        this.packet.allLinkGroup = byte;
      }
      else if(this.index > 5 && this.index < 9){
        this.packet.device.push(byte);
      }
      else if(this.index > 8 && this.index < 12){
        this.packet.device.push(byte);
      }
      else if(this.index === 12){
        if(byte === 0x06){
          this.packet.success = true;
        }
        else if(byte === 0x15){
          this.packet.success = false;
        }
      }

      /* Check no more data is need, call completed */
      if(this.bytesNeeded() === 0){
        this.completed = true; 
      }
    }
  },
  0x70:class extends Packet{
    constructor(){
      /* Constructing super class */
      super(4, 2, false);

      /* Packet Data */
      this.packet = {
        id: 0x70,
        type: 'Set NAK Message Byte',
        cmd2:  null,
        success:  null
      };
    }
    parse(byte){
      /* Moving to next index */
      this.index++;
      
      if(this.index === 3){
        this.packet.cmd2 = byte;
      }
      else if(this.index === 4){
        if(byte === 0x06){
          this.packet.success = true;
        }
        else if(byte === 0x15){
          this.packet.success = false;
        }
      }

      /* Check no more data is need, call completed */
      if(this.bytesNeeded() === 0){
        this.completed = true; 
      }
    }
  },
  0x71:class extends Packet{
    constructor(){
      /* Constructing super class */
      super(5, 2, false);

      /* Packet Data */
      this.packet = {
        id: 0x71,
        type: 'Set ACK Message Two Bytes',
        cmd1:  null,
        cmd2:  null,
        success:  null
      };
    }
    parse(byte){
      /* Moving to next index */
      this.index++;
      
      if(this.index === 3){
        this.packet.cmd1 = byte;
      }
      else if(this.index === 4){
        this.packet.cmd2 = byte;
      }
      else if(this.index === 5){
        if(byte === 0x06){
          this.packet.success = true;
        }
        else if(byte === 0x15){
          this.packet.success = false;
        }
      }

      /* Check no more data is need, call completed */
      if(this.bytesNeeded() === 0){
        this.completed = true; 
      }
    }
  },
  0x72:class extends Packet{
    constructor(){
      /* Constructing super class */
      super(5, 2, false);

      /* Packet Data */
      this.packet = {
        id: 0x72,
        type: 'RF Sleep',
        cmd1: null,
        cmd2: null,
        success: null
      };
    }
    parse(byte){
      /* Moving to next index */
      this.index++;
      
      /* Determining where to place byte */
      if(this.index === 3){
        this.packet.cmd1 = byte;
      }
      else if(this.index === 4){
        this.packet.cmd2 = byte;
      }
      else if(this.index === 5){
        if(byte === 0x06){
          this.packet.success = true;
        }
        else if(byte === 0x15){
          this.packet.success = false;
        }
      }

      /* Check no more data is need, call completed */
      if(this.bytesNeeded() === 0){
        this.completed = true; 
      }
    }
  },
  0x73:class extends Packet{
    constructor(){
      /* Constructing super class */
      super(6, 2, false);

      /* Packet Data */
      this.packet = {
        id: 0x73,
        type: 'Get IM Configuration',
        autoLinking: null,
        monitorMode: null,
        autoLED: null,
        deadman: null,
        success:  null
      };
    }
    parse(byte){
      /* Moving to next index */
      this.index++;
      
      /* Determining where to place byte */
      if(this.index === 3){
        /* Reading Flags */
        this.packet.autoLinking = !(byte & 128);
        this.packet.monitorMode = !!(byte & 64);
        this.packet.autoLED = !(byte & 32);
        this.packet.deadman = !(byte & 16);
      }
      else if(this.index === 6){
        if(byte === 0x06){
          this.packet.success = true;
        }
        else if(byte === 0x15){
          this.packet.success = false;
        }
      }

      /* Check no more data is need, call completed */
      if(this.bytesNeeded() === 0){
        this.completed = true; 
      }
    }
  }
};