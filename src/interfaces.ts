import {Byte} from './types';

export interface Packet{
	id: number;
	type: string;
	[key: string]: any;
}
export interface DevicePacketData extends Packet{
	from: Byte[];
	to: Byte[];
	flags: Byte;
	maxHops: number;
	hopsLeft: number;
	extended: boolean;
	meaning: string;
	cmd1: Byte;
	cmd2: Byte;
}
export interface StandardMessageRecieved extends DevicePacketData{
}
export interface ExtendedMessageRecieved extends DevicePacketData{
	extendedData: Byte[];
}
export interface x10Recieved extends Packet{
	rawX10: Byte;
	X10Flag: Byte;
}
export interface AllLinkingCompleted extends Packet{
	linkCode:  Byte;
	allLinkGroup: Byte;
	from:  Byte[];
	devcat: Byte;
	subcat: Byte;
	firmware: Byte;
}
export interface ButtonEventReport extends Packet{
	event: Byte;
	meaning: Byte;
}
export interface UserResetDetected extends Packet{
}
export interface AllLinkCleanupFailureReport extends Packet{
	allLinkGroup: Byte;
	device: Byte[];
}
export interface AllLinkRecordResponse extends Packet{
	recordType: Byte;
	allLinkGroup: Byte;
	from: Byte[];
	linkData: Byte[];
}
export interface AllLinkCleanupStatusReport extends Packet{
	status: Byte;
}
export interface GetIMInfo extends Packet{
	ID: Byte[];
	devcat: Byte;
	subcat: Byte;
	firmware: Byte;
	success: Byte;
}
export interface SendAllLinkCommand extends Packet{
	allLinkGroup: Byte;
	allLinkCommand:  Byte;
	broadcastCommand2: Byte;
	success: Byte;
}
export interface SendInsteonMessage extends Packet{
	to: Byte[];
	flags: Byte;
	cmd1: Byte;
	cmd2: Byte;
	success: Byte;
}
export interface SendX10 extends Packet{
	rawX10: Byte;
	X10Flag: Byte;
	success: Byte;
}
export interface StartAllLinking extends Packet{
	linkCode:  Byte;
	allLinkGroup:  Byte;
	success:  Byte;
}
export interface CancelAllLinking extends Packet{
	success: Byte;
}
export interface SetHostDeviceCategory extends Packet{
	devcat: Byte;
	subcat: Byte;
	firmware: Byte;
	success: Byte;
}
export interface ResetIM extends Packet{
	success: Byte;
}
export interface SetACKMessageByte extends Packet{
	cmd2: Byte;
	success: Byte;
}
export interface GetFirstAllLinkRecord extends Packet{
	success: Byte;
}
export interface GetNextAllLinkRecord extends Packet{
	success: Byte;
}
export interface SetIMConfiguration extends Packet{
	autoLinking: Byte;
	monitorMode: Byte;
	autoLED: Byte;
	deadman: Byte;
	success:  Byte;
}
export interface GetAllLinkRecordforSender extends Packet{
	success: Byte;
}
export interface LEDOn extends Packet{
	success: Byte;
}
export interface LEDOff extends Packet{
	success: Byte;
}
export interface ManageAllLinkRecord extends Packet{
	controlCode: Byte;
	recordType: Byte;
	allLinkGroup: Byte;
	device: Byte[];
	linkData: Byte[];
	success: Byte;
}
export interface SetNAKMessageByte extends Packet{
	cmd2: Byte;
	success: Byte;
}
export interface SetACKMessageTwoBytes extends Packet{
	cmd1: Byte;
	cmd2: Byte;
	success: Byte;
}
export interface RFSleep extends Packet{
	cmd1: Byte;
	cmd2: Byte;
	success: Byte;
}
export interface GetIMConfiguration extends Packet{
	autoLinking: Byte;
	monitorMode: Byte;
	autoLED: Byte;
	deadman: Byte;
	success: Byte;
}