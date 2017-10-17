<?php

namespace Gene\BlueFoot\Model\Stage\Config;

use Magento\Framework\Config\DataInterfaceFactory;
use Magento\Ui\Config\Converter;

/**
 * Class UiComponentConfig
 *
 * @package Gene\BlueFoot\Model\Stage\Config
 */
class UiComponentConfig
{
    /**
     * @var DataInterfaceFactory
     */
    protected $configFactory;

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
     * @param $componentName
     *
     * @return array
     */
    public function getFields($componentName)
    {
        $componentConfig = $this->configFactory->create(
            ['componentName' => $componentName]
        )->get($componentName);

        $fields = $this->iterateComponents($componentConfig, function ($item, $key) {
            // Determine if this item has a formElement key
            // @todo improve form element detection
            if (isset($item[Converter::DATA_ARGUMENTS_KEY]['data']['config']['formElement'])) {
                $elementConfig = $item[Converter::DATA_ARGUMENTS_KEY]['data']['config'];
                return [
                    $key => [
                        'default' => (isset($elementConfig['default']) ? $elementConfig['default']: '')
                    ]
                ];
            }
        });

        return $fields;
    }

    /**
     * @param      $config
     * @param      $callback
     * @param bool $key
     *
     * @return array
     */
    protected function iterateComponents($config, $callback, $key = false)
    {
        $values = $callback($config, $key) ?: [];
        if (isset($config[Converter::DATA_COMPONENTS_KEY]) && sizeof($config[Converter::DATA_COMPONENTS_KEY]) > 0) {
            foreach ($config[Converter::DATA_COMPONENTS_KEY] as $key => $child) {
                $values = array_merge($values, $this->iterateComponents($child, $callback, $key) ?: []);
            }
        }
        return $values;
    }
}