<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */
declare(strict_types=1);

namespace Magento\PageBuilder\Model\GoogleMaps;

class ApiKeyValidator
{
    const GOOGLE_MAPS_EMBED_URL = 'https://www.google.com/maps/embed/v1/place?key=%s&q=Austin+TX';

    /**
     * Send test request to Google Maps and return response
     *
     * @param string $apiKey
     * @return array
     */
    public function validate(string $apiKey): array
    {
        $testUrl = sprintf(self::GOOGLE_MAPS_EMBED_URL, $apiKey);
        $curl = curl_init($testUrl);
        curl_setopt($curl, CURLOPT_RETURNTRANSFER, 1);
        $result = curl_exec($curl);
        $responseCode = curl_getinfo($curl, CURLINFO_HTTP_CODE);
        $returnArray = [
            'responseMessage' => $responseCode !== 200 ? $result : '',
            'success' => $responseCode === 200 ? true : false
        ];

        return $returnArray;
    }
}
