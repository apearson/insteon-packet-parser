# InsteonPacketParser
A simple Insteon packet parser to be used by [Node Serialport](https://github.com/EmergingTechnologyAdvisors/node-serialport) and a PowerLinc Modem (PLM) library or program. This library and it's API are still in beta and should not be trusted not to change until v1.

If you see any problems, have any advice, or want to help out please open an issue. 

##Examples

####Send Command and read replies
```js
const InsteonPacketParser = require('insteon-packet-parser');

/* Open serial port */
const port = new SerialPort('/dev/tty.usbserial-A60336ZZ', {
  baudRate: 19200,
  parser: InsteonPacketParser.parser,
});

/* On data packet */
port.on('packet', (packet) => {
  console.log(packet);
  
  /* Result
    { 
      type: 'Get IM Configuration',
      autoLinking: true,
      monitorMode: true,
      autoLED: true,
      deadman: true,
      success: true 
    } 
  /*
});

/* On serial port opened send command */
port.on('open', () => {
  const buf = Buffer.alloc(2);
        buf.writeUInt8(0x02, 0);
        buf.writeUInt8(0x73,1);
        
  port.write(buf, (error) => {
    if(error){
      console.log(`Error: ${error}`);
    }
  });
}
```
