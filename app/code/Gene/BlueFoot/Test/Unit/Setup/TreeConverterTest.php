<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */
namespace Gene\BlueFoot\Test\Unit\Setup;

class TreeConverterTest extends \PHPUnit\Framework\TestCase
{
    public function testRender()
    {
        $rendererPool = new \Gene\BlueFoot\Setup\RendererPool(
            [
                'row' => new \Gene\BlueFoot\Setup\RowRenderer(),
                'column' => new \Gene\BlueFoot\Setup\ColumnRenderer(),
                'heading' => new \Gene\BlueFoot\Setup\HeadingRenderer()
            ]
        );

        $childrenExtractorPool = new \Gene\BlueFoot\Setup\ChildrenExtractorPool(
            [
                'row' => new \Gene\BlueFoot\Setup\ConfigurableChildrenExtractor('/'),
                'column' => new \Gene\BlueFoot\Setup\ConfigurableChildrenExtractor('/'),
                'heading' => new \Gene\BlueFoot\Setup\DummyChildrenExtractor()
            ]
        );

        $treeConverter = new \Gene\BlueFoot\Setup\TreeConverter($rendererPool, $childrenExtractorPool);

        $masterFormat = $treeConverter->convert(
            '[{"type":"row","children":[{"type":"column","formData":{"width":"0.500","remove_padding":"1","css_classes":"","undefined":"","align":"","metric":{"margin":"- 5px - -","padding":"- - - -"}},"children":[{"contentType":"heading","entityId":"1","formData":{"align":"","metric":""}}]}]}]'
        );

        $this->assertEquals(
            '<div data-role="row"><div data-role="column"><h2 data-role="heading">Heading text</h2></div></div>',
            $masterFormat
        );
    }
}
