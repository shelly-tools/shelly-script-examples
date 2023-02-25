/**
* @copyright shelly-tools contributors
* @license   GNU Affero General Public License (https://www.gnu.org/licenses/agpl-3.0.de.html)
* @authors   https://github.com/shelly-tools/shelly-script-examples/graphs/contributors
*
* This script can be used to monitor the connection to the internet and restart the local relay
* if the connection fails for a configurable time. Perfect use case would be a router restart.
*/

// CONFIG START
let CONFIG = {
    // a remote URL with just a few bytes of content in order to check if internet is still available.
    remoteurl: 'https://global.gcping.com/ping',
    maxfails: 5, // number of times the check is done before internet is considered as down.
    interval: 5, // checks the internet connection every x minutes, recommended is 5 or more
}
// CONFIG END

// internal vars and functions, no need to change anything below this line.
let alertTimer = '';
let failcounter = 0;

function startMonitor() {
    alertTimer = Timer.set(CONFIG.interval * 60 * 1000, true, function () {
        Shelly.call("HTTP.GET", {
            url: CONFIG.remoteurl
        }, function (res, error_code, error_msg, ud) {
            if (error_code !== 0) {
                if (failcounter === CONFIG.maxfails) {
                    Shelly.call("Switch.set", { id: 0, on: false, toggle_after: 2 });
                    failcounter = 0;
                } else {
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
startMonitor();