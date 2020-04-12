# PiWeatherStation

## Start the software

bash install.sh
 
Go to: http://192.168.1.162/

## Usefull Redis commands

```bash
ZADD key [NX|XX] [CH] [INCR] score member [score member ...]
ZCARD key
ZRANGE key start stop [WITHSCORES]
ZRANGEBYSCORE key min max [WITHSCORES] [LIMIT offset count]
```
