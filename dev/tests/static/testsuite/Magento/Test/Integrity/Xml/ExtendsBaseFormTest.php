<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Magento\Test\Integrity\Xml;

use Magento\Framework\Component\ComponentRegistrar;

class ExtendsBaseFormTest extends \PHPUnit\Framework\TestCase
{
    public function testXmlFiles()
    {
        $invoker = new \Magento\Framework\App\Utility\AggregateInvoker($this);
        $invoker(
            /**
             * @param string $filename
             * @param string $expectedBaseForm
             */
            function ($filename, $expectedBaseForm) {
                $dom = new \DOMDocument();
                $dom->loadXML(file_get_contents($filename));
                $errors = libxml_get_errors();
                libxml_clear_errors();
                $this->assertEmpty($errors, print_r($errors, true));

                $this->assertNotEmpty(
                    $dom->getElementsByTagName('form')->item(0),
                    'The XML file ' . $filename . ' is not a form'
                );

                $this->assertEquals(
                    $expectedBaseForm,
                    $dom->getElementsByTagName('form')->item(0)->getAttribute('extends'),
                    'The XML file ' . $filename . ' does not extend "'. $expectedBaseForm . '"'
                );
            },
            $this->getXmlFiles()
        );
    }

    private function getXmlFiles(): array
    {
        $data = [];
        $ignoreFiles = [
            'pagebuilder_modal_form.xml',
            'pagebuilder_block_select_grid.xml',
        ];
        $overrideFiles = [
            'pagebuilder_base_form.xml' => '',
            'pagebuilder_map_location_form.xml' => '',
            'pagebuilder_banner_form.xml' => 'pagebuilder_base_form_with_background_attributes',
        ];
        $componentRegistrar = new ComponentRegistrar();
        $modulePath = $componentRegistrar->getPath(ComponentRegistrar::MODULE, 'Magento_PageBuilder');
        $dir = $modulePath . '/view/adminhtml/ui_component/';

        $files = glob($dir . 'pagebuilder_*.xml', GLOB_NOSORT);
        foreach ($files as $file) {
            $fileName = substr($file, strlen($dir));
            if (in_array($fileName, $ignoreFiles)) {
                continue;
            }
            $baseForm = $overrideFiles[$fileName] ?? 'pagebuilder_base_form';
            $data[$fileName] = [$file, $baseForm];
        }

        return $data;
    }
}
