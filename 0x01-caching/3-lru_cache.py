#!/usr/bin/env python3

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
        if key and item is None:
            return

        if key in self.cache_data:
            self.queue.remove(key)
        elif len(self.cache_data) >= BaseCaching.MAX_ITEMS:
            discard = self.queue.pop(0)
            del self.cache_data[discard]
            print("DISCARD:", discard)

        self.cache_data[key] = item
        self.queue.append(key)

    def get(self, key):
        """
        return item by key
        """
        if key is None or key not in self.cache_data:
            return None

        self.queue.remove(key)
        self.queue.append(key)

        return self.cache_data[key]
