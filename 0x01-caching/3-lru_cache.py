#!/usr/bin/env python3
"""
LRU caching
"""
BaseCaching = __import__('base_caching').BaseCaching


class LRUCache(BaseCaching):
    """
    LRU caching
    """
    def __init__(self):
        """
        constructor
        """
        super().__init__()
        self.queue = []

    def put(self, key, item):
        """
        adds item in the cache
        """
        if key and item:
            if key in self.cache_data:
                self.queue.remove(key)
            self.cache_data[key] = item
            self.queue.append(key)
            if len(self.cache_data) > BaseCaching.MAX_ITEMS:
                del_key = self.queue.pop(0)
                del self.cache_data[del_key]
                print("DISCARD: {}".format(del_key))

    def get(self, key):
        """
        return item by key
        """
        if key in self.cache_data:
            self.queue.remove(key)
            self.queue.append(key)
            return self.cache_data[key]
        return None
