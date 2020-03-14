
interface Mapping {
	[key: number]: string;
}

const MessageTypeMap: Mapping = {
	/* Commands Sent from an IM to the Host */
	0x15: 'Modem Not Ready',
	0x50: 'Standard Message Received',
	0x51: 'Extended Message Received',
	0x52: 'X10 Received',
	0x53: 'All Linking Completed',
	0x54: 'Button Event Report',
	0x55: 'User Reset Detected',
	0x56: 'All Link Cleanup Failure Report',
	0x57: 'All Link Record Response',
	0x58: 'All Link Cleanup Status Report',

	/* Commands Sent from the Host to an IM */
	0x60: 'Get IM Info',
	0x61: 'Send All Link Command',
	0x62: 'Send Insteon Message',
	0x63: 'Send X10',
	0x64: 'Start All Linking',
	0x65: 'Cancel All Linking',
	0x66: 'Set Host Device Category',
	0x67: 'Reset IM',
	0x68: 'SetACK Message Byte',
	0x69: 'Get First All Link Record',
	0x6A: 'Get Next All Link Record',
	0x6B: 'Set IM Configuration',
	0x6C: 'Get All Link Record For Sender',
	0x6D: 'LED On',
	0x6E: 'LED Off',
	0x6F: 'Manage All Link Record',
	0x70: 'Set NAK Message Byte',
	0x71: 'Set ACK Message Two Bytes',
	0x72: 'RF Sleep',
	0x73: 'Get IM Configuration',
};

const MessageSubtypeMap: Mapping = {
	0x00: 'Direct Message',
	0x01: 'ACK of Direct Message',
	0x02: 'Group Cleanup Direct Message',
	0x03: 'ACK of Group Cleanup Direct Message',
	0x04: 'Broadcast Message',
	0x05: 'NAK of Direct Message',
	0x06: 'Group Broadcast Message',
	0x07: 'NAK of Group Cleanup Direct Message',
};

const AllLinkRecordTypeMap: Mapping = {
	0x00: 'Responder',
	0x01: 'Controller',
};

const AllLinkRecordOperationMap: Mapping = {
	0x00: 'FindFirst',
	0x01: 'FindNext',
	0x20: 'ModifyFirstFoundOrAdd',
	0x40: 'ModifyFirstControllerFoundOrAdd',
	0x41: 'ModifyFirstResponderFoundOrAdd',
	0x80: 'DeleteFirstFound',
};

const IMButtonEventTypeMap: Mapping = {
	/* Set Button */
	0x02: 'SetButtonTapped',
	0x03: 'SetButtonHeld',
	0x04: 'SetButtonReleasedAfterHold',

	/* Button 2 */
	0x12: 'Button2Tapped',
	0x13: 'Button2Held',
	0x14: 'Button2ReleasedAfterHold',

	/* Button 3 */
	0x22: 'Button3Tapped',
	0x23: 'Button3Held',
	0x24: 'Button3ReleasedAfterHold',
};

export {
	MessageTypeMap,
	MessageSubtypeMap,
	AllLinkRecordTypeMap,
	AllLinkRecordOperationMap,
	IMButtonEventTypeMap
};