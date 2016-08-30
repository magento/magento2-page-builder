/**
 * Media Gallery and image uploader field
 * @author Aidan Threadgold <aidan@gene.co.uk>
 */

define([
    'Magento_Ui/js/form/element/abstract',
    'underscore',
    'mage/translate',
    'jquery',
    'bluefoot/dropzone'
], function (AbstractField, _, $t, jQuery, DropZone) {
    'use strict';

    return AbstractField.extend({
        initialize: function () {
            this._super();

            jQuery("#"+this.dropzoneId()).dropzone({});

            return this;
        },

        /**
         * Open Magento gallery modal
         */
        openGallery: function() {
            MediabrowserUtility.openDialog(
                'http://bluefoot.dev/admin/cms/wysiwyg_images/index/key/93d77f49c7cc37b376589486e6043a01ca5ab7e24e65f0ed2a076e0faa026316/target_element_id/' + this.uid + '/',
                null, null, null, {closed: null}
            );
        },

        dropzoneId: function() {
            return this.uid + "_dropzone";
        }

    });
});
