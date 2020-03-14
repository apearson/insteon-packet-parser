/* Libraries */
import { Transform } from 'stream';
import { Parsers, Parser } from './Parsers';

/* Interfaces and Types */
import * as Packet from './typings/interfaces';
import { Byte, AnyPacket } from './typings/types';
import { PacketID, AllLinkRecordType, MessageSubtype, IMButtonEventType, AllLinkRecordOperation } from './typings/enums';

/* Exports */
export { PacketID, Packet, AnyPacket, Byte, AllLinkRecordType, MessageSubtype, IMButtonEventType, AllLinkRecordOperation };

export class InsteonParser extends Transform {
	/* Internal Variables */
	private debug = false;
	private started = false;
	private type?: number = null;
	private packet: Parser = null;

	constructor(options = { debug: false, objectMode: true }){
		super(options);

		/* Parser internal variables */
		this.debug = options.debug;
	}

	_transform(chunk: Buffer, encoding: string, completed: () => void){
		if(this.debug){
			console.info(`Got chunk: ${chunk}`);
		}

		/* Splitting chunk into bytes and parsing each individually */
		for(let i = 0; i < chunk.length; i++){
			this._parseByte(chunk.readUInt8(i) as Byte);
		}

		/* Telling stream provider we have consumed the provided bytes with no errors*/
		completed();

		if(this.debug){
			console.info('\n');
		}
	}
	_parseByte(byte: Byte){
		let command;

		/* Determing what needs to happen in packet */
		if(!this.started && byte === 0x02){
			command = 'Starting Packet';
			this.started = true;
		}
		else if(this.started && this.type == null && PacketID[byte] != null){
			command = 'Grabbing packet type';
			this.type = byte;
			this.packet = new Parsers[byte]();
		}
		else if(this.started && this.packet != null && !this.packet.completed){
			command = 'Grabbing packet info';
			this.packet.parse(byte);
		}
		else{
			this.started = false;

			command = 'Unknown Data';
		}

		/* Debug Print out */
		if(this.debug){
			console.info(`Processed: 0x${('0'+(byte).toString(16)).slice(-2).toUpperCase()}, Command: ${command} | Index: ${this.packet? this.packet.index: ''} | Length: ${this.packet? this.packet.length: ''} | Bytes Needed: ${this.packet? (this.packet.length - this.packet.index) : ''} | Complete: ${this.packet? this.packet.completed: ''}`);
		}

		/* Checking for packet completed */
		if(this.packet != null && this.packet.completed){
			/* Sending completed packet upstream */
			this.push(this.packet.packet);

			/* Reseting environment for next packet */
			this.started = false;
			this.type = null;
			this.packet = null;
		}
	}
}
