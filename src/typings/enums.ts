export enum AllLinkRecordType {
	Responder  = 0x00,
	Controller = 0x01,
}

export enum AllLinkRecordOperation {
	FindFirst                       = 0x00,
	FindNext                        = 0x01,
	ModifyFirstFoundOrAdd           = 0x20,
	ModifyFirstControllerFoundOrAdd = 0x40,
	ModifyFirstResponderFoundOrAdd  = 0x41,
	DeleteFirstFound                = 0x80,
}

export enum PacketID {
	/* Commands Sent from an IM to the Host */
	ModemNotReady               = 0x15,
	StandardMessageReceived     = 0x50,
	ExtendedMessageReceived     = 0x51,
	X10Received                 = 0x52,
	AllLinkingCompleted         = 0x53,
	ButtonEventReport           = 0x54,
	UserResetDetected           = 0x55,
	AllLinkCleanupFailureReport = 0x56,
	AllLinkRecordResponse       = 0x57,
	AllLinkCleanupStatusReport  = 0x58,

	/* Commands Sent from the Host to an IM */
	GetIMInfo                 = 0x60,
	SendAllLinkCommand        = 0x61,
	SendInsteonMessage        = 0x62,
	SendX10                   = 0x63,
	StartAllLinking           = 0x64,
	CancelAllLinking          = 0x65,
	SetHostDeviceCategory     = 0x66,
	ResetIM                   = 0x67,
	SetACKMessageByte         = 0x68,
	GetFirstAllLinkRecord     = 0x69,
	GetNextAllLinkRecord      = 0x6A,
	SetIMConfiguration        = 0x6B,
	GetAllLinkRecordForSender = 0x6C,
	LEDOn                     = 0x6D,
	LEDOff                    = 0x6E,
	ManageAllLinkRecord       = 0x6F,
	SetNAKMessageByte         = 0x70,
	SetACKMessageTwoBytes     = 0x71,
	RFSleep                   = 0x72,
	GetIMConfiguration        = 0x73,
}

export enum MessageSubtype {
	DirectMessage                  = 0x00,
	ACKofDirectMessage             = 0x01,
	GroupCleanupDirectMessage      = 0x02,
	ACKofGroupCleanupDirectMessage = 0x03,
	BroadcastMessage               = 0x04,
	NAKofDirectMessage             = 0x05,
	GroupBroadcastMessage          = 0x06,
	NAKofGroupCleanupDirectMessage = 0x07,
}

export enum IMButtonEventType {
	/* Set Button */
	SetButtonTapped            = 0x02,
	SetButtonHeld              = 0x03,
	SetButtonReleasedAfterHold = 0x04,

	/* Button 2 */
	Button2Tapped            = 0x12,
	Button2Held              = 0x13,
	Button2ReleasedAfterHold = 0x14,

	/* Button 3 */
	Button3Tapped            = 0x22,
	Button3Held              = 0x23,
	Button3ReleasedAfterHold = 0x24,
}

export enum CommandType {
	RemoteExitLinkingMode    = 0x08,
	RemoteEnterLinkingMode   = 0x09,
	INSTEONEngineVersion     = 0x0D,
	RemoteEnterUnLinkingMode = 0x0A,
	Ping                     = 0x0F,
	IDRequest                = 0x10,
	On                       = 0x11,
	Off                      = 0x13,
	StatusRequest            = 0x19,
	SetProperty              = 0x20,
	GetForGroupButton        = 0x2E,
	ReadConfigurationByte    = 0x1F,
	Beep                     = 0x30,
	DirectGroupOn            = 0x32,
	DirectGroupOff           = 0x33,

}