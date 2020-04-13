# PiWeatherStation

## Start the softwares

```bash
nohup node /home/pi/PiWeatherStation/node_server/index.js > pi_weather_station.log &
nohup python -u /home/pi/PiWeatherStation/sensor_io/sensor_capture.py > sensor_capture.log &
```

Go to: http://192.168.1.162:5000
