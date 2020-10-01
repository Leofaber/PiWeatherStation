import yaml
from pathlib import Path
from datetime import datetime

from sensors import DHT22
from redis_client import RedisClient
from mail_sender import GoogleMailSender
from utils import send_alive_message, Hourglass, ThresholdCheck


if __name__ == "__main__":

    print(f"[sensor_capture] [{datetime.today()}] Starting!")

    config_file = Path(__file__).parent.absolute().joinpath("configuration/conf.yml")
    with open(config_file, 'r') as yamlfile:
        config = yaml.safe_load(yamlfile)

    debug = config["debug"]
    sensor_pin = config["sensor_pin"]
    aggregation_time = config["aggregation_time"]
    im_alive_countdown_sec = config["im_alive_countdown_sec"]

    dht22 = DHT22(sensor_pin = sensor_pin, debug = debug)
    rc = RedisClient()
    gms = GoogleMailSender()

    aggregation_hourglass = Hourglass(aggregation_time)
    alive_hourglass = Hourglass(im_alive_countdown_sec)

    opt_temp_tc = ThresholdCheck(config["lb_opt_temp"], config["ub_opt_temp"])
    crit_temp_tc = ThresholdCheck(config["lb_crit_temp"], config["ub_crit_temp"])

    opt_hum_tc = ThresholdCheck(config["lb_opt_hum"], config["ub_opt_hum"])
    crit_hum_tc = ThresholdCheck(config["lb_crit_hum"], config["ub_crit_hum"])

    disk_space_tc = ThresholdCheck(config["disk_space_gb"], 100000)

    while True:

        if alive_hourglass.is_elapsed():
            send_alive_message(gms)
            alive_hourglass.restart()

        temp, hum, timeutc = dht22.read()

        rc.publish("data-stream", {"data_time" : timeutc, "data_t" : temp, "data_h" : hum})

        if aggregation_hourglass.is_elapsed():
            temp, hum, timeutc = dht22.get_aggregated_data()
            rc.save_value_zset("temperature", temp, timeutc)
            rc.save_value_zset("humidity", hum, timeutc)
            aggregation_hourglass.restart()

    print(f"[sensor_capture] [{datetime.today()}] Ending!")
