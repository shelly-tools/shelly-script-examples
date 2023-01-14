/**
 * @copyright shelly-tools contributors
 * @license   GNU Affero General Public License (https://www.gnu.org/licenses/agpl-3.0.de.html)
 * @authors   https://github.com/shelly-tools/shelly-script-examples/graphs/contributors
 *
 * This script is intended to toggle on/Off a Light connected to a Phillips HuE Bridge.
 * 
 */

// CONFIG START
let CONFIG = {
    ip: '192.168.178.168', //Hue Bridge IP
    user: 'Y0NXhTgbfcZYk0dSrTB70Va0XSZKFJdUYJcAj4bp', //Hue Bridge API user
    light: '4', // Hue Light ID
    input1: 0, // Shelly switch ID
};
// CONFIG END


Shelly.addStatusHandler(function (e) {
    if (e.delta.id === CONFIG.input1) {
        Shelly.call(
            "http.request", {
            method: "GET",
            url: 'http://' + CONFIG.ip + '/api/' + CONFIG.user + '/lights/' + CONFIG.light,
        },
            function (res, error_code, error_message, ud) {
                let st = JSON.parse(res.body);
                if (st.state.on === true) {
                    Toggle("false");
                } else {
                    Toggle("true");
                }
            },
            null
        );
    }
});

function Toggle(state) {
    let b = '{"on": ' + state + '}';

    Shelly.call(
        "http.request", {
        method: "PUT",
        url: 'http://' + CONFIG.ip + '/api/' + CONFIG.user + '/lights/' + CONFIG.light + '/state',
        body: b
    },
        function (r, e, m) {

        },
        null
    );
} 