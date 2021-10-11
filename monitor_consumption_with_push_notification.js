// CONFIG START
// IP from the remote shelly plug / plug-s we'd like to monitor
let remoteip = '192.168.178.205';

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
            Shelly.call("HTTP.GET", {
                    url: 'http://' + remoteip + '/status'
                },
                function (res, error_code, error_msg, ud) {
                    if (res.code === 200) {
                        let st = JSON.parse(res.body);
                        let current = st.meters[0].power;
                        if (current > minUsage) {
                            countInactive = 0;
                            activate();
                        }
                        if (active) {
                            isReady(current);
                        }
                    };
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