/**
 * - Image.js
 * Image class for preview areas of a block
 *
 */
define([
    'ko',
    'bluefoot/block/preview/abstract',
    'bluefoot/config',
    'mage/translate',
    'bluefoot/ko-dropzone'
], function (ko, AbstractPreview, Config, $t) {

    /**
     *
     * @param parent
     * @param config
     * @constructor
     */
    function Image(parent, config) {
        AbstractPreview.apply(this, arguments);

        this.loading = ko.observable(false);

        // Concat the media URL with the image url. Remove /media/ from the image URL if stored.
        // /media/ is removed for data migration purposes
        this.imageUrl = ko.computed(function () {
            if (this.image()) {
                return Config.getInitConfig('media_url') + this.image().replace('/media/', '');
            }
            return '';
        }, this);
    }

    Image.prototype = Object.create(AbstractPreview.prototype);
    var $super = AbstractPreview.prototype;

    /**
     * URL for uploading files to
     *
     * @returns {*}
     */
    Image.prototype.uploadUrl = function() {
        return Config.getPluginConfig('gene_widget_upload', 'upload_url');
    };

    /**
     * Upload success. Return function with binding to this scope
     *
     * @returns {function(this:Image)}
     */
    Image.prototype.attachmentSuccess = function() {
        return function(file, response, bindKey) {
            if (response.file) {
                this.parent.data()[bindKey] = response.file;
                this.parent.data.valueHasMutated();
                setTimeout(function () {
                    this.loading(false);
                }.bind(this), 50);
            } else {
                alert($t("Your image could not be uploaded"));
            }
        }.bind(this);
    };

    /**
     * Event when an attachment is dropped onto the dropzone
     */
    Image.prototype.attachmentDrop = function () {
        return function (event) {
            jQuery(event.target).parents('.dz-drag-hover').removeClass('dz-drag-hover');
            this.loading(true);
        }.bind(this);
    };

    /**
     * Upload error
     *
     * @param data
     * @param errorMessage
     */
    Image.prototype.attachmentError = function(data, errorMessage) {
        this.loading(false);
        alert($t("Your image could not be uploaded"));
    };

    return Image;
});