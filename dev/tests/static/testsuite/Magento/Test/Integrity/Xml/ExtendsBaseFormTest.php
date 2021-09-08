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
    /**
     * Verify the XML files extend the expected base form.
     */
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

    /**
     * Return XML files that are expected to be extended.
     *
     * @return array
     */
    private function getXmlFiles(): array
    {
        $data = [];
        $ignoreFiles = [
            'pagebuilder_modal_form.xml',
            'pagebuilder_block_select_grid.xml',
            'pagebuilder_stage_template.xml',
            'pagebuilder_stage_template_grid.xml',
            'pagebuilder_template_grid.xml'
        ];
        $overrideFiles = [
            'pagebuilder_base_form.xml' => '',
            'pagebuilder_map_location_form.xml' => '',
            'pagebuilder_banner_form.xml' => 'pagebuilder_base_form_with_background_video',
            'pagebuilder_column_form.xml' => 'pagebuilder_base_form_with_background_attributes',
            'pagebuilder_column_group_form.xml' => 'pagebuilder_base_form_with_background_attributes',
            'pagebuilder_tab_item_form.xml' => 'pagebuilder_base_form_with_background_attributes',
            'pagebuilder_base_form_with_background_video.xml' => 'pagebuilder_base_form_with_background_attributes',
            'pagebuilder_row_form.xml' => 'pagebuilder_base_form_with_background_video',
            'pagebuilder_slide_form.xml' => 'pagebuilder_base_form_with_background_video',
            'pagebuilder_products_carousel_form.xml' => 'pagebuilder_products_form',
            'pagebuilder_slide_mobile_form.xml' => 'pagebuilder_slide_form',
            'pagebuilder_tab_item_mobile_form.xml' => 'pagebuilder_tab_item_form',
            'pagebuilder_banner_mobile_form.xml' => 'pagebuilder_banner_form',
            'pagebuilder_column_mobile_form.xml' => 'pagebuilder_column_form',
            'pagebuilder_row_mobile_form.xml' => 'pagebuilder_row_form',
            'pagebuilder_slider_mobile_form.xml' => 'pagebuilder_slider_form',
            'pagebuilder_tabs_mobile_form.xml' => 'pagebuilder_tabs_form',
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
