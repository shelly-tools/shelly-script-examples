 let CONFIG = {
    ip: '192.168.178.168', //Hue Bridge IP
    user: 'S4DAeeXgjRj92sTwu7uNm6m7cqCz0dAyDNaDi0IO', //Hue Bridge API user
    light: '2', // Hue Light ID
    input1: 0, // Shelly Button ID
    btnevent1: 'single_push', //Shelly Button Event
    btnevent2: 'double_push' //Change color
};
let sequence = [
 '{"on": true, "hue": 0}',
  '{"on": true, "hue": 15000}',
   '{"on": true, "hue": 50000}',

  
];
let position = 0;

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
            } else if (event.info.id === CONFIG.input1 && event.info.event === CONFIG.btnevent2) {
              changeColor(sequence[position]);
              position++;
                if (sequence.length === position) {
                    position = 0;
                }
            } else {
                return true;
            }
        } else {
            return true;
        }
    },
);

function Toggle(state) {
    let b = '{"on": ' + state + ', "hue": 15000, "saturation": 120}';

    Shelly.call(
        "http.request", {
        method: "PUT",
        headers: {
            "hue-application-key": "S4DAeeXgjRj92sTwu7uNm6m7cqCz0dAyDNaDi0IO"
         },
        url: 'http://' + CONFIG.ip + '/clip/v2/resource/light/' + CONFIG.light,
        body: b
    },
        function (r, e, m) {
        },
        null
    );
}

function changeColor(s) {
  Shelly.call(
        "http.request", {
        method: "PUT",
        url: 'http://' + CONFIG.ip + '/api/' + CONFIG.user + '/lights/' + CONFIG.light + '/state',
        body: s
    },
        function (r, e, m) {
        },
        null
    );
}