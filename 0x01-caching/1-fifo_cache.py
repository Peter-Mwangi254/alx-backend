#!/usr/bin/env python3
"""
class FIFOCache that inherits from
BaseCaching and is a caching system
"""


BaseCaching = __import__('base_caching').BaseCaching


class FIFOCache(BaseCaching):
    """
    FIFO cache system
    """
    def __init__(self):
        """Constructor"""
        super().__init__()
        self.order = []

    def put(self, key, item):
        """
        adds item to the cache
        """
        if key and item is not None:
            if key not in self.cache_data:
                self.order.append(key)
            self.cache_data[key] = item
            if len(self.cache_data) > BaseCaching.MAX_ITEMS:
                first_key = self.order.pop(0)
                del self.cache_data[first_key]
                print("DISCARD:", first_key)

    def get(self, key):
        """
        return item by key value
        """
        return self.cache_data.get(key)
