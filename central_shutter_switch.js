 /**
 * @copyright shelly-tools contributors
 * @license   GNU Affero General Public License (https://www.gnu.org/licenses/agpl-3.0.de.html)
 * @authors   https://github.com/shelly-tools/shelly-script-examples/graphs/contributors
 *
 * This script can emulate a cycle switch for a remote Shelly 2.5 in roller shutter mode
 * with a Shelly Plus device.
 * Once the button is pushed it checks the former direction and sends a open, stop or close 
 * command to the remote Shelly 2.5.
 */
 
// CONFIG START
let CONFIG = {
    ip: '192.168.178.209', // Remote Shelly (master) to check current state which can be stop or moving
    input1: 0, // Input for first direction
    btnevent1: 'single_push', // input event for first direction
    direction1: 'open', // direction
    input2: 1, 
    btnevent2: 'single_push',
    direction2: 'close',
};

// additinal Shutters 
let shutters = [
    '192.168.178.204', // Shutter Lving room door
    '192.168.178.206',
];
// CONFIG END

function getCurrentState(ip, direction) {
    print(direction);
    Shelly.call(
        "http.get", {
            url: 'http://' + ip + '/roller/0'
        },
        function (res, error_code, error_message, direction) {
            print(direction);
            if (res.code === 200) {
                let st = JSON.parse(res.body);
                if (st.state === 'stop') {
                    controlShutter(CONFIG.ip, direction);
                    print("move shutter");
                    for (let i=0; i<shutters.length; i++) {
                      controlShutter(shutters[i], direction);
                    }
                } else {
                    controlShutter(CONFIG.ip, 'stop');
                    print("stop shutter");
                    for (let i=0; i<shutters.length; i++) {
                      controlShutter(shutters[i], 'stop');
                    }
                }
            }
        },
        direction
    );
};
// no need to change anything below this line..

// add an evenHandler for button type input and single push events
Shelly.addEventHandler(
    function (event, user_data) {
        //print(JSON.stringify(event));
        if (typeof event.info.event !== 'undefined') {
            if (event.info.id === CONFIG.input1 && event.info.event === CONFIG.btnevent1) {
                getCurrentState(CONFIG.ip, CONFIG.direction1);
            } else if (event.info.id === CONFIG.input2 && event.info.event === CONFIG.btnevent2) {
                getCurrentState(CONFIG.ip, CONFIG.direction2);
            }else {
                return true;
            }
        } else {
            return true;
        }
    },
);

// query a remote shelly and determine if next step is open, stop or close
// send shutter command 
function controlShutter(ip, command) {
    Shelly.call(
        "http.get", {
            url: 'http://' + ip + '/roller/0?go=' + command
        },
        function (response, error_code, error_message, ud) {

        },
        null
    );
};