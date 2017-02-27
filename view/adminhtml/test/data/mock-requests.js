define([], function () {
    return {
        /**
         * /testConfig mock request for testing config.js
         *
         * @param params
         * @returns {*}
         */
        '/testConfig': function (params) {
            if (typeof params.entityIds === 'object') {
                return {
                    success: true,
                    responseText: '{"1":true}'
                };
            }

            return {
                success: true,
                responseText: '{"success":true}'
            };
        }
    }
});