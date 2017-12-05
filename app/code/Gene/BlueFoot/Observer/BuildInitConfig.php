<?php

namespace Gene\BlueFoot\Observer;

use Magento\Framework\Event\ObserverInterface;

/**
 * Class SavePageBuilder
 *
 * @package Gene\BlueFoot\Observer
 *
 * @author Dave Macaulay <dave@gene.co.uk>
 */
class BuildInitConfig implements ObserverInterface
{
    /**
     * @var \Magento\Framework\UrlInterface
     */
    protected $urlBuilder;

    /**
     * @var \Gene\BlueFoot\Helper\Config
     */
    protected $configHelper;

    /**
     * BuildInitConfig constructor.
     *
     * @param \Magento\Framework\UrlInterface $urlInterface
     * @param \Gene\BlueFoot\Helper\Config    $configHelper
     */
    public function __construct(
        \Magento\Framework\UrlInterface $urlInterface,
        \Gene\BlueFoot\Helper\Config $configHelper
    ) {
        $this->urlBuilder = $urlInterface;
        $this->configHelper = $configHelper;
    }

    /**
     * Add in extra information to the config
     *
     * @param \Magento\Framework\Event\Observer $observer
     *
     * @return $this
     * @todo provide outside of plugin data
     */
    public function execute(\Magento\Framework\Event\Observer $observer)
    {
        /* @var $config \Magento\Framework\DataObject */
        $config = $observer->getEvent()->getConfig();
        $pluginData = $config->getData('plugins');

        // Send the upload path URL
        $pluginData['gene_widget_upload']['config']['upload_url']
            = $this->urlBuilder->getUrl('bluefoot/stage/widget_upload');

        // Send the url for the media gallery
        $pluginData['gene_widget_upload']['config']['gallery_url']
            = $this->urlBuilder->getUrl('cms/wysiwyg_images');

        // Send the url for the widget selector
        $pluginData['gene_widget_magentowidget']['config']['widget_url']
            = $this->urlBuilder->getUrl('adminhtml/widget/index');

        // Send the media upload URL for displaying images
        $uploadUrl = $this->configHelper->getUploadUrl(true);
        $pluginData['gene_widget_upload']['config']['media_url'] = $uploadUrl;

        // Send the redactor plugin URL
        $pluginData['gene_redactor']['config']['magentovar_url']
            = $this->urlBuilder->getUrl('adminhtml/system_variable/wysiwygPlugin');

        // Search URLs
        $pluginData['gene_widget_search_product']['config']['source_url']
            = $this->urlBuilder->getUrl('bluefoot/stage/widget_search', ['context' => 'product']);
        $pluginData['gene_widget_search_category']['config']['source_url']
            = $this->urlBuilder->getUrl('bluefoot/stage/widget_search', ['context' => 'category']);
        $pluginData['gene_widget_search_staticblock']['config']['source_url']
            = $this->urlBuilder->getUrl('bluefoot/stage/widget_search', ['context' => 'staticblock']);

        $pluginData['gene_widget_video']['config']['source_url']
            = $this->urlBuilder->getUrl('bluefoot/stage/widget_video');

        $config->setData('plugins', $pluginData);

        return $this;
    }
}
