// this is the remote shelly which we want to control.

let REMOTE = {
    ip: '192.168.178.205',
    relay: '0'
};


// no need to change anything below this line..

Shelly.addEventHandler(
    function (event, user_data) {
        if (typeof event.info.output !== 'undefined') {
            if (event.info.id === 0 && event.info.output === true) {
                Toggle(REMOTE.ip, REMOTE.relay, 'on');
            }

            if (event.info.id === 0 && event.info.output === false) {
                Toggle(REMOTE.ip, REMOTE.relay, 'off'); 
            }                              
        } else {
            return true;
        }
    },
);

function Toggle (ip, relay, command) {
  Shelly.call(
        "http.get",
        { url: 'http://' + ip + '/relay/'+ relay + '?turn=' + command},
        function (response, error_code, error_message, ud) {
            print(JSON.stringify(response));      
        },
        null  
    );
 };