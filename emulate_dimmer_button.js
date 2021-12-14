/**
 * @copyright shelly-tools contributors
 * @license   GNU Affero General Public License (https://www.gnu.org/licenses/agpl-3.0.de.html)
 * @authors   https://github.com/shelly-tools/shelly-script-examples/graphs/contributors
 *
 * This script is intended to remote control a Shelly Dimmer / Dimmer2 and emulates the locally conencted button.
 * short_press = on/off toggle, double_press = on with 100% brightness, long_press cylce between dimming and brightening.
 */
 
// CONFIG START
// IP address or hostname from Shelly Dimmer device
let REMOTE = {
    ip: '192.168.178.240',
};
// CONFIG END 

let dim = false;

// add an evenHandler for button type input and various push events
Shelly.addEventHandler(
    function (event, user_data) {
        //print(JSON.stringify(event));
        if (typeof event.info.event !== 'undefined') {
           if (dim === true && event.info.event === 'btn_up') {
               dim = false;
               print("release");
               Shelly.call(
                   "http.get", {
                       url: 'http://' + REMOTE.ip + '/light/0?dim=stop'
                   },
                   function (response, error_code, error_message, ud) {},
                   null
               );
           }

           if (event.info.event === 'single_push') {
               Shelly.call(
                   "http.get", {
                       url: 'http://' + REMOTE.ip + '/light/0?turn=toggle'
                   },
                   function (response, error_code, error_message, ud) {},
                   null
               );
           } else if (event.info.event === 'double_push') {
               Shelly.call(
                   "http.get", {
                       url: 'http://' + REMOTE.ip + '/light/0?turn=on&brightness=100'
                   },
                   function (response, error_code, error_message, ud) {},
                   null
               );
           } else if (event.info.event === 'long_push') {
                   dim = true;
                   print("cycle");
                   Shelly.call(
                       "http.get", {
                           url: 'http://' + REMOTE.ip + '/light/0?dim=cycle'
                       },
                       function (response, error_code, error_message, ud) {},
                       null
                   );

               } else {
                   return true;
            }
        } else {
            return true;
        }
    },
);