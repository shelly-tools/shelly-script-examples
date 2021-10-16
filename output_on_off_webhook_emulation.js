 /**
 * @copyright shelly-tools contributors
 * @license   GNU Affero General Public License (https://www.gnu.org/licenses/agpl-3.0.de.html)
 * @authors   https://github.com/shelly-tools/shelly-script-examples/graphs/contributors
 *
 * This script is a simple webhook emulation. If a local relay from a plus device is turned on
 * it will turn on the relay from a remote Shelly. If the local relay is turned off it will also 
 * turn off the remote relay.
 * 
 */
 
// CONFIG START
// this is the remote shelly which we want to control.

let REMOTE = {
    ip: '192.168.178.205',
    relay: '0'
};
// CONFIG END

// no need to change anything below this line..

Shelly.addEventHandler(
    function (event, user_data) {
        if (typeof event.info.output !== 'undefined') {
            if (event.info.id === 0 && event.info.output === true) {
                Toggle(REMOTE.ip, REMOTE.relay, 'on');
            }

            if (event.info.id === 0 && event.info.output === false) {
                Toggle(REMOTE.ip, REMOTE.relay, 'off'); 
            }                              
        } else {
            return true;
        }
    },
);

function Toggle (ip, relay, command) {
  Shelly.call(
        "http.get",
        { url: 'http://' + ip + '/relay/'+ relay + '?turn=' + command},
        function (response, error_code, error_message, ud) {
            print(JSON.stringify(response));      
        },
        null  
    );
 };