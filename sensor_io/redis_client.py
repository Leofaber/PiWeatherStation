import json
import redis

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
