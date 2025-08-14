<?php
/**
 * Copyright 2018 Adobe
 * All Rights Reserved.
 */
declare(strict_types=1);

namespace Magento\PageBuilder\Model\GoogleMaps;

class ApiKeyValidator
{
    public const GOOGLE_MAPS_EMBED_URL = 'https://www.google.com/maps/embed/v1/place?key=%s&q=Austin+TX';

    /**
     * Send test request to Google Maps and return response
     *
     * @param string $apiKey
     * @return array
     */
    public function validate(string $apiKey): array
    {
        $testUrl = sprintf(self::GOOGLE_MAPS_EMBED_URL, $apiKey);
        // phpcs:ignore Magento2.Functions.DiscouragedFunction
        $curl = curl_init($testUrl);
        // phpcs:ignore Magento2.Functions.DiscouragedFunction
        curl_setopt($curl, CURLOPT_RETURNTRANSFER, 1);
        // phpcs:ignore Magento2.Functions.DiscouragedFunction
        $result = curl_exec($curl);
        // phpcs:ignore Magento2.Functions.DiscouragedFunction
        $responseCode = curl_getinfo($curl, CURLINFO_HTTP_CODE);
        $returnArray = [
            'responseMessage' => $responseCode !== 200 ? $result : '',
            'success' => $responseCode === 200 ? true : false
        ];

        return $returnArray;
    }
}
