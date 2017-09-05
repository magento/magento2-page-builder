define([
    'bluefoot/block/preview/abstract',
    'bluefoot/ko-redactor'
], function (Abstract) {

    Abstract.prototype.getType = function() {
        /*// @todo abstract "magento_widget_id"
        var value = this.magento_widget_id(),
            type = '';

        value.gsub(/([a-z0-9\\_]+)\\s*\\=\\s*[\"]{1}([^\"]+)[\"]{1}/i, function(match) {
        });

        // @todo Dynamically get this data
        var defaults = {
            "Magento\\Banner\\Block\\Widget\\Banner": "Banner Rotator",
            "Magento\\VersionsCms\\Block\\Widget\\Node": "CMS Hierarchy Node Link",
            "Magento\\Cms\\Block\\Widget\\Page\\Link": "CMS Page Link",
            "Magento\\Cms\\Block\\Widget\\Block": "CMS Static Block",
            "Magento\\Catalog\\Block\\Category\\Widget\\Link": "Catalog Category Link",
            "Magento\\CatalogEvent\\Block\\Widget\\Lister": "Catalog Events Carousel",
            "Magento\\Catalog\\Block\\Product\\Widget\\NewWidget": "Catalog New Products List",
            "Magento\\CatalogWidget\\Block\\Product\\ProductsList": "Catalog Products List",
            "Magento\\GiftRegistry\\Block\\Search\\Widget\\Form": "Gift Registry Search",
            "Magento\\AdvancedCheckout\\Block\\Widget\\Sku": "Order by SKU",
            "Magento\\Sales\\Block\\Widget\\Guest\\Form": "Orders and Returns",
            "Magento\\Reports\\Block\\Product\\Widget\\Compared": "Recently Compared Products",
            "Magento\\Reports\\Block\\Product\\Widget\\Viewed": "Recently Viewed Products",
            "Magento\\MultipleWishlist\\Block\\Widget\\Search": "Wish List Search"
        };*/

        return "";
    };

    return Abstract;
});