 // this is the remote shelly which we want to control.

 let REMOTE = {
     ip: '192.168.178.209',
 };

 // no need to change anything below this line..

// add an evenHandler for button type input and single push events
 Shelly.addEventHandler(
     function (event, user_data) {
         //print(JSON.stringify(event));
         if (typeof event.info.event !== 'undefined') {

             if (event.info.event === 'single_push') {
                 getCurrentState(REMOTE.ip);
             } else {
                 return true;

             }
         } else {
             return true;
         }
     },
 );

 // query a remote shelly and determine if next step is open, stop or close
 function getCurrentState(ip) {
     Shelly.call(
         "http.get", {
             url: 'http://' + ip + '/roller/0'
         },
         function (res, error_code, error_message, ud) {
             if (res.code === 200) {
                 let st = JSON.parse(res.body);
                 if (st.state === 'stop' && st.last_direction === 'close') {
                     controlShutter(REMOTE.ip, 'open');
                     print("open shutter");
                 } else if (st.state === 'stop' && st.last_direction === 'open') {
                     controlShutter(REMOTE.ip, 'close');
                     print("close shutter");
                 } else {
                     controlShutter(REMOTE.ip, 'stop');
                     print("stop shutter");
                 }
             }
         },
         null
     );
 };

 // send shutter command 
 function controlShutter(ip, command) {
     Shelly.call(
         "http.get", {
             url: 'http://' + ip + '/roller/0?go=' + command
         },
         function (response, error_code, error_message, ud) {
             print(command);
         },
         null
     );
 };