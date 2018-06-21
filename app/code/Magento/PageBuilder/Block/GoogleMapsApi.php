<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */
declare(strict_types=1);

namespace Magento\PageBuilder\Block;

/**
 * @api
 */
class GoogleMapsApi extends \Magento\Framework\View\Element\Template
{
    const GOOGLE_MAPS_API_KEY_PATH = 'cms/pagebuilder/google_maps_api_key';
    const GOOGLE_MAPS_LIBRARY_URL = 'https://maps.googleapis.com/maps/api/js?v=3&key=%s';
    const GOOGLE_MAPS_STYLE_PATH = 'cms/pagebuilder/google_maps_style';

    /**
     * Generate URL for retrieving Google Maps Javascript API
     *
     * @return string
     */
    public function getLibraryUrl(): string
    {
        $apiKey = $this->_scopeConfig->getValue(self::GOOGLE_MAPS_API_KEY_PATH);
        $libraryUrlWithKey = sprintf(self::GOOGLE_MAPS_LIBRARY_URL, $apiKey);
        return $libraryUrlWithKey;
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
}
