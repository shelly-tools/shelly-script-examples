/**
 * @copyright shelly-tools contributors
 * @license   GNU Affero General Public License (https://www.gnu.org/licenses/agpl-3.0.de.html)
 * @authors   https://github.com/shelly-tools/shelly-script-examples/graphs/contributors
 *
 * This script adds a X seconds delayed on and turns the relay off after 5 seconds.
 */

let delayedStart = 3; // seconds for delay
 
// add an evenHandler for button type detached with a button_down event
Shelly.addEventHandler(
    function (event, user_data) {
        if (typeof event.info.event !== 'undefined') {
            if (event.info.id === 0 && event.info.event === 'btn_down') {
                Timer.set(delayedStart * 1000, false, function (ud) {
                  Shelly.call("switch.set",{ id: 0, on: true, toggle_after: 5},function (result, code, msg, ud) {},null);  
                }, null);
            } else {
                return true;
            }
        } else {
            return true;
        }
    },
);