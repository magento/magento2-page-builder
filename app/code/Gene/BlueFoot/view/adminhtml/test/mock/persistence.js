/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */
/**
 * Mock localStorage for persistence and testing side effects.
 */

define([], function() {
    var storage = {};
    return {
        getItem: function(key) {
            return storage[key];
        },
        setItem: function(key, value) {
            return storage[key] = value;
        },
        removeItem: function(key) {
            delete storage[key];
        },
        keys: function() {
            return Object.keys(storage);
        },
        _storage: storage
    };
});