central_shutter_switch.js: Central shutter control switch
===
This script can be used for central shutter control. You need a Shelly Plus device with two buttons connected, e.g. the new Shelly Plus I4 or the Shelly Plus 2PM. Once a button is pushed it checks the current state of a "master" shelly and sends a open, stop or close command to the remote Shellies 2.5. The master Shelly is used to determine if there's a open, close or stop command needed. Additional Shellies can be controlled by editing the shutters array.


emulate_dimmer_button.js: Remote Control for Shelly Dimmer 
===
This script is intended to remote control a Shelly Dimmer / Dimmer2 and emulates the locally connected button. short_press = on/off toggle, double_press = on with 100% brightness, long_press cylce between dimming and brightening.


delayed_on_off.js: Delayed on with auto off example
===
This script adds a X seconds delayed on and turns the relay off after 5 seconds. Values for on and off can be configured.


control_rgbw.js: Control a shelly RGBW2 or Shelly Duo RBGW
===
This script is a more complex example how to control a Shelly RGBW or a Shelly Duo RGBW via script. Single push is used to turn on/off the device, double push rotates between a predifined set of colours, long push is used to dim the device via 20% steps.


cycle_rgbw_colors.js: Color rotation example for Shelly RGBW2/Shelly Duo RGBW
===
The script is a simple example how to rotate colors from a Shelly RGBW2/Shelly Duo RGBW via single push.