<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Magento\PageBuilder\Component;

use Magento\Framework\App\Config\ScopeConfigInterface;
use Magento\Framework\UrlInterface;
use Magento\Framework\View\Element\UiComponent\ContextInterface;
use Magento\PageBuilder\Model\GoogleMaps\ApiKeyValidator;

/**
 * Google Maps API Key Validation Container for UI Component Form
 *
 * @api
 */
class GoogleMapsApiKeyValidationContainer extends \Magento\Ui\Component\Container
{
    const GOOGLE_MAPS_API_KEY_PATH = 'cms/pagebuilder/google_maps_api_key';

    /**
     * @var UrlInterface
     */
    private $url;

    /**
     * @var ScopeConfigInterface
     */
    private $scopeConfig;

    /**
     * Constructor
     *
     * @param ContextInterface $context
     * @param UrlInterface $url
     * @param ScopeConfigInterface $scopeConfig
     * @param array $components
     * @param array $data
     */
    public function __construct(
        ContextInterface $context,
        UrlInterface $url,
        ScopeConfigInterface $scopeConfig,
        array $components = [],
        array $data = []
    ) {
        parent::__construct(
            $context,
            $components,
            $data
        );
        $this->url = $url;
        $this->scopeConfig = $scopeConfig;
    }

    /**
     * Prepare component configuration
     *
     * @return void
     */
    public function prepare()
    {
        parent::prepare();
        $config = $this->getData('config');
        $apiKey = $this->scopeConfig->getValue(self::GOOGLE_MAPS_API_KEY_PATH) ?: "";
        if (trim($apiKey) == "") {
            $config['visible'] = true;
        }

        if (isset($config['map_configuration_url'])) {
            $config['map_configuration_url'] = $this->url->getUrl(
                $config['map_configuration_url'],
                ['_fragment' => 'cms_pagebuilder']
            );
        }
        if (isset($config['content'])) {
            $config['content'] = sprintf($config['content'], $config['map_configuration_url']);
        }

        $this->setData('config', (array) $config);
    }
}
