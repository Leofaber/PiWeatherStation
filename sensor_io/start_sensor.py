import numpy as np
from time import sleep, time
from datetime import datetime
from abc import ABC, abstractmethod

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

    def __init__(self):
        super().__init__(2.5,  10)

    def aggregate(self, temp, hum):
        return temp.mean(), hum.mean(), datetime.utcnow()


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

                print("Temp={0:0.1f}*C Humidity={1:0.1f}%".format(temperature, humidity))
                temp = np.append(temp, temperature)
                hum = np.append(hum, humidity)

            else:

                print("Failed to get reading. Try again!")

            elapsed = time() - time_s
            print("elapsed: ",elapsed)



if __name__ == "__main__":

    sensor = Adafruit_DHT.DHT22

    pin = 12 # GPIO12

    print("[press ctrl+c to end the script]")

    dht22 = DHT22()

    try:

        while True:

            temp, hum, timeutc = dht22.read()

            print(f"Temp={temp}*C Humidity={hum} Time={timeutc}")

    except KeyboardInterrupt:

        print("Script end!")
