import shutil
from time import time

def send_alive_message(gms):
    total, used, free = shutil.disk_usage("/")
    body = f"[{datetime.today()}]\n\n"+"Status: I'm alive\n\nDisk usage: \n\tTotal: %d GiB\n\tUsed: %d GiB\n\tFree: %d GiB" %((total // (2**30)), (used // (2**30)), (free // (2**30)))
    gms.send_mail_to("leonardo.baroncelli26@gmail.com", "PiWeatherStation status", body)


class Hourglass:
    def __init__(self, capacity_seconds):
        self.start_time = time()
        self.capacity = capacity_seconds

    def restart(self):
        self.start_time = time()

    def is_elapsed(self):
        now = time()
        if now > self.start_time + self.capacity:
            return True
        else:
            return False


class ThresholdCheck:

    def __init__(self, lb, ub):
        self.lb = lb
        self.ub = ub

    def check(self, value):
        if value < self.lb or value > self.ub:
            return True
        else:
            return False
