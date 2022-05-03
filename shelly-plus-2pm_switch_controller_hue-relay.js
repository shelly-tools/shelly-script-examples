let CONFIG = {
    ip: '10.0.0.1', //Hue Bridge IP
    user: 'abcdef', //Hue Bridge API user

    cmd: {
        "single_push": {
            "0": {
                "relay" : 0 // Shelly Relay Channel 0
            },
            "1": {
                "relay" : 1 // Shelly Relay Channel 1
            }
        },
        "double_push": {
            "0": {
                "hue": {
                    "type" : "groups",
                    "id": "2" // Esstisch
                }
            },
            "1": {
                "hue": {
                    "type" : "groups",
                    "id": "1" // Wohnzimmer
                }
            }
        }
    }
};

// Set Switch detached 0

Shelly.call("Input.SetConfig", {
    id: 0,
    config: {
        type: "button",
    },
});

Shelly.call("Switch.SetConfig", {
    id: 0,
    config: {
        in_mode: "detached",
        initial_state: "restore_last"
    },
});

// Set Switch detached 1

Shelly.call("Input.SetConfig", {
    id: 1,
    config: {
        type: "button",
    },
});

Shelly.call("Switch.SetConfig", {
    id: 1,
    config: {
        in_mode: "detached",
        initial_state: "restore_last"
    },
});


// add an evenHandler 
Shelly.addEventHandler(
    function (event, user_data) {
        let cmds = null;
        print(JSON.stringify(event));
        if (typeof event.info.event !== 'undefined' && typeof(CONFIG.cmd[event.info.event]) !== "undefined") {
            cmds = CONFIG.cmd[event.info.event];
            if (typeof cmds[event.info.id] !== "undefined" ) {
                if (typeof cmds[event.info.id]["relay"] === "number") {
                    // switch relay
                    Shelly.call(
                        "Switch.Toggle",
                        {
                            id: cmds[event.info.id]["relay"]
                        },
                        function (result, code, msg, ud) {},
                        null
                    );  
                }
                else if (typeof cmds[event.info.id]["hue"] === "object") {
                    toggleHue(
                        cmds[event.info.id]["hue"]["type"],
                        cmds[event.info.id]["hue"]["id"]
                    );
                }
                else {
                    return true;
                }
            } else {
                return true;
            }
        } else {
            return true;
        }
    }
);

function toggleHue(_type, _id) {
    Shelly.call(
        "http.request", {
            method: "GET",
            url: 'http://' + CONFIG.ip + '/api/' + CONFIG.user + '/' + _type + '/' + _id,
        },
        function (res, error_code, error_message, ud) {
            let st = JSON.parse(res.body);
            let onOff = (st.state.any_on === true || st.state.on === true) ? "false" : "true";
            let b = '{"on": ' + onOff + '}';
            let action = ud.type === "groups" ? "action" : "state";
            Shelly.call(
                "http.request", {
                    method: "PUT",
                    url: 'http://' + CONFIG.ip + '/api/' + CONFIG.user + '/' + ud.type + '/' + ud.id + '/' + action,
                    body: b
                },
                function (r, e, m) {
                },
                null
            );
        },
        {
            type: _type,
            id: _id
        }
    );
}

