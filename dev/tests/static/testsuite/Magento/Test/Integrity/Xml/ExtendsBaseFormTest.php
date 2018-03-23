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
         */
            function ($filename) {
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
                    'pagebuilder_base_form',
                    $dom->getElementsByTagName('form')->item(0)->getAttribute('extends'),
                    'The XML file ' . $filename . ' does not extend "pagebuilder_base_form"'
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
            'pagebuilder_modal_form.xml'
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
            $data[$fileName] = [$file];
        }

        return $data;
    }
}
