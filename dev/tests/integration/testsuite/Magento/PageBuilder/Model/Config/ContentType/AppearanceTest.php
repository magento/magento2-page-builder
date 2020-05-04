<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Magento\PageBuilder\Model\Config\ContentType;

use Magento\TestFramework\Helper\Bootstrap;

class AppearanceTest extends \PHPUnit\Framework\TestCase
{
    /**
     * @var \Magento\TestFramework\ObjectManager
     */
    private $objectManager;

    /**
     * @var \Magento\PageBuilder\Model\Config\ContentType\Reader
     */
    private $contentTypesReader;

    protected function setUp(): void
    {
        parent::setUp();

        $this->objectManager = Bootstrap::getObjectManager();

        $this->contentTypesReader = $this->objectManager->create(
            \Magento\PageBuilder\Model\Config\ContentType\Reader::class
        );
    }

    /**
     * @magentoAppArea adminhtml
     */
    public function testContentTypeAndFormConfigurationAppearancesMatch()
    {
        $contentTypes = $this->contentTypesReader->read();

        foreach ($contentTypes as $configName => $type) {
            $form = $type['form'] ?? null;

            if (!$form) {
                continue;
            }

            // get appearance names in content type config
            $contentTypeAppearanceNames = array_keys($type['appearances'] ?? []);
            sort($contentTypeAppearanceNames);

            // get appearance names in ui component form config
            $uiReader = $this->objectManager->create(
                \Magento\Ui\Config\Reader::class,
                ['fileName' => $form . '.xml']
            );
            $formData = $uiReader->read();

            $fieldSet = $formData['children']['appearance_fieldset'];
            $field = $fieldSet['children']['appearance'];

            $appearanceOptions = $this->objectManager->get(
                $field['arguments']['data']['item']['options']['value']
            )->toOptionArray();

            $uiComponentFormAppearanceNames = array_column($appearanceOptions, 'value');
            sort($uiComponentFormAppearanceNames);

            $this->assertEquals(
                $contentTypeAppearanceNames,
                $uiComponentFormAppearanceNames,
                'appearances do not match in form "' . $form . '" and config type "' . $configName . '"'
            );
        }
    }
}
