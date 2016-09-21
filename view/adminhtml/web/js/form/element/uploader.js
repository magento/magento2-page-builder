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

        defaults: {
            listens: {
                value: 'extractUrl'
            }
        },

        /**
         * Extract the desired URL for media gallery images
         */
        extractUrl: function() {
            var val = this.value(),
                regex = /___directive\/([a-z0-9A-Z]*)(,)?(?=\/)/g,
                match = regex.exec(val);

            // Find the base64 encoded string and decode it - returns a string similar to {{media url="wysiwyg/1470306531.png"}}
            if (Array.isArray(match) && typeof match[1] === 'string') {
                var decodedString = atob(match[1]),
                    urlMatches = /url="(.*)"/g.exec(decodedString);

                // Extract the url from the decoded string
                if (Array.isArray(urlMatches)) {
                    this.value("/media/" + urlMatches[1]);
                }
            }
        },

        /**
         * Open Magento gallery modal
         */
        openGallery: function() {
            MediabrowserUtility.openDialog(
                Config.getPluginConfig("gene_widget_upload", "gallery_url") + 'target_element_id/' + this.uid + '/',
                null, null, null, {closed: null}
            );
        },

        /**
         * URL for uploading files to
         * @returns {*}
         */
        uploadUrl: function() {
            return Config.getPluginConfig("gene_widget_upload", "upload_url");
        },

        /**
         * Upload success. Return function with binding to this scope
         * @returns {function(this:exports)}
         */
        attachmentSuccess: function() {
            return function(file, response) {
                if( response.file ) {
                    this.value(response.file);
                }
                else {
                    alert($t("Your image could not be uploaded"));
                }
            }.bind(this);
        },

        /**
         * Upload error
         * @param data
         * @param errorMessage
         */
        attachmentError: function(data, errorMessage) {
            alert($t("Your image could not be uploaded"));
        },

        /**
         * Clear image value
         */
        removeImage: function() {
            this.value("");
        }

    });
});
