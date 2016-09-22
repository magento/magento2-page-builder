define([
    'Magento_Ui/js/form/element/abstract',
    'jquery'
], function (AbstractField, $) {
    'use strict';

    return AbstractField.extend({
        defaults: {
            type: '',
            iframeSrc: false,

            listens: {
                type: 'updateIframe',
                value: 'updateIframe'
            }
        },

        /**
         * @inheritdoc
         */
        initObservable: function () {
            return this._super().observe('type iframeSrc');
        },

        /**
         * Update the iframe URL
         */
        updateIframe: function () {
            var vimeo = /(?:http?s?:\/\/)?(?:www\.)?(?:vimeo\.com)\/?(.+)/g,
                youtube = /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/g,
                embedUrl,
                iframeUrl;

            // Regex test for Vimeo
            if (vimeo.test(this.value())){
                embedUrl = '//player.vimeo.com/video/$1';
                iframeUrl = this.value().replace(vimeo, embedUrl);
                console.log(iframeUrl);
                this.type('vimeo');
                this.iframeSrc(iframeUrl);
            }

            // Regex test for YouTube
            if (youtube.test(this.value())){
                embedUrl = 'http://www.youtube.com/embed/$2';
                iframeUrl = this.value().replace(youtube, embedUrl);
                console.log(iframeUrl);
                this.type('youtube');
                this.iframeSrc(iframeUrl);
            }
        },

    });
});
