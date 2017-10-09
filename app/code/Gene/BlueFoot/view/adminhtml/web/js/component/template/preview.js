/**
 * UI Field component to generate an image of the stage.
 * @author Aidan Threadgold <aidan@gene.co.uk>
 */
define([
    'Magento_Ui/js/form/element/abstract',
    'jquery',
    'uiRegistry',
    'Gene_BlueFoot/js/resource/html2canvas'
], function (AbstractField, $, registry) {
    'use strict';

    return AbstractField.extend({
        noPreviewLoaded: true,

        initObservable: function () {
            this._super();
            this.observe('noPreviewLoaded');

            setTimeout(function() {
                this.buildPreview();
            }.bind(this), 100);

            return this;
        },

        reset: function() {
            this.value(null);
            this.noPreviewLoaded(true);
        },

        /**
         * Build the preview image
         */
        buildPreview: function() {
            var stage = registry.get(this.stageNameSpace).stage,
                stageEl = $('#' + stage.id());

            // hide the add button
            stageEl.addClass("screengrab");
            stageEl.css("height", stageEl.width());

            html2canvas(document.getElementById(stage.id()), {
                onrendered: function (canvas) {
                    stageEl.removeClass("screengrab").height('auto');

                    //Shrink the canvas a bit to save space.
                    var scaleCan = document.createElement('canvas');
                    scaleCan.width = canvas.width / 1.5;
                    scaleCan.height = canvas.height / 1.5;

                    var ctx = scaleCan.getContext('2d');
                    ctx.drawImage(canvas, 0, 0, scaleCan.width, scaleCan.height);
                    this.value( scaleCan.toDataURL() );
                    this.noPreviewLoaded(false);
                }.bind(this)
            });
        }

    });
});