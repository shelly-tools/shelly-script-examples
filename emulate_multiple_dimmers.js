/**
 * @copyright shelly-tools contributors
 * @license   GNU Affero General Public License (https://www.gnu.org/licenses/agpl-3.0.de.html)
 * @authors   https://github.com/shelly-tools/shelly-script-examples/graphs/contributors
 *
 * This script is intended to remote control a Shelly Dimmer / Dimmer2 and emulates the locally conencted button.
 * short_press = on/off toggle, double_press = on with 100% brightness, long_press cylce between dimming and brightening.
 */

// Array of dimmers to be controlled
let dimmer = [
    '192.168.178.166', // dimmer controlled with button 0 
    '192.168.178.240', // dimmer controlled with button 1 
];
// CONFIG END 

let dimstate = [
    false,
    false,
    false,
    false,
];
// add an evenHandler for button type input and various push events
Shelly.addEventHandler(
    function (event) {
        if (typeof event.info.event !== 'undefined') {
            let i = event.info.id;

            if (typeof dimmer[i] !== 'undefined') {

                if (dimstate[i] === true && event.info.event === 'btn_up') {
                    dimstate[i] = false;
                    print("release");
                    Shelly.call(
                        "http.get", {
                        url: 'http://' + dimmer[i] + '/light/0?dim=stop'
                    },
                        function (response, error_code, error_message, ud) { },
                        null
                    );
                }

                if (event.info.event === 'single_push') {
                    Shelly.call(
                        "http.get", {
                        url: 'http://' + dimmer[i] + '/light/0?turn=toggle'
                    },
                        function (rs, ec, em) { },
                        null
                    );
                } else if (event.info.event === 'double_push') {
                    Shelly.call(
                        "http.get", {
                        url: 'http://' + dimmer[i] + '/light/0?turn=on&brightness=100'
                    },
                        function (rs, ec, em) { },
                        null
                    );
                } else if (event.info.event === 'long_push') {
                    dimstate[i] = true;
                    print("cycle");
                    Shelly.call(
                        "http.get", {
                        url: 'http://' + dimmer[i] + '/light/0?dim=cycle'
                    },
                        function (rs, ec, em) { },
                        null
                    );

                } else {
                    return true;
                }
            }
        } else {
            return true;
        }
    },
);