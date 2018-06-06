<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Magento\PageBuilder\Model;

use Magento\Framework\App\Config\ScopeConfigInterface;
use Magento\Framework\Data\Argument\InterpreterInterface;
use Magento\PageBuilder\Model\Config\ContentType\AdditionalData\ProviderInterface;

class Config extends \Magento\Framework\Config\Data implements \Magento\PageBuilder\Model\Config\ConfigInterface
{
    const IS_PAGEBUILDER_ENABLED = 'cms/pagebuilder/enabled';

    /**
     * @var InterpreterInterface
     */
    private $argumentInterpreter;

    /**
     * @var ScopeConfigInterface
     */
    private $scopeConfig;

    /**
     * @param \Magento\PageBuilder\Model\Config\CompositeReader $reader
     * @param \Magento\Framework\Config\CacheInterface $cache
     * @param ScopeConfigInterface $scopeConfig
     * @param InterpreterInterface $argumentInterpreter
     * @param string $cacheId
     */
    public function __construct(
        \Magento\PageBuilder\Model\Config\CompositeReader $reader,
        \Magento\Framework\Config\CacheInterface $cache,
        ScopeConfigInterface $scopeConfig,
        InterpreterInterface $argumentInterpreter,
        $cacheId = 'pagebuilder_config'
    ) {
        $this->scopeConfig = $scopeConfig;
        $this->argumentInterpreter = $argumentInterpreter;
        parent::__construct($reader, $cache, $cacheId);
    }

    /**
     * @return array
     */
    public function getGroups()
    {
        return $this->get('groups');
    }

    /**
     * Return all content types
     *
     * @return array
     */
    public function getContentTypes(): array
    {
        $types = $this->get('types');
        $types = $this->parseAdditionalData($types);

        return $types;
    }

    /**
     * Returns config setting if page builder enabled
     *
     * @return bool
     */
    public function isEnabled(): bool
    {
        return (bool)$this->scopeConfig->getValue(
            \Magento\PageBuilder\Model\Config::IS_PAGEBUILDER_ENABLED
        );
    }

    /**
     * Convert and evaluate additional data from arguments nodes to array
     *
     * @param array $types
     * @return array
     */
    private function parseAdditionalData(array $types): array
    {
        $convertToProviders = function ($additionalDatum) use (&$convertToProviders) {
            $processedData = [];

            foreach ($additionalDatum as $key => $value) {
                if (is_array($value)) {
                    $processedData[$key] = $convertToProviders($additionalDatum[$key]);
                } elseif (is_object($value) && $value instanceof ProviderInterface) {
                    $processedData[$key] = $value->getData($key)[$key];
                } else {
                    $processedData[$key] = $value;
                }
            }

            return $processedData;
        };

        foreach ($types as &$type) {
            if (!isset($type['additional_data'])) {
                continue;
            }

            foreach ($type['additional_data'] as &$additionalDatum) {
                $additionalDatum = $this->argumentInterpreter->evaluate($additionalDatum);
                $additionalDatum = $convertToProviders($additionalDatum);
            }
        }

        return $types;
    }
}
