define([
    'bluefoot/config',
    'bluefoot/block/preview/abstract'
], function(config, abstract) {
    var loaded = false,
        instances = {};

    var previews = function() {};

    previews.load = function() {
        if( loaded === false ) {

            var contentTypes = config.getInitConfig("contentTypes"),
                templates = [],
                keyNames = [];

            for(var key in contentTypes) {
                if( typeof contentTypes[key]['preview_block'] === 'string' ) {
                    templates.push( contentTypes[key]['preview_block'] );
                    keyNames.push( key );
                }
            }

            require(templates, function() {
                for (var arg = 0; arg < arguments.length; ++ arg) {
                    instances[ keyNames[arg] ] = arguments[arg];
                }
            });

            loaded = true;
        }
    };

    previews.get = function(block) {
        block = block.code;

        if( typeof instances[ block ] === 'undefined' ) {
            return abstract;
        }

        return instances[ block ];
    };

    return previews;
});