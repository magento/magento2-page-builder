<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

namespace Magento\PageBuilder\Model\Config\ContentTypes;

use Magento\TestFramework\Helper\Bootstrap;

class AppearanceTest extends \PHPUnit\Framework\TestCase
{
    public function testAppearances()
    {
        $objectManager = Bootstrap::getObjectManager();

        Bootstrap::getInstance()->loadArea('adminhtml');
        $contentTypesReader = $objectManager->create(
            \Magento\PageBuilder\Model\Config\ContentTypes\Reader::class
        );
        $contentTypes = $contentTypesReader->read();

        foreach ($contentTypes['types'] as $configName => $type) {
            $form = $type['form'];

            if ($form) {
                // get appearances in config
                $configAppearances = array_keys($type['appearances']);
                uasort($configAppearances, [$this, 'sortData']);

                // get appearances in form
                $uiReader = $objectManager->create(
                    \Magento\Ui\Config\Reader::class,
                    ['fileName' => $form . '.xml']
                );
                $formData = $uiReader->read();

                $fieldSet = $formData['children']['appearance'];
                $field = $fieldSet['children']['appearance'];
                $appearanceOptions = $field['arguments']['data']['item']['config']['item']['options']['item'];

                $formAppearances = array_map(function ($option) {
                    return $option['item']['value']['value'];
                }, $appearanceOptions);
                uasort($formAppearances, [$this, 'sortData']);

                $this->assertEquals(
                    array_values($configAppearances),
                    array_values($formAppearances),
                    'appearances do not match in form "' . $form . '" and config type "' . $configName . '"'
                );
            }
        }
    }

    private function sortData($firstElement, $secondElement)
    {
        return $firstElement < $secondElement ? -1 : ($firstElement > $secondElement ? 1 : 0);
    }
}
