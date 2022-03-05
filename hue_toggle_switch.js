let CONFIG = {
    ip: '192.168.178.168', //Hue Bridge IP
    user: 'S4DAeeXgjRj92sTwu7uNm6m7cqCz0dAyDNaDi0IO', //Hue Bridge API user
    light: '2', // Hue Light ID
    input1: 0, // Shelly Button ID
};

// Set Switch detached
Shelly.call("Input.SetConfig", {
    id: 0,
    config: {
        type: "switch",
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
       
        if (typeof event.info.state !== 'undefined') {
          if (event.info.id === CONFIG.input1) {
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