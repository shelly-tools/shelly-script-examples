let CONFIG = {
    ip: '192.168.178.168', //Hue Bridge IP
    user: 'Xavjfddg0RDVrimm8uiaYm-KlQHdRT6yxlXdq87n', //Hue Bridge API user
    light: '1', // Hue Light ID
    input1: 0, // Shelly Button ID
    btnevent1: 'single_push' //Shelly Button Event
};

// Set Switch detached
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
        initial_state: "on"
    },
});


// add an evenHandler 
Shelly.addEventHandler(
    function (event, user_data) {
        //print(JSON.stringify(event));
        if (typeof event.info.event !== 'undefined') {
            if (event.info.id === CONFIG.input1 && event.info.event === CONFIG.btnevent1) {
                // Get the current light state
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
            } else {
                return true;
            }
        } else {
            return true;
        }
    },
);

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
