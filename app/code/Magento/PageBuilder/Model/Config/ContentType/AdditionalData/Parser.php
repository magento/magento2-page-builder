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
     * Convert and evaluate additional data from arguments nodes to array
     *
     * @param array $additionalData
     * @return array
     */
    public function toArray(array $additionalData): array
    {
        $parsedAdditionalData = [];

        $convertToProviders = function ($additionalDatum) use (&$convertToProviders) {
            $processedData = [];

            foreach ($additionalDatum as $key => $value) {
                $processedData[$key] = $value;

                if (is_array($value)) {
                    $processedData[$key] = $convertToProviders($additionalDatum[$key]);
                } elseif (is_object($value) && $value instanceof ProviderInterface) {
                    $processedData[$key] = $value->getData($key)[$key];
                }
            }

            return $processedData;
        };

        foreach ($additionalData as $key => $additionalDatum) {
            $additionalDatum = $this->argumentInterpreter->evaluate($additionalDatum);
            $parsedAdditionalData[$key] = $convertToProviders($additionalDatum);
        }

        return $parsedAdditionalData;
    }
}
