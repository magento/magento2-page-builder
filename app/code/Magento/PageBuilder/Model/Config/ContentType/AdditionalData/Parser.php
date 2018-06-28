<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Magento\PageBuilder\Model\Config\ContentType\AdditionalData;

use Magento\Framework\Data\Argument\InterpreterInterface;

/**
 * Additional Data Parser for evaluation of data providers at runtime
 */
class Parser
{
    /**
     * @var InterpreterInterface
     */
    private $argumentInterpreter;

    /**
     * @param InterpreterInterface $argumentInterpreter
     */
    public function __construct(
        InterpreterInterface $argumentInterpreter
    ) {
        $this->argumentInterpreter = $argumentInterpreter;
    }

    /**
     * Convert and evaluate additional data from item nodes to array
     *
     * @param array $additionalData
     * @return array
     */
    public function toArray(array $additionalData): array
    {
        $parsedAdditionalData = [];

        foreach ($additionalData as $key => $additionalDataItem) {
            $additionalDataItem = $this->argumentInterpreter->evaluate($additionalDataItem);
            $parsedAdditionalData[$key] = $this->evaluateProviders($additionalDataItem);
        }

        return $parsedAdditionalData;
    }

    /**
     * Evaluate ProviderInterface objects
     *
     * @param array $additionalDataItem
     * @return array
     */
    private function evaluateProviders(array $additionalDataItem): array
    {
        $processedData = [];

        foreach ($additionalDataItem as $key => $value) {
            $processedData[$key] = $value;

            if (is_array($value)) {
                $processedData[$key] = $this->evaluateProviders($additionalDataItem[$key]);
            } elseif (is_object($value) && $value instanceof ProviderInterface) {
                $processedData[$key] = $value->getData($key)[$key];
            }
        }

        return $processedData;
    }
}
