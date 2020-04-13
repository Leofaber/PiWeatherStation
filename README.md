# PiWeatherStation

## Start the software

Turn on the rasperry pi :)

The software will start automagically (start up commands in /etc/rc.local)

Go to: http://192.168.1.162:5000


## Start the software (manually)

```bash
ssh pi@192.168.1.162
source activate piws
nohup node /home/pi/PiWeatherStation/node_server/index.js > pi_weather_station.log &
nohup python -u /home/pi/PiWeatherStation/sensor_io/sensor_capture.py > sensor_capture.log &
```

Go to: http://192.168.1.162:5000
