import numpy as np
from time import sleep, time
from datetime import datetime, timedelta
from abc import ABC, abstractmethod
from threading import Timer
import json

import redis
import Adafruit_DHT

class SensorIO(ABC):

    def __init__(self, read_out_time, aggregation_time, debug):
        self.read_out_time = read_out_time
        self.aggregation_time = aggregation_time
        self.debug = debug

    @abstractmethod
    def read(self):
        pass

    @abstractmethod
    def aggregate(self):
        pass

class DHT22(SensorIO):

    def __init__(self, aggregation_time, debug):
        super().__init__(2.5,  aggregation_time, debug)
        self.temp = np.array([])
        self.hum = np.array([])

    def aggregate(self):
        now = datetime.now()
        t, h, ts = round(self.temp.mean(), 1), round(self.hum.mean(), 1), now.timestamp()
        self.temp = np.array([])
        self.hum = np.array([])
        if self.debug == 1:
            print(f"{t} {h} {ts} -> {now}")
        return t, h, ts


    def read(self, aggregate = False):

        sleep(self.read_out_time)

        humidity, temperature = Adafruit_DHT.read_retry(sensor, pin)

        if humidity is not None and temperature is not None:

            if self.debug == 2:
                print("[DHT22] Read out: {0:0.1f}*C {1:0.1f}%".format(temperature, humidity))

            self.temp = np.append(self.temp, temperature)
            self.hum  = np.append(self.hum, humidity)


        if aggregate:

            return self.aggregate()

        elif humidity is not None and temperature is not None:

            return [temperature], [humidity], [datetime.now().timestamp()]

        else:

            print(f"[DHT22] [{datetime.today()}] Failed to get reading. Try again!")

            return None, None, datetime.now().timestamp()




class RedisClient:

    def __init__(self):

        self.r = redis.Redis(host='localhost', port=6379, db=0)

    def publish(self, channel, msg):

        self.r.publish(channel, json.dumps(msg))

    def save_value_zset(self, key, value, timestamp):

        elem_key = str(value)+":"+str(timestamp)

        mapping = {
            elem_key : float(timestamp)
        }

        # print(f"[RedisClient] Saving {mapping} in {key} zset")

        return self.r.zadd(key, mapping, nx=True)


"""
def get_countdown():
    x = datetime.today()
    y = x + timedelta(hours=6)
    delta_t = y-x
    return delta_t.total_seconds()
def output_diagnostic_info():
    print(f"[sensor_capture] [{datetime.today()}] I'm alive! temp values: {insert_counter_temp}  hum values: {insert_counter_hum}")
"""


# global variables
insert_counter_temp = 0
insert_counter_hum = 0

if __name__ == "__main__":

    print(f"[sensor_capture] [{datetime.today()}] Starting!")

    sensor = Adafruit_DHT.DHT22

    pin = 12 # GPIO12

    debug = 0

    dht22 = DHT22(aggregation_time = 60, debug=debug)

    rc = RedisClient()

    #output_diagnostic_info()

    #elapsed = 0
    #time_s = time()
    #output_diagnostic_seconds = get_countdown()

    start_t = time()
    elapsed_time_for_aggregation = 0

    try:

        while True:

            if debug == 1:
                print("\n[sensor_capture] New iteration..")

            #if elapsed >= output_diagnostic_seconds:

                #output_diagnostic_info()

            if debug == 1:
                print("[sensor_capture] Polling sensor for 60 seconds..")

            if elapsed_time_for_aggregation >= dht22.aggregation_time:

                temp, hum, timeutc = dht22.read(aggregate=True)

                if rc.save_value_zset("temperature", temp, timeutc) == 1:
                    insert_counter_temp += 1

                if rc.save_value_zset("humidity", hum, timeutc) == 1:
                    insert_counter_hum += 1

                start_t = time()
                elapsed_time_for_aggregation = 0

            else:

                temp, hum, timeutc = dht22.read(aggregate=False)

                data_msg = {
                    "data_time" : timeutc,
                    "data_t" : temp,
                    "data_h" : hum
                }

                rc.publish("data-stream", data_msg)

                elapsed_time_for_aggregation = time() - start_t


    except KeyboardInterrupt:

        print(f"Script end -> {datetime.today()}")
