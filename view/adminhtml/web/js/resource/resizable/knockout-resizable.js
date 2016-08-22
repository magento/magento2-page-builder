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

    var allowedSizes = Config.getInitConfig('column_definitions'),
        largestColumn = {breakpoint: 0},
        smallestColumn = {breakpoint: 1};

    // Determine the largest and smallest columns
    for (var i = 0; i < allowedSizes.length; i++) {
        if (allowedSizes[i].breakpoint > largestColumn.breakpoint) {
            largestColumn = allowedSizes[i];
        }
        if (allowedSizes[i].breakpoint < smallestColumn.breakpoint) {
            smallestColumn = allowedSizes[i];
        }
    }

    var largestPercentage = parseFloat(largestColumn.breakpoint).toFixed(3),
        smallestPercentage = parseFloat(smallestColumn.breakpoint).toFixed(3);

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
                        ghost = element.find(".bluefoot-resize-ghost"),
                        biggestWidth = Math.floor(element.parent().outerWidth() * largestPercentage) - 6,
                        smallestWidth = Math.floor(element.parent().outerWidth() * smallestPercentage) - 6;

                    // Stop the ghost width exceeding that of the container
                    if (ghostWidth >= biggestWidth) {
                        ghostWidth = biggestWidth;
                    }
                    if (ghostWidth <= smallestWidth) {
                        ghostWidth = smallestWidth;
                    }

                    ghost.width(ghostWidth);

                    jQuery.each(allowedSizes, function (index, size) {
                        var percentage = parseFloat(size.breakpoint).toFixed(3),
                            breakpoint = Math.floor(element.parent().outerWidth() * percentage);

                        // Stop the loop once we hit a valid breakpoint
                        if (ghostWidth >= (breakpoint - 15) && ghostWidth <= (breakpoint + 15)) {
                            element.find('.bluefoot-resize-size').text(size.label);
                            context.currentColumn.widthClasses(size.className);
                            return false;
                        }
                    });
                })
                .on('mousedown', extendedConfig.handle, function (event, ui) {
                    context.currentColumn = ko.dataFor(this);
                    context.startingWidth = jQuery(this.parentNode).outerWidth();
                    context.startingX = event.clientX;
                    jQuery(this.parentNode.parentNode).addClass('bluefoot-resizing');
                    jQuery(this.parentNode.parentNode).append(jQuery('<div />').addClass('bluefoot-resize-ghost'));
                    jQuery(this.parentNode.parentNode).find('.element-children').first().append(jQuery('<div />').addClass('bluefoot-resize-size'));

                    // If the mouse leaves the window kill the bluefoot resizing functionality
                    jQuery('body').mouseleave(function () {
                        context.currentColumn = null;
                        jQuery('.bluefoot-resizing').removeClass('bluefoot-resizing');
                        jQuery('.bluefoot-resize-ghost').fadeOut(200);
                        jQuery('.bluefoot-resize-size').fadeOut(200);
                    });

                    return true;
                })
                .on('mouseup', function (event, ui) {
                    context.currentColumn = null;
                    jQuery('.bluefoot-resizing').removeClass('bluefoot-resizing');
                    jQuery('.bluefoot-resize-ghost').fadeOut(200);
                    jQuery('.bluefoot-resize-size').fadeOut(200);
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