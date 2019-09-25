/* Libraries */
import * as Packets from './typings/interfaces';
import { PacketID, AllLinkRecordType } from './typings/enums';
import { Byte } from './main';

/* Packet abstract base class */
export abstract class Parser {
	/* Internal Variables */
	public packetLength: number;
	public index: number = 2;
	public packet: Packets.Packet;

	get completed() {
		return this.index >= this.packetLength;
	}

	constructor(length: number, index: number){
		/* Packet metadata */
		this.packetLength = length;
		this.index = index;

		/* Packet Data */
		this.packet = {
			type: 0x00
		};
	}

	parse(byte: Byte): void {}
}

/* Packet Parsing Classes */
export const Parsers: {[key: number]: any} = {
	0x15: class extends Parser {
		/* Packet Meta */
		packetLength = 2;

		/* Packet */
		packet: Packets.Packet = {
			type: PacketID.ModemNotReady,
		};

		/* Parser */
		parse(byte: Byte){
			return byte;
		}
	},
	0x50: class extends Parser {
		/* Packet Meta */
		packetLength = 11;

		/* Packet */
		packet: Packets.StandardMessageRecieved = {
			type: PacketID.StandardMessageReceived,
			from: [],
			to: [],
			flags: null,
			Flags: {
				extended: null,
				hopsLeft: null,
				maxHops: null,
				subtype: null,
			},
			cmd1: null,
			cmd2: null,
		};

		/* Parser */
		parse(byte: Byte){
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
				this.packet.Flags = {
					maxHops: (byte & 3),
					hopsLeft: ((byte & 12) >> 2),
					extended: !!(byte & 16),
					subtype: ((byte & 224) >> 5)
				}

			}
			else if (this.index == 10){
				this.packet.cmd1 = byte;
			}
			else if(this.index == 11){
				this.packet.cmd2 = byte;
			}
		}
	},
	0x51: class extends Parser {
		/* Packet Meta */
		packetLength = 25;

		/* Packet */
		packet: Packets.ExtendedMessageRecieved = {
			type: PacketID.ExtendedMessageReceived,
			from: [],
			to: [],
			flags: null,
			Flags: {
				extended: null,
				hopsLeft: null,
				maxHops: null,
				subtype: null,
			},
			cmd1: null,
			cmd2: null,
			extendedData: [],
		};

		/* Parser */
		parse(byte: Byte){
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
				this.packet.Flags = {
					maxHops: (byte & 3),
					hopsLeft: ((byte & 12) >> 2),
					extended: !!(byte & 16),
					subtype: ((byte & 224) >> 5)
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
		}
	},
	0x52: class extends Parser {
		/* Packet Meta */
		packetLength = 4;

		/* Packet */
		packet: Packets.x10Recieved = {
			type: PacketID.X10Received,
			rawX10: null,
			X10Flag: null
		};

		/* Parser */
		parse(byte: Byte){
			/* Moving to next index */
			this.index++;

			/* Determining where to place byte */
			if(this.index === 3){
				this.packet.rawX10 = byte;
			}
			else if(this.index === 4){
				this.packet.x10Flag = byte;
			}
		}
	},
	0x53: class extends Parser {
		/* Packet Meta */
		packetLength = 10;

		/* Packet */
		packet: Packets.AllLinkingCompleted = {
			type: PacketID.AllLinkingCompleted,
			linkCode:  null,
			allLinkGroup: null,
			from:  [],
			devcat: null,
			subcat: null,
			firmware: null
		};

		/* Parser */
		parse(byte: Byte){
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
		}
	},
	0x54: class extends Parser {
		/* Packet Meta */
		packetLength = 3;

		/* Packet */
		packet: Packets.ButtonEventReport = {
			type: PacketID.ButtonEventReport,
			event: 0x00,
		}

		/* Parser */
		parse(byte: Byte){
			/* Moving to next index */
			this.index++;

			/* Determining where to place byte */
			this.packet.event = byte;
		}
	},
	0x55: class extends Parser {
		/* Packet Meta */
		packetLength = 2;

		/* Packet */
		packet: Packets.UserResetDetected = {
			type: PacketID.UserResetDetected,
		}

		/* Parser */
		parse(byte: Byte){
			return byte;
		}
	},
	0x56: class extends Parser {
		/* Packet Meta */
		packetLength = 7;

		/* Packet */
		packet: Packets.AllLinkCleanupFailureReport = {
			type: PacketID.AllLinkCleanupFailureReport,
			allLinkGroup: null,
			device: []
		}

		/* Parser */
		parse(byte: Byte){
			/* Moving to next index */
			this.index++;

			/* Determining where to place byte */
			if(this.index === 4){
				this.packet.allLinkGroup = byte;
			}
			else if(this.index >= 5 && this.index <= 7){
				this.packet.device.push(byte);
			}
		}
	},
	0x57: class extends Parser {
		/* Packet Meta */
		packetLength = 10;

		/* Packet */
		packet: Packets.AllLinkRecordResponse = {
			type: PacketID.AllLinkRecordResponse,
			allLinkGroup: null,
			flags: null,
			Flags: {
				inUse: false,
				recordType: AllLinkRecordType.Controller
			},
			from:  [],
			linkData:  []
		}

		/* Parser */
		parse(byte: Byte){
			/* Moving to next index */
			this.index++;

			/* Determining where to place byte */
			if(this.index === 3){

				this.packet.flags = byte;

				this.packet.Flags = {
					inUse: ((byte & 12) != 0),
					recordType: ((byte & 64) != 0) ? AllLinkRecordType.Controller
					                               : AllLinkRecordType.Responder
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
		}
	},
	0x58: class extends Parser {
		/* Packet Meta */
		packetLength = 3;

		/* Packet */
		packet: Packets.AllLinkCleanupStatusReport = {
			type: PacketID.AllLinkCleanupStatusReport,
			status: null
		}

		/* Parser */
		parse(byte: Byte){
			/* Moving to next index */
			this.index++;

			/* Determining where to place byte */
			if(byte === 0x06){
				this.packet.status = true;
			}
			else if(byte === 0x15){
				this.packet.status = false;
			}
		}
	},
	0x60: class extends Parser {
		/* Packet Meta */
		packetLength = 9;

		/* Packet */
		packet: Packets.GetIMInfo = {
			type: PacketID.GetIMInfo,
			ID: [],
			devcat: null,
			subcat: null,
			firmware: null,
			ack: null
		};

		/* Parser */
		parse(byte: Byte){
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
		}
	},
	0x61: class extends Parser {
		/* Packet Meta */
		packetLength = 6;

		/* Packet */
		packet: Packets.SendAllLinkCommand = {
			type: PacketID.SendAllLinkCommand,
			allLinkGroup: null,
			allLinkCommand:  null,
			broadcastCommand2: null,
			ack: null,
		}

		/* Parser */
		parse(byte: Byte){
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
		}
	},
	0x62: class extends Parser {
		/* Packet Meta */
		packetLength = 9;

		/* Packet */
		packet: Packets.SendInsteonMessage = {
			type: PacketID.SendInsteonMessage,
			extended: false,
			to: [],
			flags: null,
			cmd1: null,
			cmd2: null,
			ack: null
		} 

		/* Parser */
		parse(byte: Byte){
			/* Moving to next index */
			this.index++;

			/* Determining where to place byte */
			if(this.index >= 3 && this.index <= 5){
				this.packet.to.push(byte);
			}
			else if(this.index === 6){
				this.packet.flags = byte;

				/* Reading Flags */
				this.packet.Flags = {
					maxHopes: (byte & 3),
					hopsLeft: ((byte & 12) >> 2),
					extended: !!(byte & 16),
					subtype: ((byte & 224) >> 5)
				}

				/* Checking for extended packet */
				if(this.packet.Flags.extended){
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
		}
	},
	0x63: class extends Parser {
		/* Packet Meta */
		packetLength = 5;

		/* Packet */
		packet: Packets.SendX10 = {
			type: PacketID.SendX10,
			rawX10: null,
			X10Flag: null,
			ack: null
		}

		/* Parser */
		parse(byte: Byte){
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
		}
	},
	0x64: class extends Parser {
		/* Packet Meta */
		packetLength = 5;

		/* Packet */
		packet: Packets.StartAllLinking = {
			type: PacketID.StartAllLinking,
			linkCode:  null,
			allLinkGroup:  null,
			ack:  null,
		}

		/* Parser */
		parse(byte: Byte){
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
		}
	},
	0x65: class extends Parser {
		/* Packet Meta */
		packetLength = 3;

		/* Packet */
		packet: Packets.CancelAllLinking = {
			type: PacketID.CancelAllLinking,
			ack:  null
		}

		/* Parser */
		parse(byte: Byte){
			/* Moving to next index */
			this.index++;

			/* Determining where to place byte */
			if(byte === 0x06){
				this.packet.ack = true;
			}
			else if(byte === 0x15){
				this.packet.ack = false;
			}
		}
	},
	0x66: class extends Parser {
		/* Packet Meta */
		packetLength = 6;

		/* Packet */
		packet: Packets.SetHostDeviceCategory = {
			type: PacketID.SetHostDeviceCategory,
			devcat: null,
			subcat: null,
			firmware: null,
			ack: null
		} 

		/* Parser */
		parse(byte: Byte){
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
		}
	},
	0x67: class extends Parser {
		/* Packet Meta */
		packetLength = 3;

		/* Packet */
		packet: Packets.ResetIM = {
			type: PacketID.ResetIM,
			ack: null
		}

		/* Parser */
		parse(byte: Byte){
			/* Moving to next index */
			this.index++;

			/* Determining where to place byte */
			if(byte === 0x06){
				this.packet.ack = true;
			}
			else  if(byte === 0x15){
				this.packet.ack = false;
			}
		}
	},
	0x68: class extends Parser {
		/* Packet Meta */
		packetLength = 4;

		/* Packet */
		packet: Packets.SetACKMessageByte = {
			type: PacketID.SetACKMessageByte,
			cmd2:  null,
			ack:  null,
		}

		/* Parser */
		parse(byte: Byte){
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
		}
	},
	0x69: class extends Parser {
		/* Packet Meta */
		packetLength = 3;

		/* Packet */
		packet: Packets.GetFirstAllLinkRecord = {
			type: PacketID.GetFirstAllLinkRecord,
			ack:  null
		} 

		/* Parser */
		parse(byte: Byte){
			/* Moving to next index */
			this.index++;

			/* Determining where to place byte */
			if(byte === 0x06){
				this.packet.ack = true;
			}
			else if(byte === 0x15){
				this.packet.ack = false;
			}
		}
	},
	0x6A: class extends Parser {
		/* Packet Meta */
		packetLength = 3;

		/* Packet */
		packet: Packets.GetNextAllLinkRecord = {
			type: PacketID.GetNextAllLinkRecord,
			ack: null
		}

		/* Parser */
		parse(byte: Byte){
			/* Moving to next index */
			this.index++;

			/* Determining where to place byte */
			if(byte === 0x06){
				this.packet.ack = true;
			}
			else if(byte === 0x15){
				this.packet.ack = false;
			}
		}
	},
	0x6B: class extends Parser {
		/* Packet Meta */
		packetLength = 4;

		/* Packet */
		packet: Packets.SetIMConfiguration = {
			type: PacketID.SetIMConfiguration,
			flags: null,
			Flags: {
				autoLinking: null,
				monitorMode: null,
				autoLED: null,
				deadman: null,
			},
			ack:  null
		};

		/* Parsing byte */
		parse(byte: Byte){
			/* Moving to next index */
			this.index++;

			/* Determining where to place byte */
			if(this.index === 3){

				this.packet.flags = byte;

				this.packet.Flags = {
					autoLinking: !(byte & 128),
					monitorMode: !!(byte & 64),
					autoLED: !(byte & 32),
					deadman: !(byte & 16)
				}
			}
			else if(this.index === 4){
				if(byte === 0x06){
					this.packet.ack = true;
				}
				else if(byte === 0x15){
					this.packet.ack = false;
				}
			}
		}
	},
	0x6C: class extends Parser {
		/* Packet Meta */
		packetLength = 3;

		/* Packet */
		packet: Packets.GetAllLinkRecordforSender = {
			type: PacketID.GetAllLinkRecordForSender,
			ack: null
		}

		/* Parser */
		parse(byte: Byte){
			/* Moving to next index */
			this.index++;

			/* Determining where to place byte */
			if(byte === 0x06){
				this.packet.ack = true;
			}
			else if(byte === 0x15){
				this.packet.ack = false;
			}
		}
	},
	0x6D: class extends Parser {
		/* Packet Meta */
		packetLength = 3;

		/* Packet */
		packet: Packets.LEDOn = {
			type: PacketID.LEDOn,
			ack: null
		}
		
		/* Parser */
		parse(byte: Byte){
			/* Moving to next index */
			this.index++;

			/* Determining where to place byte */
			if(byte === 0x06){
				this.packet.ack = true;
			}
			else{
				this.packet.ack = false;
			}
		}
	},
	0x6E: class extends Parser {
		/* Packet Meta */
		packetLength = 3;

		/* Packet */
		packet: Packets.LEDOff = {
			type: PacketID.LEDOff,
			ack: null
		}

		/* Parser */
		parse(byte: Byte){
			/* Moving to next index */
			this.index++;

			/* Determining where to place byte */
			if(byte === 0x06){
				this.packet.ack = true;
			}
			else if(byte === 0x15){
				this.packet.ack = false;
			}
		}
	},
	0x6F: class extends Parser {
		/* Packet Meta */
		packetLength = 12;

		/* Packet */
		packet: Packets.ManageAllLinkRecord = {
			type: PacketID.ManageAllLinkRecord,
			controlCode: null,
			flags: null,
			Flags: {
				recordType: null,
			},
			allLinkGroup: null,
			device: [],
			linkData: [],
			ack: null,
		}

		/* Parser */
		parse(byte: Byte){
			/* Moving to next index */
			this.index++;

			/* Determining where to place byte */
			if(this.index === 3){
				this.packet.controlCode = byte;
			}
			else if(this.index === 4){

				this.packet.flags = byte;
				this.packet.Flags = {
					recordType: ((byte & 64) != 0) ? AllLinkRecordType.Controller
					                               : AllLinkRecordType.Responder
				}
			}
			else if(this.index === 5){
				this.packet.allLinkGroup = byte;
			}
			else if(this.index > 5 && this.index < 9){
				this.packet.device.push(byte);
			}
			else if(this.index > 8 && this.index < 12){
				this.packet.linkData.push(byte);
			}
			else if(this.index === 12){
				if(byte === 0x06){
					this.packet.ack = true;
				}
				else if(byte === 0x15){
					this.packet.ack = false;
				}
			}
		}
	},
	0x70: class extends Parser {
		/* Packet Meta */
		packetLength = 4;

		/* Packet */
		packet: Packets.SetNAKMessageByte = {
			type: PacketID.SetNAKMessageByte,
			cmd2:  null,
			ack:  null
		}

		/* Parser */
		parse(byte: Byte){
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
		}
	},
	0x71: class extends Parser {
		/* Packet Meta */
		packetLength = 5;

		/* Packet */
		packet: Packets.SetACKMessageTwoBytes = {
			type: PacketID.SetACKMessageTwoBytes,
			cmd1:  null,
			cmd2:  null,
			ack:  null
		};

		/* Parser */
		parse(byte: Byte){
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
		}
	},
	0x72: class extends Parser {
		/* Packet Meta */
		packetLength = 5;

		/* Packet */
		packet: Packets.RFSleep = {
			type: PacketID.RFSleep,
			cmd1: null,
			cmd2: null,
			ack: null
		}

		/* Parser */
		parse(byte: Byte){
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
		}
	},
	0x73: class extends Parser {
		/* Packet Meta */
		packetLength = 6;

		/* Packet */
		packet: Packets.GetIMConfiguration = {
			type: PacketID.GetIMConfiguration,
			flags: null,
			Flags: {
				autoLED: null,
				autoLinking: null,
				deadman: null,
				monitorMode: null
			},
			ack:  null
		}

		/* Parser */
		parse(byte: Byte){
			/* Moving to next index */
			this.index++;

			/* Determining where to place byte */
			if(this.index === 3){

				this.packet.flags = byte;

				this.packet.Flags = {
					autoLinking: !(byte & 128),
					monitorMode: !!(byte & 64),
					autoLED: !(byte & 32),
					deadman: !(byte & 16)
				}
			}
			else if(this.index === 6){
				if(byte === 0x06){
					this.packet.ack = true;
				}
				else if(byte === 0x15){
					this.packet.ack = false;
				}
			}
		}
	}
};
