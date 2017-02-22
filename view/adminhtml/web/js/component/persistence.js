/**
 * persistence.js
 * Abstracts localStorage for testing and future replacement
 * @method getItem(key)
 * @method setItem(key, value)
 * @method removeItem(key)
 * @method keys()
 */

define([], function() {
    return {
        getItem: function(key) {
            return localStorage.getItem(key);
        },
        setItem: function(key, value) {
            return localStorage.setItem(key, value);
        },
        removeItem: function(key) {
            return localStorage.removeItem(key);
        },
        keys: function() {
            return Object.keys(localStorage);
        }
    }
});
