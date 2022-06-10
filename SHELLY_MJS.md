central_shutter_switch.js: Central shutter control switch
===
This script can be used for central shutter control. You need a Shelly Plus device with two buttons connected, e.g. the new Shelly Plus I4 or the Shelly Plus 2PM. Once a button is pushed it checks the current state of a "master" shelly and sends a open, stop or close command to the remote Shellies 2.5. The master Shelly is used to determine if there's a open, close or stop command needed. Additional Shellies can be controlled by editing the shutters array.
