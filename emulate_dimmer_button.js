/**
 * @copyright shelly-tools contributors
 * @license   GNU Affero General Public License (https://www.gnu.org/licenses/agpl-3.0.de.html)
 * @authors   https://github.com/shelly-tools/shelly-script-examples/graphs/contributors
 *
 * This script is intended to remote control a Shelly Dimmer / Dimmer2 and emulates the locally connected button.
 * short_press = on/off toggle, double_press = on with 100% brightness, long_press cylce between dimming and brightening.
 */

// CONFIG START
// IP address / hostname from Shelly Dimmer device
let REMOTE = {
    ip: '192.168.178.166',
    input: 2, // ID from the push button: 0 for Shelly Plus 1 / Plus 1 PM or 0,1,2 or 3 for the Shelly I4.

};
// CONFIG END 

let dim = false;
let up = false;

// add an evenHandler for button type input and various push events
Shelly.addEventHandler(
    function (event, user_data) {
        //print(JSON.stringify(event));
        if (typeof event.info.event !== 'undefined') {
            if (dim === true && event.info.event === 'btn_up' && event.info.id === REMOTE.input) {
                dim = false;
                print("release");
                Shelly.call(
                    "http.get", {
                    url: 'http://' + REMOTE.ip + '/light/0?dim=stop'
                },
                    function (response, error_code, error_message, ud) { },
                    null
                );
            }

            if (event.info.event === 'single_push' && event.info.id === REMOTE.input) {
                Shelly.call(
                    "http.get", {
                    url: 'http://' + REMOTE.ip + '/light/0?turn=toggle'
                },
                    function (response, error_code, error_message, ud) { },
                    null
                );
            } else if (event.info.event === 'double_push' && event.info.id === REMOTE.input) {
                Shelly.call(
                    "http.get", {
                    url: 'http://' + REMOTE.ip + '/light/0?turn=on&brightness=100'
                },
                    function (response, error_code, error_message, ud) { },
                    null
                );
            } else if (event.info.event === 'long_push' && event.info.id === REMOTE.input) {
                dim = true;

                if (up === true) {
                    up = false;
                    Shelly.call(
                        "http.get", {
                        url: 'http://' + REMOTE.ip + '/light/0?dim=down&step=100'
                    },
                        function (response, error_code, error_message, ud) { },
                        null
                    );

                } else {
                    up = true;
                    Shelly.call(
                        "http.get", {
                        url: 'http://' + REMOTE.ip + '/light/0?dim=up&step=100'
                    },
                        function (response, error_code, error_message, ud) { },
                        null
                    );

                }
                print("cycle");


            } else {
                return true;
            }
        } else {
            return true;
        }
    },
);
