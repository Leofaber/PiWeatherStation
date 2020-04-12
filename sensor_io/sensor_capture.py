import numpy as np
from time import sleep, time
from datetime import datetime, timedelta
from abc import ABC, abstractmethod
from threading import Timer

import redis
import Adafruit_DHT

class SensorIO(ABC):

    def __init__(self, read_out_time, aggregation_time):
        self.read_out_time = read_out_time
        self.aggregation_time = aggregation_time

    @abstractmethod
    def read(self):
        pass

    @abstractmethod
    def aggregate(self):
        pass

class DHT22(SensorIO):

    def __init__(self, aggregation_time):
        super().__init__(2.5,  aggregation_time)

    def aggregate(self, temp, hum):
        return round(temp.mean(), 1), round(hum.mean(), 1), time()


    def read(self):

        temp = np.array([])
        hum = np.array([])
        time_s = time()
        elapsed = 0

        while True:

            sleep(self.read_out_time)

            if elapsed >= self.aggregation_time:

                return self.aggregate(temp, hum)

            humidity, temperature = Adafruit_DHT.read_retry(sensor, pin)

            if humidity is not None and temperature is not None:

                # print("Temp={0:0.1f}*C Humidity={1:0.1f}%".format(temperature, humidity))
                temp = np.append(temp, temperature)
                hum = np.append(hum, humidity)

            else:

                print(f"[DHT22] [{datetime.today()}] Failed to get reading. Try again!")

            elapsed = time() - time_s
            # print("elapsed: ",elapsed)


class RedisClient:

    def __init__(self):

        self.r = redis.Redis(host='localhost', port=6379, db=0)

    def save_value_zset(self, key, value, timestamp):

        elem_key = str(value)+":"+str(timestamp)

        mapping = {
            elem_key : float(timestamp)
        }

        # print(f"[RedisClient] Saving {mapping} in {key} zset")

        return self.r.zadd(key, mapping, nx=True)


def get_countdown():
    x = datetime.today()
    y = x + timedelta(hours=6)
    delta_t = y-x
    return delta_t.total_seconds()


def output_diagnostic_info():
    print(f"[sensor_capture] [{datetime.today()}] I'm alive! temp values: {insert_counter_temp}  hum values: {insert_counter_hum}")

# global variables
insert_counter_temp = 0
insert_counter_hum = 0

if __name__ == "__main__":

    print(f"[sensor_capture] [{datetime.today()}] Starting!")

    sensor = Adafruit_DHT.DHT22

    pin = 12 # GPIO12

    dht22 = DHT22(aggregation_time = 60)

    rc = RedisClient()

    output_diagnostic_info()

    elapsed = 0
    time_s = time()
    output_diagnostic_seconds = get_countdown()

    try:

        while True:

            if elapsed >= output_diagnostic_seconds:

                output_diagnostic_info()


            temp, hum, timeutc = dht22.read()

            if rc.save_value_zset("temperature", temp, timeutc) == 1:
                insert_counter_temp += 1

            if rc.save_value_zset("humidity", hum, timeutc) == 1:
                insert_counter_hum += 1

            elapsed = time() - time_s

    except KeyboardInterrupt:

        print("Script end!")
