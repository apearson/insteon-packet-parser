/* Libraries */
const { Transform } = require('stream');
const Packet = require('./Packets.js');

module.exports = class InsteonParser extends Transform{
  constructor(options = {debug: false, objectMode: true}){
    super(options);

    /* Parser internal variables */
    this._debug = options.debug;
    this._started = false;
    this._type = null;
    this._packet = null;
  }
  
  _transform(chunk, encoding, completed){
    if(this._debug){
      console.info(`Got chunk: ${chunk}`);
    }

    /* Splitting chunk into bytes and parsing each individually  */
    for(let i = 0; i < chunk.length; i++){
      this._parseByte(chunk.readUInt8(i));
    }

    /* Telling stream provider we have consumed the provided bytes with no errors*/
    completed();
    
    if(this._debug){
      console.info('\n');
    }
  }
  _parseByte(byte, completed){
    let command;

    /* Determing what needs to happen in packet */
    if(!this._started && byte === 0x02){
      command = 'Starting Packet';
      this._started = true;
    }
    else if(this._started && this._type == null){
      command = 'Grabbing packet type';
      this._type = byte;
      this._packet = new Packet[byte]();
    }
    else if(this._started && this._packet != null && !this._packet.completed){
      command = 'Grabbing packet info';
      this._packet.parse(byte);
    }
    else{
      command = 'Unknown Data';
    }
    
    /* Debug Print out */
    if(this._debug){
      console.info(`Processing: 0x${('0'+(byte).toString(16)).slice(-2).toUpperCase()}, Command: ${command}`);
    }

    /* Checking for packet completed */
    if(this._packet != null && this._packet.completed){
      /* Sending completed packet upstream */
      this.push(this._packet.packet);

      /* Reseting environment for next packet */
      this._started = false;
      this._type = null;
      this._packet = null;
    }
  }
};
