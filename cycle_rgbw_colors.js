 /**
 * @copyright shelly-tools contributors
 * @license   GNU Affero General Public License (https://www.gnu.org/licenses/agpl-3.0.de.html)
 * @authors   https://github.com/shelly-tools/shelly-script-examples/graphs/contributors
 *
 * This script is intended to control a Shelly RGBW2 / ShellyDuo RGBW with a single button from
 * a Shelly Plus device. Every time the button from the Plus device is pushed it jumps to the next step 
 * defined in the sequence array. 
 */
 
// CONFIG START
// IP address or hostname from RGBW device
 let REMOTE = {
     ip: '192.168.178.70',
 };

// button sequence 
// The demo sequence is: on and blue with max brightness, then red, green, yellow, purple, off
let sequence = [
    '?turn=on&gain=100&blue=255&red=0&green=0', // blue
    '?turn=on&gain=100&blue=0&red=255&green=0', // red
    '?turn=on&gain=100&blue=0&red=0&green=255', // green
    '?turn=on&gain=100&blue=0&red=255&green=255', // yellow
    '?turn=on&gain=100&blue=225&red=185&green=76', // purple
    '?turn=off' // off
];
// CONFIG END 

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
