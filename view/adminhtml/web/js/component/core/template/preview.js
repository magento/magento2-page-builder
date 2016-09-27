define([
    'Magento_Ui/js/form/element/abstract',
    'jquery',
    'Gene_BlueFoot/js/resource/html2canvas'
], function (AbstractField, $) {
    'use strict';

    return AbstractField.extend({
        noPreviewLoaded: true,

        initObservable: function () {
            this._super();
            this.observe('noPreviewLoaded');

            return this;
        },

        reset: function() {
            this.value(null);
            this.noPreviewLoaded(true);
        },

        /**
         * Build the preview image
         */
        buildPreview: function(stage) {
            var templatePreview,
                stageEl = $('#' + stage.id());

            // hide the add button
            stageEl.addClass("screengrab");
            stageEl.css("height", stageEl.width());

            html2canvas(document.getElementById(stage.id()), {
                onrendered: function (canvas) {
                    stageEl.removeClass("screengrab").height('auto');

                    //Shrink the canvas a bit to save space.
                    var scaleCan = document.createElement('canvas');
                    scaleCan.width = canvas.width / 2.2;
                    scaleCan.height = canvas.height / 2.2;

                    var ctx = scaleCan.getContext('2d');
                    ctx.drawImage(canvas, 0, 0, scaleCan.width, scaleCan.height);
                    this.value( scaleCan.toDataURL() );
                    this.noPreviewLoaded(false);
                }.bind(this)
            });
        }

    });
});