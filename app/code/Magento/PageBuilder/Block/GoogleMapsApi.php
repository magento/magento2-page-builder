<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */
declare(strict_types=1);

namespace Magento\PageBuilder\Block;

use Magento\Framework\View\Element\Template;

/**
 * Google Maps API Block
 *
 * @api
 */
class GoogleMapsApi extends \Magento\Framework\View\Element\Template
{
    public const GOOGLE_MAPS_API_KEY_PATH = 'cms/pagebuilder/google_maps_api_key';
    public const GOOGLE_MAPS_LIBRARY_URL = 'https://maps.googleapis.com/maps/api/js?v=3.53&key=%s';
    public const GOOGLE_MAPS_STYLE_PATH = 'cms/pagebuilder/google_maps_style';

    /**
     * Retrieve the Google Maps API key
     *
     * @return string
     */
    public function getApiKey(): ?string
    {
        return $this->_scopeConfig->getValue(self::GOOGLE_MAPS_API_KEY_PATH);
    }

    /**
     * Generate URL for retrieving Google Maps Javascript API
     *
     * @return string
     */
    public function getLibraryUrl(): string
    {
        return sprintf(self::GOOGLE_MAPS_LIBRARY_URL, $this->getApiKey());
    }

    /**
     * Retrieve Google Maps Styles from Configurations
     *
     * @return string|null
     */
    public function getStyle(): ?string
    {
        return $this->_scopeConfig->getValue(self::GOOGLE_MAPS_STYLE_PATH);
    }

    /**
     * Return the translated message for an invalid API key.
     *
     * @return \Magento\Framework\Phrase
     */
    public function getInvalidApiKeyMessage(): \Magento\Framework\Phrase
    {
        return __(
            "You must provide a valid <a href='%1' target='_blank'>Google Maps API key</a> to use a map.",
            $this->_urlBuilder->getUrl('adminhtml/system_config/edit/section/cms', ['_fragment' => 'cms_pagebuilder'])
        );
    }

    /**
     * Include the Google Maps library within the admin only if the API key is set
     *
     * @return bool
     */
    public function shouldIncludeGoogleMapsLibrary(): bool
    {
        try {
            return $this->_appState->getAreaCode() !== \Magento\Backend\App\Area\FrontNameResolver::AREA_CODE ||
                $this->getApiKey();
        } catch (\Magento\Framework\Exception\LocalizedException $e) {
            return false;
        }
    }
}
