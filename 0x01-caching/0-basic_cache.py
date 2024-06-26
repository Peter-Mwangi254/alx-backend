#!/usr/bin/env python3
"""
Basic caching
"""

BaseCaching = __import__('base_caching').BaseCaching


class BasicCache(BaseCaching):
    """
    class basic caching system
    """
    def put(self, key, item):
        """
        adds item to the cache
        """
        if key and item is not None:
            self.cache_data[key] = item

    def get(self, key):
        """
        return item by key value
        """
        if key is not None:
            return self.cache_data.get(key)
        return None
