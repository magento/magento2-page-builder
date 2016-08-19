(function (factory) {
    if (typeof define === "function" && define.amd) {
        // AMD anonymous module
        define(["knockout", "jquery", "bluefoot/common", 'bluefoot/config'], factory);
    } else if (typeof require === "function" && typeof exports === "object" && typeof module === "object") {
        // CommonJS module
        var ko = require("knockout"),
            jQuery = require("jquery"),
            Common = require("bluefoot/common"),
            Config = require('bluefoot/config');

        factory(ko, jQuery, Common, Config);
    } else {
        // No module loader (plain <script> tag) - put directly in global namespace
        factory(window.ko, window.jQuery, window.Common, window.Config);
    }
})(function (ko, jQuery, Common, Config) {

    var allowedSizes = Config.getInitConfig('column_definitions');

    var Resizable = {
        extendedConfig: {},
        currentColumn: null,
        startingWidth: 0,
        startingX: 0,

        init: function (element, extendedConfig) {
            var context = this;
            this.extendedConfig = extendedConfig;

            jQuery(element)
                .on('mousemove', function (event) {
                    if (!context.currentColumn) {
                        return;
                    }

                    var element = jQuery("#" + context.currentColumn.id),
                        ghostWidth = context.startingWidth + (event.clientX - context.startingX),
                        ghost = element.find(".bluefoot-resize-ghost");

                    // Stop the ghost width exceeding that of the container
                    if (ghostWidth >= element.parent().outerWidth()) {
                        ghostWidth = element.parent().outerWidth();
                    }

                    ghost.width(ghostWidth);

                    jQuery.each(allowedSizes, function (index, size) {
                        var percentage = parseFloat(size.breakpoint).toFixed(3),
                            breakpoint = Math.floor(element.parent().outerWidth() * percentage);

                        // Stop the loop once we hit a valid breakpoint
                        if (ghostWidth >= (breakpoint - 10) && ghostWidth <= (breakpoint + 10)) {
                            context.currentColumn.widthClasses(size.className);
                            return false;
                        }
                    });
                })
                .on('mousedown', extendedConfig.handle, function (event, ui) {
                    context.currentColumn = ko.dataFor(this);
                    context.startingWidth = jQuery(this.parentNode).outerWidth();
                    context.startingX = event.clientX;
                    jQuery(this.parentNode.parentNode).append('<div class="bluefoot-resize-ghost"></div>');
                    return true;
                })
                .on('mouseup', function (event, ui) {
                    context.currentColumn = null;
                    jQuery(".bluefoot-resize-ghost").remove();
                    return true;
                });
        }
    };

    // Create a new sortable Knockout binding
    ko.bindingHandlers.resizable = {

        /**
         * Init the draggable binding on an element
         *
         * @param element
         * @param valueAccessor
         * @param allBindingsAccessor
         * @param data
         * @param context
         */
        init: function (element, valueAccessor, allBindingsAccessor, data, context) {
            Resizable.init(element, valueAccessor());
        }

    };
});