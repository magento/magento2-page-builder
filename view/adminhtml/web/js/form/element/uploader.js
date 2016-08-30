/**
 * Media Gallery and image uploader field
 * @author Aidan Threadgold <aidan@gene.co.uk>
 */

define([
    'Magento_Ui/js/form/element/abstract',
    'underscore',
    'mage/translate',
    'bluefoot/config',
    'bluefoot/ko-dropzone'
], function (AbstractField, _, $t, Config) {
    'use strict';

    return AbstractField.extend({
        /**
         * Open Magento gallery modal
         */
        openGallery: function() {
            MediabrowserUtility.openDialog(
                'http://bluefoot.dev/admin/cms/wysiwyg_images/index/key/93d77f49c7cc37b376589486e6043a01ca5ab7e24e65f0ed2a076e0faa026316/target_element_id/' + this.uid + '/',
                null, null, null, {closed: null}
            );
        },

        uploadUrl: function() {
            return Config.getPluginConfig("gene_widget_upload", "upload_url");
        },

        attachmentSuccess: function() {
            return function(file, response) {
                if( response.file ) {
                    this.value(response.file);
                }
                else {
                    alert("Failed");
                }
            }.bind(this);
        }

    });
});
