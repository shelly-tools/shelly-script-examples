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
// a remote URL with just a few bytes of content in order to check if internet is still available.
let remoteurl = 'https://gist.githubusercontent.com/eurich/6e84e85c11401c4e28a2676492d846b7/raw/5d577bc2dfadfa13887f9b2ec146fe1b2ee2f5b6/gistfile1.txt';
// number of times the check is done before internet is considered as down.
let maxfails = 5;
// checks the internet connection every x minutes, recommended is 5 or more
let interval = 5;
// CONFIG END

// no need to change anything below this line.
let alertTimer = '';
let failcounter = 0;
function startMonitor() {
    alertTimer = Timer.set(interval *60 * 1000,
        true,
        function () {
            Shelly.call("HTTP.GET", {
                    url: remoteurl
                },
                function (res, error_code, error_msg, ud) {
                    if (error_code !== 0) {                  
                       if (failcounter === maxfails) {
                            print("Restart");
                            restartRelay();
                            failcounter = 0;
                        } else {
                           print("fail");
                            failcounter++;
                        }
                    }
                },
                null
            );
        },
        null
    );
}

function restartRelay() {
    Shelly.call(
        "switch.set",
        { id: 0, on: false, toggle: 2},
        function (result, code, msg, ud) {
        },
        null
    );
}
startMonitor();