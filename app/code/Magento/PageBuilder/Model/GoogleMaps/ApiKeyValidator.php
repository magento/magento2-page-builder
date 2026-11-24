<?php
/**
 * Copyright 2018 Adobe
 * All Rights Reserved.
 */
declare(strict_types=1);

namespace Magento\PageBuilder\Model\GoogleMaps;

use Magento\Framework\App\ObjectManager;
use Magento\Framework\HTTP\ClientFactory;

class ApiKeyValidator
{
    public const GOOGLE_MAPS_EMBED_URL = 'https://www.google.com/maps/embed/v1/place?key=%s&q=Austin+TX';

    private const REQUEST_TIMEOUT = 10;

    /**
     * @var ClientFactory
     */
    private ClientFactory $clientFactory;

    /**
     * @param ClientFactory|null $clientFactory
     */
    public function __construct(?ClientFactory $clientFactory = null)
    {
        $this->clientFactory = $clientFactory ?? ObjectManager::getInstance()->get(ClientFactory::class);
    }

    /**
     * Send test request to Google Maps and return response
     *
     * @param string $apiKey
     * @return array
     */
    public function validate(string $apiKey): array
    {
        $testUrl = sprintf(self::GOOGLE_MAPS_EMBED_URL, urlencode($apiKey));
        $client = $this->clientFactory->create();
        $client->setTimeout(self::REQUEST_TIMEOUT);
        try {
            $client->get($testUrl);
        } catch (\Exception $exception) {
            return [
                'responseMessage' => $exception->getMessage(),
                'success' => false
            ];
        }
        $responseCode = $client->getStatus();
        $returnArray = [
            'responseMessage' => $responseCode !== 200 ? $client->getBody() : '',
            'success' => $responseCode === 200 ? true : false
        ];

        return $returnArray;
    }
}
