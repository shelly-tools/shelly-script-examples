
/**
 * @copyright shelly-tools contributors
 * @license   GNU Affero General Public License (https://www.gnu.org/licenses/agpl-3.0.de.html)
 * @authors   https://github.com/shelly-tools/shelly-script-examples/graphs/contributors
 *
 * This script is intended to measure power consumption from the local device, e.g. a Shelly Plus 1PM,
 * and send a telegram push notification once the power consumption stops for a given time period.
 * the idea behind is to monitor a washing machine or dryer and send a notification once the appliance
 * has finished.
 */

// CONFIG START

// your telegram api key
let telegramApiKey = 'YOUR API KEY HERE';

// your telegram chat id to push notifications
let telegramChatID = 'YOUR CHAT ID HERE';

// the text for the notification once the appliance has finished
let telegramText = 'Washing machine has finished!';

// the number of consecutive times the check will run until the appliance is considered as finished power consumption has to be below "minUsage" 
let timesInactive = 5; // in minutes

// minimum watts usage .. above this value the appliance is considered as "started".. 
// below this value and timesInactive is reached the appliance is considered as finished. 
let minUsage = 10; // Watts

// CONFIG END 


// Do not change code below this line!
let countInactive = 0;
let alertTimer = null;
let active = false;
let stopped = false;


function startMonitor() {
    alertTimer = Timer.set(60 * 1000,
        true,
        function () {
            Shelly.call(
                "switch.getStatus",
                { id: 0 },
                function (res, error_code, error_msg, ud) {
                   if (res.apower > minUsage) {
                        countInactive = 0;
                        activate();
                    }
                    if (active) {
                        isReady(res.apower);
                    }

                },
                null
            );
        },
        null
    );
}

function activate() {
    if (active === false) {
        active = true;
        print('appliance started');
    }
}

function isReady(usage) {
    if (active && usage < minUsage) {
        countInactive = countInactive + 1;
    }
    if (active && countInactive > timesInactive) {
        countInactive = 0;
        active = false;
        sendTelegramMessage();
        print('appliance finished');
    }
}

function sendTelegramMessage() {
    Shelly.call(
        "http.get", {
            url: 'https://api.telegram.org/bot' + telegramApiKey + '/sendMessage?chat_id=' + telegramChatID + '&text="' + telegramText + '"'
        },
        function (response, error_code, error_message, ud) {
            print(JSON.stringify(response));
        },
        null
    );
};

startMonitor();
