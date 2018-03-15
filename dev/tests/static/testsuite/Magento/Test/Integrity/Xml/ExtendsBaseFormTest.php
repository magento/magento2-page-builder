<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

namespace Magento\PageBuilder\Magento\Test\Integrity\Xml;

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
                $xmlFile = file_get_contents($filename);
                $extendsLocations = [];

                preg_match('/extends="pagebuilder_base_form"/s', $xmlFile, $extendsLocations);
                $this->assertEquals(
                    1,
                    count($extendsLocations),
                    'The XML file at ' . $filename . ' does not extend "pagebuilder_base_form"'
                );
            },
            $this->getXmlFiles()
        );
    }

    public function getXmlFiles()
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
