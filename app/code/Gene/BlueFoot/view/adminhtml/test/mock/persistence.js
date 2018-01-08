/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */
/**
 * Mock localStorage for persistence and testing side effects.
 */

define([], function() {
    'use strict';
    var storage = {};

    return {
        getItem: function(key) {
            return storage[key];
        },
        setItem: function(key, value) {
            storage[key] = value;
            return storage[key];
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