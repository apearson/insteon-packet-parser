/* Libraries */
import { PacketID, AllLinkRecordType } from './enums';
import { Byte } from './types';

export interface Packet {
	type: PacketID;
	[key: string]: any;
}
export interface DeviceMessage extends Packet {
	from: Byte[];
	to: Byte[];
	flags: Byte;
	Flags: {
		maxHops: number;
		hopsLeft: number;
		extended: boolean;
		subtype: number;
	};
	cmd1: Byte;
	cmd2: Byte;
}
export interface StandardMessageRecieved extends DeviceMessage {
}
export interface ExtendedMessageRecieved extends DeviceMessage {
	extendedData: Byte[];
}
export interface x10Recieved extends Packet {
	rawX10: Byte;
	X10Flag: Byte;
}
export interface AllLinkingCompleted extends Packet {
	linkCode: Byte;
	allLinkGroup: Byte;
	from:  Byte[];
	devcat: Byte;
	subcat: Byte;
	firmware: Byte;
}
export interface ButtonEventReport extends Packet {
	event: Byte;
}
export interface UserResetDetected extends Packet {
}
export interface AllLinkCleanupFailureReport extends Packet {
	allLinkGroup: Byte;
	device: Byte[];
}
export interface AllLinkRecordResponse extends Packet {
	flags: Byte;
	Flags: {
		inUse: boolean;
		recordType: AllLinkRecordType;
	};
	allLinkGroup: Byte;
	from: Byte[];
	linkData: Byte[];
}
export interface AllLinkCleanupStatusReport extends Packet {
	status: boolean;
}
export interface GetIMInfo extends Packet {
	ID: Byte[];
	devcat: Byte;
	subcat: Byte;
	firmware: Byte;
	ack: boolean;
}
export interface SendAllLinkCommand extends Packet {
	allLinkGroup: Byte;
	allLinkCommand:  Byte;
	broadcastCommand2: Byte;
	ack: boolean;
}
export interface SendInsteonMessage extends Packet {
	to: Byte[];
	flags: Byte;
	cmd1: Byte;
	cmd2: Byte;
	ack: boolean;
}
export interface SendX10 extends Packet {
	rawX10: Byte;
	X10Flag: Byte;
	ack: boolean;
}
export interface StartAllLinking extends Packet {
	linkCode:  Byte;
	allLinkGroup:  Byte;
	ack: boolean;
}
export interface CancelAllLinking extends Packet {
	ack: boolean;
}
export interface SetHostDeviceCategory extends Packet {
	devcat: Byte;
	subcat: Byte;
	firmware: Byte;
	ack: boolean;
}
export interface ResetIM extends Packet {
	ack: boolean;
}
export interface SetACKMessageByte extends Packet {
	cmd2: Byte;
	ack: boolean;
}
export interface GetFirstAllLinkRecord extends Packet {
	ack: boolean;
}
export interface GetNextAllLinkRecord extends Packet {
	ack: boolean;
}
export interface SetIMConfiguration extends Packet {
	flags: Byte;
	Flags: {
		autoLinking: boolean;
		monitorMode: boolean;
		autoLED: boolean;
		deadman: boolean;
	};
	ack: boolean;
}
export interface GetAllLinkRecordforSender extends Packet {
	ack: boolean;
}
export interface LEDOn extends Packet {
	ack: boolean;
}
export interface LEDOff extends Packet {
	ack: boolean;
}
export interface ManageAllLinkRecord extends Packet {
	controlCode: Byte;
	flags: Byte;
	Flags: {
		recordType: AllLinkRecordType;
	};
	allLinkGroup: Byte;
	device: Byte[];
	linkData: Byte[];
	ack: boolean;
}
export interface SetNAKMessageByte extends Packet {
	cmd2: Byte;
	ack: boolean;
}
export interface SetACKMessageTwoBytes extends Packet {
	cmd1: Byte;
	cmd2: Byte;
	ack: boolean;
}
export interface RFSleep extends Packet {
	cmd1: Byte;
	cmd2: Byte;
	ack: boolean;
}
export interface GetIMConfiguration extends Packet {
	flags: Byte; 
	Flags: {
		autoLinking: boolean;
		monitorMode: boolean;
		autoLED: boolean;
		deadman: boolean;
	};
	ack: boolean;
}