let CONFIG = {
    ip: '192.168.<ip.number>', //Hue Bridge IP
    user: '<api-key>', //Hue Bridge API user
    groups: '3', // Hue Groups ID
    input1: 0, // Shelly Switch ID
    recent: false, // has been recently turned on
    recent_sec: 15 // number of seconds to consider recent
};

// Callback to clear recent
function ClearRecent() {
    CONFIG.recent = false
}

// Set Switch detached
Shelly.call("Input.SetConfig", {
    id: CONFIG.input1,
    config: {
        type: "switch",
    },
});

Shelly.call("Switch.SetConfig", {
    id: CONFIG.input1,
    config: {
        in_mode: "detached",
        initial_state: "on"
    },
});


// add an evenHandler 
Shelly.addEventHandler(
    function (event, user_data) {
        if (typeof event.info.state !== 'undefined' && event.info.id === CONFIG.input1) {
            if (event.info.state) {
                if (CONFIG.recent) {
                    SetLight('{"ct": 500, "bri": 254, "on": true}');
                } else {
                    CONFIG.recent = true
                    Timer.set(CONFIG.recent_sec * 1000, false, ClearRecent)
                    SetLight('{"on": true}');
                }
            } else {
                SetLight('{"on": false}');
            }
        }
    },
    null,
);

function SetLight(b) {
    Shelly.call(
        "http.request", {
            method: "PUT",
            url: 'http://'+ CONFIG.ip +'/api/'+ CONFIG.user +'/groups/'+ CONFIG.groups +'/action',
            body: b
        },
        function (r, e, m) {
        },
        null
    );
}
