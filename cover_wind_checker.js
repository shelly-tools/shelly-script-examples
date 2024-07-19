/**
 * @copyright shelly-tools contributors
 * @license   GNU Affero General Public License (https://www.gnu.org/licenses/agpl-3.0.de.html)
 * @authors   https://github.com/shelly-tools/shelly-script-examples/graphs/contributors
 *
 * This script is intended to control a Shelly Pro Dual Cover / Shelly PLUS 2PM
 * The srcipt periodically check the wind speed from weatherapi.com and opens the outloor blids 
 * when the wind or gust is greather than a threshold.
 * (The cover position is also checked before open to avoid needless open command)
 * My script is run on Shelly Pro Dual Cover so it controls two outoor blinds, so open
 * both when wind alert triggered.
 */

console.log("Wind checker starting...");
//http://api.weatherapi.com/v1/current.json?key=YOUR_WEATHERAPICOM_APIKEY&q=YOURLOCATION&aqi=no

// CONFIG START
let CONFIG = {
  weatherApiKey: "YOUR_WEATHERAPICOM_APIKEY",
  weatherCurrentEndpoint:
    "http://api.weatherapi.com/v1/current.json",
  location: "Budapest",
  checkinterval_sec_time: 300,
  windspeed_threshold: 60,
  windspeedgust_threshold: 70,
  need_open_threshold: 98,
};
// CONFIG END

let userdata = null;
let ticktimer_handler = null;

function getWeatherURL() {
  return (
    CONFIG.weatherCurrentEndpoint + 
    "?key=" + CONFIG.weatherApiKey +
    "&q=" + CONFIG.location +
    "&aqi=no");
}

function tick_stage1(humantime)
{
  check_wind_speed(humantime);
}

function start_ticker()
{
  if(ticktimer_handler != null)
    return;
  ticktimer_handler = Timer.set(CONFIG.checkinterval_sec_time*1000,true,function(userdata) {
    Shelly.call("Sys.GetStatus", "",function(c) 
    { 
      tick_stage1(c["time"]);
    },null);
  } , userdata);
}

function stop_ticker()
{
  if(ticktimer_handler != null)
  {
    Timer.clear(ticktimer_handler);
    ticktimer_handler= null;
  }
}

function windy_alert_reached(humantime)
{
  //Check and close outdoor blind/cover one:
  check_cover_position(0,humantime);
  //Check and close outdoor blind/cover two:
  check_cover_position(1,humantime);
}

function check_wind_speed(humantime)
{
  //console.log("Call: "+ getWeatherURL());
  Shelly.call(
    "http.get",
    { url: getWeatherURL() , timeout: 20},
    function (response, error_code, error_message) {
      if(response == null)
        return;
      let weatherData = JSON.parse(response.body);
      print(humantime+" - Wind: "+ weatherData.current.wind_kph + " km/h, Gust: " + weatherData.current.gust_kph + " km/h");
      if(weatherData.current.wind_kph > CONFIG.windspeed_threshold ||
         weatherData.current.gust_kph > CONFIG.windspeedgust_threshold)
      {
         windy_alert_reached(humantime);
         return;
      }   
    },
  );
}  

function cover_open(coverId)
{
  Shelly.call(
    "COVER.Open",
    { id: coverId},
    function (response) {
      print("Cover open! ("+coverId+")");
    },
  );
}

function check_cover_position(coverId,humantime)
{
  Shelly.call(
    "COVER.GetStatus",
    { id: coverId},
    function (response) {
      print("Current-pos("+coverId+"):" + response.current_pos);
      if(response.current == "0" && response.current_pos < CONFIG.need_open_threshold)
        cover_open(coverId);
    },
  );
}

start_ticker();
tick_stage1("StartCheck");
//end script.
