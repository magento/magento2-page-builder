<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */
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
             * @param string $baseForm
             */
            function ($filename, $baseForm) {
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
                    $baseForm,
                    $dom->getElementsByTagName('form')->item(0)->getAttribute('extends'),
                    'The XML file ' . $filename . ' does not extend "'. $baseForm . '"'
                );
            },
            $this->getXmlFiles()
        );
    }

    private function getXmlFiles()
    {
        $data = [];
        $ignoreFiles = [
            'pagebuilder_base_form.xml',
            'pagebuilder_modal_form.xml',
            'pagebuilder_map_location_form.xml'
        ];
        $overrideFiles = [
            'pagebuilder_banner_form.xml' => 'pagebuilder_base_form_with_background_attributes'
        ];
        $componentRegistrar = new ComponentRegistrar();
        $modulePath = $componentRegistrar->getPath(ComponentRegistrar::MODULE, 'Magento_PageBuilder');
        $dir = $modulePath . '/view/adminhtml/ui_component/';

        $files = glob($dir . 'pagebuilder_*.xml', GLOB_NOSORT);
        foreach ($files as $file) {
            $baseForm = 'pagebuilder_base_form';
            $fileName = substr($file, strlen($dir));
            if (in_array($fileName, $ignoreFiles)) {
                continue;
            }
            if (array_key_exists($fileName, $overrideFiles)) {
                $baseForm = $overrideFiles[$fileName];
            }
            $data[$fileName] = [$file, $baseForm];
        }

        return $data;
    }
}
