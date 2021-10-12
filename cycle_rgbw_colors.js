 // this is the remote shelly which we want to control.

 let REMOTE = {
     ip: '192.168.178.70',
 };

let sequence = [
    '?turn=on&gain=100&blue=255&red=0&green=0', // blue
    '?turn=on&gain=100&blue=0&red=255&green=0', // red
    '?turn=on&gain=100&blue=0&red=0&green=255', // green
    '?turn=on&gain=100&blue=0&red=255&green=255', // yellow
    '?turn=on&gain=100&blue=225&red=185&green=76', // purple
    '?turn=off' // off
];
 // no need to change anything below this line..
let position = 0;

// add an evenHandler for button type input and single push events
 Shelly.addEventHandler(
     function (event, user_data) {
         //print(JSON.stringify(event));
         if (typeof event.info.event !== 'undefined') {

             if (event.info.event === 'single_push') {
                 setRGBW(REMOTE.ip, position);
                 
                 position++;
                 if (sequence.length === position) {
                   position = 0;
                 }
             } else {
                 return true;

             }
         } else {
             return true;
         }
     },
 );

 // send RBGW command 
 function setRGBW(ip, position) {
     Shelly.call(
         "http.get", {
             url: 'http://' + ip + '/light/0' + sequence[position]
         },
         function (response, error_code, error_message, ud) {
             print(sequence[position]);
         },
         null
     );
 };
