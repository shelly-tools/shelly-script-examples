/*
    Credit goes to https://github.com/eurich for laying the groundwork.
    
    Prerequisites:     
        - A wall-mounted button (not a switch) wired to the switch output of a Shelly PM with Firmware 0.10.0 or later
        - The Shelly is in Button and Detached mode, nothing is wired to the consumer output (Script will override this)
        - A Philips Hue Light where the lamp wire is wired directly to phase L ("always on"), which ensures that it will stay reachable for the Hue Bridge
        - Set the Hue Light to restore the last state on power on in the Hue App
        - Gather the informations needed to be inserted in the CONFIG variable

    This Script handles the following scenarios:
        - A "single push" on the wall button or "Toggle" from the app turns the light on or off
        - Each quick "double push" on the wall button cycles through several color or temperature settings (see CONFIG)
        - Each "long push" on the wall button cycles through several brightness settings (pseudo-dimmer)
        
    Tested with:
        - Shelly 1PM / Firmware 0.10.3
*/

/* TO BE SET BY USER */
let CONFIG = {
    // Shelly Button ID                                  
    input0: 0,
    // Hue Bridge IP
    ip: '192.168.0.1',
    // Hue Bridge API user                           
    user: 'ABCDEFGH1234',
    // Hue Light ID
    light: '1',
    // Do you want the long push to change color or the temperature
    isDoublePushColorMode: false,
    // Hue Color value
    colorSequence: [0, 12750, 25500, 46920, 56100, 65280,],
    // Hue Color Temperature in reciprocal megakelvin
    colorTemperatureSequence: [500, 345, 233, 153,],
    // Hue Brightness 0-254    
    brightnessSequence: [254, 174, 94, 14,],
};

/* No customization needed below this */
let STRINGS = {
    shellyEventUndefined: 'undefined',
    shellyEventToggle: 'toggle',
    shellyEventSinglePush: 'single_push',
    shellyEventDoublePush: 'double_push',
    shellyEventLongPush: 'long_push',
    shellyInputSetConfig: 'Input.SetConfig',
    shellySwitchSetConfig: 'Switch.SetConfig',
    shellyButton: 'button',
    shellyDetached: 'detached',
    shellyStateOn: 'on',
    shellyStateOff: 'off',
    httpRequest: 'http.request',
    httpGet: 'GET',
    httpPut: 'PUT',
};

let apiUrl = 'http://' + CONFIG.ip + '/api/' + CONFIG.user + '/lights/' + CONFIG.light;
let apiUrlState = apiUrl + '/state';
let indexSequence = 0;
let indexBrightness = 0;

Shelly.call(STRINGS.shellyInputSetConfig, {
    id: CONFIG.input0,
    config: {
        type: STRINGS.shellyButton,
    },
});

Shelly.call(STRINGS.shellySwitchSetConfig, {
    id: CONFIG.input0,
    config: {
        in_mode: STRINGS.shellyDetached,
        initial_state: STRINGS.shellyStateOn
    },
});

Shelly.addEventHandler(
    function (event, userData) {
        // print(JSON.stringify(event));
        if (typeof event.info.event !== STRINGS.shellyEventUndefined) {
            if (event.info.id === CONFIG.input0 && (event.info.event === STRINGS.shellyEventToggle || event.info.event === STRINGS.shellyEventSinglePush)) {
                Shelly.call(
                    STRINGS.httpRequest, {
                    method: STRINGS.httpGet,
                    url: apiUrl,
                }, function (res, errorCode, errorMessage, ud) {
                    let state;
                    let resJson = JSON.parse(res.body);
                    if (resJson.state.on === true) {
                        state = false;
                    } else {
                        state = true;
                    }
                    CallStateApi(JSON.stringify({ on: state }));
                }, null);
            } else if (event.info.id === CONFIG.input0 && event.info.event === STRINGS.shellyEventDoublePush) {
                if (CONFIG.isDoublePushColorMode === true) {
                    CallStateApi(JSON.stringify({ on: true, hue: CONFIG.colorSequence[indexSequence] }));
                } else {
                    CallStateApi(JSON.stringify({ on: true, ct: CONFIG.colorTemperatureSequence[indexSequence] }));
                }
                indexSequence++;
                ResetIndex();
            } else if (event.info.id === CONFIG.input0 && event.info.event === STRINGS.shellyEventLongPush) {
                if (CONFIG.brightnessSequence.length === indexBrightness) {
                    indexBrightness = 0;
                }
                CallStateApi(JSON.stringify({ on: true, bri: CONFIG.brightnessSequence[indexBrightness] }));
                indexBrightness++;
                ResetIndex();
            } else {
                return true;
            }
        } else {
            return true;
        }
    });

function CallStateApi(state) {
    Shelly.call(
        STRINGS.httpRequest, {
        method: STRINGS.httpPut,
        url: apiUrlState,
        body: state
    }, function (res, errorCode, errorMessage) { }, null);
}

function ResetIndex() {
    if (CONFIG.colorSequence.length === indexSequence || CONFIG.colorTemperatureSequence.length === indexSequence) {
        indexSequence = 0;
    }
}
