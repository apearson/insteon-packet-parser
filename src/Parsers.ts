/* Libraries */
import { Packets } from './main';

/* Packet abstract base class */
export abstract class Parser{
	/* Internal Variables */
	public packetLength: number;
	public index: number;
	public completed: boolean;
	public packet: Packets.Packet;

	constructor(length: number, index: number, completed:boolean){
		/* Packet metadata */
		this.packetLength = length;
		this.index = index;
		this.completed = completed;

		/* Packet Data */
		this.packet = {
			type: 0x00,
			typeDesc: 'Abstract Packet',
		} as Packets.Packet;
	}
	bytesNeeded(){
		return this.packetLength - this.index;
	}
	parse(byte: number): void {}
}

/* Packet Parsing Classes */
export const Parsers: {[key: number]: any} = {
	0x15:class extends Parser{
		constructor(){
			/* Constructing super class */
			super(2, 2, true);

			/* Packet Data */
			this.packet = {
				type: 0x15,
				typeDesc: 'Modem Not Ready'
			};
		}
		parse(byte: number){
			return byte;
		}
	},
	0x50:class extends Parser{
		constructor(){
			/* Constructing super class */
			super(11, 2, false);

			/* Packet Data */
			this.packet = {
				type: 0x50,
				typeDesc: 'Standard Message Received',
				from: [],
				to: [],
				flags: null,
				maxHops: null,
				hopsLeft: null,
				extended: false,
				subtype: null,
				subtypeDesc: null,
				cmd1: null,
				cmd2: null,
			} as Packets.StandardMessageRecieved;
		}
		parse(byte: number){
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
				this.packet.subtype = ((byte & 224) >> 5);

				/* Interpreting Meaning Flag */
				switch(this.packet.subtype){
					case 0:
						this.packet.subtypeDesc = 'Direct Message'; break;
					case 1:
						this.packet.subtypeDesc = 'ACK of Direct Message'; break;
					case 2:
						this.packet.subtypeDesc = 'Group Cleanup Direct Message'; break;
					case 3:
						this.packet.subtypeDesc = 'ACK of Group Cleanup Direct Message'; break;
					case 4:
						this.packet.subtypeDesc = 'Broadcast Message'; break;
					case 5:
						this.packet.subtypeDesc = 'NAK of Direct Message'; break;
					case 6:
						this.packet.subtypeDesc = 'Group Broadcast Message'; break;
					case 7:
						this.packet.subtypeDesc = 'NAK of Group Cleanup Direct Message'; break;
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
	0x51:class extends Parser{
		constructor(){
			/* Constructing super class */
			super(25, 2, false);

			/* Packet Data */
			this.packet = {
				type: 0x51,
				typeDesc: 'Extended Message Received',
				from: [],
				to: [],
				flags: null,
				maxHops: null,
				hopsLeft: null,
				extended: true,
				subtype: 0x00,
				subtypeDesc: null,
				cmd1: null,
				cmd2: null,
				extendedData: [],
			} as Packets.ExtendedMessageRecieved;
		}
		parse(byte: number){
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
				this.packet.subtype = ((byte & 224) >> 5);

				/* Interpreting Meaning Flag */
				switch(this.packet.subtype){
					case 0:
						this.packet.subtypeDesc = 'Direct Message'; break;
					case 1:
						this.packet.subtypeDesc = 'ACK of Direct Message'; break;
					case 2:
						this.packet.subtypeDesc = 'Group Cleanup Direct Message'; break;
					case 3:
						this.packet.subtypeDesc = 'ACK of Group Cleanup Direct Message'; break;
					case 4:
						this.packet.subtypeDesc = 'Broadcast Message'; break;
					case 5:
						this.packet.subtypeDesc = 'NAK of Direct Message'; break;
					case 6:
						this.packet.subtypeDesc = 'Group Broadcast Message'; break;
					case 7:
						this.packet.subtypeDesc = 'NAK of Group Cleanup Direct Message'; break;
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
	0x52:class extends Parser{
		constructor(){
			/* Constructing super class */
			super(4, 2, false);

			/* Packet Data */
			this.packet = {
				type: 0x52,
				typeDesc: 'X10 Received',
				rawX10: null,
				X10Flag: null
			} as Packets.x10Recieved;
		}
		parse(byte: number){
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
	0x53:class extends Parser{
		constructor(){
			/* Constructing super class */
			super(10, 2, false);

			/* Packet Data */
			this.packet = {
				type: 0x53,
				typeDesc: 'ALL-Linking Completed',
				linkCode:  null,
				allLinkGroup: null,
				from:  [],
				devcat: null,
				subcat: null,
				firmware: null
			} as Packets.AllLinkingCompleted;
		}
		parse(byte: number){
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
	0x54:class extends Parser{
		constructor(){
			/* Constructing super class */
			super(3, 2, false);

			/* Packet Data */
			this.packet = {
				type: 0x54,
				typeDesc: 'Button Event Report',
				event: 0x00,
				eventDesc: null
			} as Packets.ButtonEventReport;
		}
		parse(byte: number){
			/* Moving to next index */
			this.index++;

			/* Determining where to place byte */
			this.packet.event = byte;

			/* Determining meaning of event byte */
			switch(byte){
				case 0x02:
					this.packet.eventDesc = 'IM SET Button tapped'; break;
				case 0x03:
					this.packet.eventDesc = 'IM SET Button held'; break;
				case 0x04:
					this.packet.eventDesc = 'IM SET Button released after hold'; break;
				case 0x12:
					this.packet.eventDesc = 'IM Button 2 tapped'; break;
				case 0x13:
					this.packet.eventDesc = 'IM Button 2 held'; break;
				case 0x14:
					this.packet.eventDesc = 'IM Button 2 released after hold'; break;
				case 0x22:
					this.packet.eventDesc = 'IM Button 3 tapped'; break;
				case 0x23:
					this.packet.eventDesc = 'IM Button 3 held'; break;
				case 0x24:
					this.packet.eventDesc = 'IM Button 3 released after hold'; break;
			}

			/* Check no more data is need, call completed */
			if(this.bytesNeeded() === 0){
				this.completed = true;
			}
		}
	},
	0x55:class extends Parser{
		constructor(){
			/* Constructing super class */
			super(2, 2, true);

			/* Packet Data */
			this.packet = {
				type: 0x55,
				typeDesc: 'User Reset Detected',
			} as Packets.UserResetDetected;
		}
		parse(byte: number){
			return byte;
		}
	},
	0x56:class extends Parser{
		constructor(){
			/* Constructing super class */
			super(7, 2, false);

			/* Packet Data */
			this.packet = {
				type: 0x56,
				typeDesc: 'ALL-Link Cleanup Failure Report',
				allLinkGroup: null,
				device: []
			} as Packets.AllLinkCleanupFailureReport;
		}
		parse(byte: number){
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
	0x57:class extends Parser{
		constructor(){
			/* Constructing super class */
			super(10, 2, false);

			/* Packet Data */
			this.packet = {
				type: 0x57,
				typeDesc: 'ALL-Link Record Response',
				recordType: null,
				allLinkGroup: null,
				from:  [],
				linkData:  []
			} as Packets.AllLinkRecordResponse;
		}
		parse(byte: number){
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
	0x58:class extends Parser{
		constructor(){
			/* Constructing super class */
			super(3, 2, false);

			/* Packet Data */
			this.packet = {
				type: 0x58,
				typeDesc: 'ALL-Link Cleanup Status Report',
				status: null
			} as Packets.AllLinkCleanupStatusReport;
		}
		parse(byte: number){
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
	0x60:class extends Parser{
		constructor(){
			/* Constructing super class */
			super(9, 2, false);

			/* Packet Data */
			this.packet = {
				type: 0x60,
				typeDesc: 'Get IM Info',
				ID: [],
				devcat: null,
				subcat: null,
				firmware: null,
				ack: null
			} as Packets.GetIMInfo;
		}
		parse(byte: number){
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
					this.packet.ack = true;
				}
				else if(byte === 0x15){
					this.packet.ack = false;
				}
			}

			/* Check no more data is need, call completed */
			if(this.bytesNeeded() === 0){
				this.completed = true;
			}
		}
	},
	0x61:class extends Parser{
		constructor(){
			/* Constructing super class */
			super(6, 2, false);

			/* Packet Data */
			this.packet = {
				type: 0x61,
				typeDesc: 'Send ALL-Link Command',
				allLinkGroup: null,
				allLinkCommand:  null,
				broadcastCommand2: null,
				ack: null,
			} as Packets.SendAllLinkCommand;
		}
		parse(byte: number){
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
					this.packet.ack = true;
				}
				else if(byte === 0x15){
					this.packet.ack = false;
				}
			}

			/* Check no more data is need, call completed */
			if(this.bytesNeeded() === 0){
				this.completed = true;
			}
		}
	},
	0x62:class extends Parser{
		constructor(){
			/* Constructing super class */
			super(9, 2, false);

			/* Packet Data */
			this.packet = {
				type: 0x62,
				typeDesc: 'Send INSTEON Message',
				extended: false,
				to: [],
				flags: null,
				cmd1: null,
				cmd2: null,
				ack: null
			} as Packets.SendInsteonMessage;
		}
		parse(byte: number){
			/* Moving to next index */
			this.index++;

			/* Determining where to place byte */
			if(this.index >= 3 && this.index <= 5){
				this.packet.to.push(byte);
			}
			else if(this.index === 6){
				this.packet.flags = byte;

				/* Checking for extended packet */
				if(byte & 0x08){
					this.packetLength = 23;
					this.packet.extended = true;
					this.packet.userData = [];
				}
			}
			else if(this.index === 7){
				this.packet.cmd1 = byte;
			}
			else if(this.index === 8){
				this.packet.cmd2 = byte;
			}
			else if(this.index === 9){
				if(byte === 0x06){
					this.packet.ack = true;
				}
				else if(byte === 0x15){
					this.packet.ack = false;
				}
			}
			else if(this.index >= 10){
				this.packet.userData.push(byte);
			}

			/* Check no more data is need, call completed */
			if(this.bytesNeeded() === 0){
				this.completed = true;
			}
		}
	},
	0x63:class extends Parser{
		constructor(){
			/* Constructing super class */
			super(5, 2, false);

			/* Packet Data */
			this.packet = {
				type: 0x63,
				typeDesc: 'Send X10',
				rawX10: null,
				X10Flag: null,
				ack: null
			} as Packets.SendX10;
		}
		parse(byte: number){
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
					this.packet.ack = true;
				}
				else if(byte === 0x15){
					this.packet.ack = false;
				}
			}

			/* Check no more data is need, call completed */
			if(this.bytesNeeded() === 0){
				this.completed = true;
			}
		}
	},
	0x64:class extends Parser{
		constructor(){
			/* Constructing super class */
			super(5, 2, false);

			/* Packet Data */
			this.packet = {
				type: 0x64,
				typeDesc: 'Start ALL-Linking',
				linkCode:  null,
				allLinkGroup:  null,
				ack:  null,
			} as Packets.StartAllLinking;
		}
		parse(byte: number){
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
					this.packet.ack = true;
				}
				else if(byte === 0x15){
					this.packet.ack = false;
				}
			}

			/* Check no more data is need, call completed */
			if(this.bytesNeeded() === 0){
				this.completed = true;
			}
		}
	},
	0x65:class extends Parser{
		constructor(){
			/* Constructing super class */
			super(3, 2, false);

			/* Packet Data */
			this.packet = {
				type: 0x65,
				typeDesc: 'Cancel ALL-Linking',
				ack:  null
			} as Packets.CancelAllLinking;
		}
		parse(byte: number){
			/* Moving to next index */
			this.index++;

			/* Determining where to place byte */
			if(byte === 0x06){
				this.packet.ack = true;
			}
			else if(byte === 0x15){
				this.packet.ack = false;
			}

			/* Check no more data is need, call completed */
			if(this.bytesNeeded() === 0){
				this.completed = true;
			}
		}
	},
	0x66:class extends Parser{
		constructor(){
			/* Constructing super class */
			super(6, 2, false);

			/* Packet Data */
			this.packet = {
				type: 0x66,
				typeDesc: 'Set Host Device Category',
				devcat: null,
				subcat: null,
				firmware: null,
				ack: null
			} as Packets.SetHostDeviceCategory;
		}
		parse(byte: number){
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
					this.packet.ack = true;
				}
				else if(byte === 0x15){
					this.packet.ack = false;
				}
			}

			/* Check no more data is need, call completed */
			if(this.bytesNeeded() === 0){
				this.completed = true;
			}
		}
	},
	0x67:class extends Parser{
		constructor(){
			/* Constructing super class */
			super(3, 2, false);

			/* Packet Data */
			this.packet = {
				type: 0x67,
				typeDesc: 'Reset the IM',
				ack: null
			} as Packets.ResetIM;
		}
		parse(byte: number){
			/* Moving to next index */
			this.index++;

			/* Determining where to place byte */
			if(byte === 0x06){
				this.packet.ack = true;
			}
			else  if(byte === 0x15){
				this.packet.ack = false;
			}

			/* Check no more data is need, call completed */
			if(this.bytesNeeded() === 0){
				this.completed = true;
			}
		}
	},
	0x68:class extends Parser{
		constructor(){
			/* Constructing super class */
			super(4, 2, false);

			/* Packet Data */
			this.packet = {
				type: 0x68,
				typeDesc: 'Set ACK Message Byte',
				cmd2:  null,
				ack:  null,
			} as Packets.SetACKMessageByte;
		}
		parse(byte: number){
			/* Moving to next index */
			this.index++;

			if(this.index === 3){
				this.packet.cmd2 = byte;
			}
			else if(this.index === 4){
				if(byte === 0x06){
					this.packet.ack = true;
				}
				else{
					this.packet.ack = false;
				}
			}

			/* Check no more data is need, call completed */
			if(this.bytesNeeded() === 0){
				this.completed = true;
			}
		}
	},
	0x69:class extends Parser{
		constructor(){
			/* Constructing super class */
			super(3, 2, false);

			/* Packet Data */
			this.packet = {
				type: 0x69,
				typeDesc: 'Get First ALL-Link Record',
				ack:  null
			} as Packets.GetFirstAllLinkRecord;
		}
		parse(byte: number){
			/* Moving to next index */
			this.index++;

			/* Determining where to place byte */
			if(byte === 0x06){
				this.packet.ack = true;
			}
			else if(byte === 0x15){
				this.packet.ack = false;
			}

			/* Check no more data is need, call completed */
			if(this.bytesNeeded() === 0){
				this.completed = true;
			}
		}
	},
	0x6A:class extends Parser{
		constructor(){
			/* Constructing super class */
			super(3, 2, false);

			/* Packet Data */
			this.packet = {
				type: 0x6A,
				typeDesc: 'Get Next ALL-Link Record',
				ack: null
			} as Packets.GetNextAllLinkRecord;
		}
		parse(byte: number){
			/* Moving to next index */
			this.index++;

			/* Determining where to place byte */
			if(byte === 0x06){
				this.packet.ack = true;
			}
			else if(byte === 0x15){
				this.packet.ack = false;
			}

			/* Check no more data is need, call completed */
			if(this.bytesNeeded() === 0){
				this.completed = true;
			}
		}
	},
	0x6B:class extends Parser{
		constructor(){
			/* Constructing super class */
			super(4, 2, false);

			/* Packet Data */
			this.packet = {
				type: 0x6B,
				typeDesc: 'Set IM Configuration',
				autoLinking: null,
				monitorMode: null,
				autoLED: null,
				deadman: null,
				ack:  null
			} as Packets.SetIMConfiguration;
		}
		parse(byte: number){
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
					this.packet.ack = true;
				}
				else if(byte === 0x15){
					this.packet.ack = false;
				}
			}

			/* Check no more data is need, call completed */
			if(this.bytesNeeded() === 0){
				this.completed = true;
			}
		}
	},
	0x6C:class extends Parser{
		constructor(){
			/* Constructing super class */
			super(3, 2, false);

			/* Packet Data */
			this.packet = {
				type: 0x6C,
				typeDesc: 'Get ALL-Link Record for Sender',
				ack: null
			} as Packets.GetAllLinkRecordforSender;
		}
		parse(byte: number){
			/* Moving to next index */
			this.index++;

			/* Determining where to place byte */
			if(byte === 0x06){
				this.packet.ack = true;
			}
			else if(byte === 0x15){
				this.packet.ack = false;
			}

			/* Check no more data is need, call completed */
			if(this.bytesNeeded() === 0){
				this.completed = true;
			}
		}
	},
	0x6D:class extends Parser{
		constructor(){
			/* Constructing super class */
			super(3, 2, false);

			/* Packet Data */
			this.packet = {
				type: 0x6D,
				typeDesc: 'LED On',
				ack: null
			} as Packets.LEDOn;
		}
		parse(byte: number){
			/* Moving to next index */
			this.index++;

			/* Determining where to place byte */
			if(byte === 0x06){
				this.packet.ack = true;
			}
			else{
				this.packet.ack = false;
			}

			/* Check no more data is need, call completed */
			if(this.bytesNeeded() === 0){
				this.completed = true;
			}
		}
	},
	0x6E:class extends Parser{
		constructor(){
			/* Constructing super class */
			super(3, 2, false);

			/* Packet Data */
			this.packet = {
				type: 0x6E,
				typeDesc: 'LED Off',
				ack: null
			} as Packets.LEDOff;
		}
		parse(byte: number){
			/* Moving to next index */
			this.index++;

			/* Determining where to place byte */
			if(byte === 0x06){
				this.packet.ack = true;
			}
			else if(byte === 0x15){
				this.packet.ack = false;
			}

			/* Check no more data is need, call completed */
			if(this.bytesNeeded() === 0){
				this.completed = true;
			}
		}
	},
	0x6F:class extends Parser{
		constructor(){
			/* Constructing super class */
			super(12, 2, false);

			/* Packet Data */
			this.packet = {
				type: 0x6F,
				typeDesc: 'Manage ALL-Link Record',
				controlCode: null,
				recordType: null,
				allLinkGroup: null,
				device: [],
				linkData: [],
				ack: null,
			} as Packets.ManageAllLinkRecord;
		}
		parse(byte: number){
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
					this.packet.ack = true;
				}
				else if(byte === 0x15){
					this.packet.ack = false;
				}
			}

			/* Check no more data is need, call completed */
			if(this.bytesNeeded() === 0){
				this.completed = true;
			}
		}
	},
	0x70:class extends Parser{
		constructor(){
			/* Constructing super class */
			super(4, 2, false);

			/* Packet Data */
			this.packet = {
				type: 0x70,
				typeDesc: 'Set NAK Message Byte',
				cmd2:  null,
				ack:  null
			} as Packets.SetNAKMessageByte;
		}
		parse(byte: number){
			/* Moving to next index */
			this.index++;

			if(this.index === 3){
				this.packet.cmd2 = byte;
			}
			else if(this.index === 4){
				if(byte === 0x06){
					this.packet.ack = true;
				}
				else if(byte === 0x15){
					this.packet.ack = false;
				}
			}

			/* Check no more data is need, call completed */
			if(this.bytesNeeded() === 0){
				this.completed = true;
			}
		}
	},
	0x71:class extends Parser{
		constructor(){
			/* Constructing super class */
			super(5, 2, false);

			/* Packet Data */
			this.packet = {
				type: 0x71,
				typeDesc: 'Set ACK Message Two Bytes',
				cmd1:  null,
				cmd2:  null,
				ack:  null
			} as Packets.SetACKMessageTwoBytes;
		}
		parse(byte: number){
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
					this.packet.ack = true;
				}
				else if(byte === 0x15){
					this.packet.ack = false;
				}
			}

			/* Check no more data is need, call completed */
			if(this.bytesNeeded() === 0){
				this.completed = true;
			}
		}
	},
	0x72:class extends Parser{
		constructor(){
			/* Constructing super class */
			super(5, 2, false);

			/* Packet Data */
			this.packet = {
				type: 0x72,
				typeDesc: 'RF Sleep',
				cmd1: null,
				cmd2: null,
				ack: null
			} as Packets.RFSleep;
		}
		parse(byte: number){
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
					this.packet.ack = true;
				}
				else if(byte === 0x15){
					this.packet.ack = false;
				}
			}

			/* Check no more data is need, call completed */
			if(this.bytesNeeded() === 0){
				this.completed = true;
			}
		}
	},
	0x73:class extends Parser{
		constructor(){
			/* Constructing super class */
			super(6, 2, false);

			/* Packet Data */
			this.packet = {
				type: 0x73,
				typeDesc: 'Get IM Configuration',
				autoLinking: null,
				monitorMode: null,
				autoLED: null,
				deadman: null,
				ack:  null
			} as Packets.GetIMConfiguration;
		}
		parse(byte: number){
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
					this.packet.ack = true;
				}
				else if(byte === 0x15){
					this.packet.ack = false;
				}
			}

			/* Check no more data is need, call completed */
			if(this.bytesNeeded() === 0){
				this.completed = true;
			}
		}
	}
};
