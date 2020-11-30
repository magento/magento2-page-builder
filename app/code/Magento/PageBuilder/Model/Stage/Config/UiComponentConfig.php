<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */
declare(strict_types=1);

namespace Magento\PageBuilder\Model\Stage\Config;

use Magento\Framework\Config\DataInterfaceFactory;
use Magento\Ui\Config\Converter;

/**
 * Retrieve fields and default values from associated UI component forms for content types
 */
class UiComponentConfig
{
    /**
     * @var DataInterfaceFactory
     */
    private $configFactory;

    /**
     * UiComponentConfig constructor.
     *
     * @param DataInterfaceFactory $configFactory
     */
    public function __construct(
        DataInterfaceFactory $configFactory
    ) {
        $this->configFactory = $configFactory;
    }

    /**
     * Retrieve fields for UI Component
     *
     * @param string $componentName
     * @param string|null $breakpoint
     *
     * @return array
     * @SuppressWarnings(PHPMD.CyclomaticComplexity)
     */
    public function getFields($componentName, $breakpoint = null) : array
    {
        $componentConfig = $this->configFactory->create(
            ['componentName' => $componentName]
        )->get($componentName);

        $fields = $this->iterateComponents(
            $componentConfig,
            function ($item, $key) use ($breakpoint) {
                $itemConfig = isset($item[Converter::DATA_ARGUMENTS_KEY]['data']['config']) ?
                    $item[Converter::DATA_ARGUMENTS_KEY]['data']['config'] : [];
                // Determine if this item has a formElement key
                if (isset($itemConfig['formElement'])
                    && !(isset($itemConfig['componentDisabled']) && $itemConfig['componentDisabled'] === true)
                    && (!$breakpoint || (
                        $breakpoint &&
                        isset($itemConfig['breakpoints']) &&
                        isset($itemConfig['breakpoints'][$breakpoint]) &&
                        $itemConfig['breakpoints'][$breakpoint]
                    ))
                ) {
                    $elementConfig = $item[Converter::DATA_ARGUMENTS_KEY]['data']['config'];
                    // If the field has a dataScope use that for the key instead of the name
                    if (isset($elementConfig['dataScope'])) {
                        $key = $elementConfig['dataScope'];
                    }
                    $field = [];
                    // Generate our nested field array with defaults supporting dot notation within the key
                    $this->generateFieldArray(
                        $field,
                        $key . ".default",
                        (isset($elementConfig['default']) ? $elementConfig['default'] : '')
                    );
                    return $field;
                }
            }
        );

        return $fields;
    }

    /**
     * Recursively generate our field array, allowing for dot notation within the key
     *
     * @param array $array
     * @param string $path
     * @param string|array $value
     */
    private function generateFieldArray(array &$array, string $path, $value)
    {
        $keys = explode(".", $path);

        foreach ($keys as $key) {
            $array = &$array[$key];
        }

        $array = $value;
    }

    /**
     * Iterate over components within the configuration and run a defined callback function
     *
     * @param array $config
     * @param \Closure $callback
     * @param bool $key
     *
     * @return array
     */
    private function iterateComponents($config, $callback, $key = false) : array
    {
        $values = $callback($config, $key) ?: [];
        if (isset($config[Converter::DATA_COMPONENTS_KEY])
            && !empty($config[Converter::DATA_COMPONENTS_KEY])
            && (!isset($config[Converter::DATA_ARGUMENTS_KEY]['data']['config']['componentType'])
                || isset($config[Converter::DATA_ARGUMENTS_KEY]['data']['config']['componentType'])
                && $config[Converter::DATA_ARGUMENTS_KEY]['data']['config']['componentType'] !== 'dynamicRows'
            )
        ) {
            foreach ($config[Converter::DATA_COMPONENTS_KEY] as $key => $child) {
                $values = array_merge_recursive(
                    $values,
                    $this->iterateComponents($child, $callback, $key) ?: []
                );
            }
        }

        return $values;
    }
}
