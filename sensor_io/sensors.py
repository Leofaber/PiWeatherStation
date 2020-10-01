import numpy as np
from time import sleep
from datetime import datetime
from abc import ABC, abstractmethod
import Adafruit_DHT

class SensorIO(ABC):

    def __init__(self, read_out_time, debug):
        self.read_out_time = read_out_time
        self.debug = debug

    @abstractmethod
    def read(self):
        pass


class DHT22(SensorIO):

    def __init__(self, sensor_pin, debug):
        super().__init__(2.5, debug)
        self.sensor = Adafruit_DHT.DHT22
        self.temp = np.array([])
        self.hum = np.array([])
        self.read_out_time = 2.5
        self.sensor_pin = sensor_pin


    def get_aggregated_data(self):

        now = datetime.now()

        t, h, ts = round(self.temp.mean(), 1), round(self.hum.mean(), 1), now.timestamp()

        self.temp = np.array([])
        self.hum = np.array([])

        if self.debug == 1:
            print(f"{t} {h} {ts} -> {now}")

        return t, h, ts


    def read(self):

        sleep(self.read_out_time)

        humidity, temperature = Adafruit_DHT.read_retry(self.sensor, self.sensor_pin)

        if humidity is not None and temperature is not None:

            if self.debug == 2:
                print("[DHT22] Read out: {0:0.1f}*C {1:0.1f}%".format(temperature, humidity))

            self.temp = np.append(self.temp, temperature)
            self.hum  = np.append(self.hum, humidity)

            return [temperature], [humidity], [datetime.now().timestamp()]

        else:

            print(f"[DHT22] [{datetime.today()}] Failed to get reading. Try again!")

            return None, None, datetime.now().timestamp()
