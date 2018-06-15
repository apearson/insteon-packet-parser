/* Libraries */
import {Transform} from 'stream';
import {Parsers} from './Parsers';

/* Interfaces and Types */
import * as Packets from './interfaces';
import {Parser} from './Parsers';
import {PacketID, Byte, AllLinkRecordType, MessageSubtype, IMButtonEventType} from './types';

/* Exports */
export {Packets, PacketID, Byte, AllLinkRecordType, MessageSubtype, IMButtonEventType};

export class InsteonParser extends Transform{
	/* Internal Variables */
	private debug: boolean;
	private started: boolean;
	private type: number | undefined;
	private packet: Parser;

	constructor(options = {debug: false, objectMode: true}){
		super(options);

		/* Parser internal variables */
		this.debug = options.debug;
		this.started = false;
		this.type = null;
		this.packet = null;
	}

	_transform(chunk: Buffer, encoding: string, completed: ()=> void){
		if(this.debug){
			console.info(`Got chunk: ${chunk}`);
		}

		/* Splitting chunk into bytes and parsing each individually  */
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

		/* Debug Print out */
		if(this.debug){
			console.info(`Processing: 0x${('0'+(byte).toString(16)).slice(-2).toUpperCase()}, Command: ${command}`);
		}

		/* Determing what needs to happen in packet */
		if(!this.started && byte === 0x02){
			command = 'Starting Packet';
			this.started = true;
		}
		else if(this.started && this.type == null){
			command = 'Grabbing packet type';
			this.type = byte;
			this.packet = new Parsers[byte]();
		}
		else if(this.started && this.packet != null && !this.packet.completed){
			command = 'Grabbing packet info';
			this.packet.parse(byte);
		}
		else{
			command = 'Unknown Data';
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
};
