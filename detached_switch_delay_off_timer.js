/**
 * @copyright shelly-tools contributors
 * @license   GNU Affero General Public License (https://www.gnu.org/licenses/agpl-3.0.de.html)
 * @authors   https://github.com/shelly-tools/shelly-script-examples/graphs/contributors
 *
 * This script is intended to control a Shelly Pro / PLUS series with a switch input.
 * Controls a house facade/sidewalk lamp which previously equipped with alternate switches.
 * This scipts works with detached switch mode. It adds a cancellable switch off delay.
 * Switching on is works immediately when the position of the switch is changed.
 * (Regardless of open or close state!)
 * If the switch position is changed when the lamp is on the predefined delay off is started.
 * In case the switch position is changed again, the lamp immediately switch off.
 * 
 * The delay off value is stored in key-value store of shelly device.
 * You can set this value by call:
 *   Shelly.call("KVS.Set",{ "key": "offdelay", "value": "30"},null);
 */

let off_delay = 15; //from KVS: offdelay
let userdata = null;
let in_wait = false;
let delayoff_timer_handler = null;

function switch_on_switch0()
{
  Shelly.call("Switch.Set","{ id:0 , on:true}",null,null);
}

function switch_off_switch0()
{
  Shelly.call("Switch.Set","{ id:0 , on:false}",null,null);
}

function delayed_off_swtich0()
{
  //print("Timer fired");
  in_wait = false;
  delayoff_timer_handler = null;
  switch_off_switch0();
}

function btncallback(userdata)
{
  //print("Event: ",JSON.stringify(userdata));
  if(userdata.info.component == "input:0" && userdata.info.event == "toggle")
  {
    current_status = Shelly.getComponentStatus("switch:0");
    if(current_status.output)
    {
      if(in_wait)
      {
        if(delayoff_timer_handler != null)
        {
          //print("Clear timer");
          Timer.clear(delayoff_timer_handler);
          delayoff_timer_handler = null;
        }
        switch_off_switch0();
        in_wait = false;
        return;
      }
      in_wait = true;
      //print("Start timer");
      delayoff_timer_handler = Timer.set(1000*off_delay,false,delayed_off_swtich0);
      return;
    }
    else 
    {
      switch_on_switch0();
      Shelly.call("KVS.Get",{ "key": "offdelay"},function(result) {
        off_delay = parseInt(result.value);  
        //print("Set off_delay to:",off_delay);      
      });
      return;
    }
  }
}

Shelly.addEventHandler(btncallback,userdata);
//end code.
