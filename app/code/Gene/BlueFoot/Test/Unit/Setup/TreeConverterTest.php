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
                'default' => new \Gene\BlueFoot\Setup\DummyChildrenExtractor(),
                'row' => new \Gene\BlueFoot\Setup\ConfigurableChildrenExtractor('children'),
                'column' => new \Gene\BlueFoot\Setup\ConfigurableChildrenExtractor('children')
            ]
        );

        $treeConverter = new \Gene\BlueFoot\Setup\TreeConverter(
            $rendererPool,
            $childrenExtractorPool,
            new \Magento\Framework\Serialize\Serializer\Json()
        );

        $masterFormat = $treeConverter->convert(
            '[{"type":"row","children":[{"type":"column","formData":{"width":"0.500","remove_padding":"1","css_classes":"","undefined":"","align":"","metric":{"margin":"- 5px - -","padding":"- - - -"}},"children":[{"contentType":"heading","entityId":"1","formData":{"align":"","metric":""}}]}]}]'
        );

        $this->assertEquals(
            '<div data-role="row"><div data-role="column"><h2 data-role="heading">Heading text</h2></div></div>',
            $masterFormat
        );
    }

    public function testRenderContentWithButtons()
    {
        $rendererPool = new \Gene\BlueFoot\Setup\RendererPool(
            [
                'row' => new \Gene\BlueFoot\Setup\RowRenderer(),
                'buttons' => new \Gene\BlueFoot\Setup\ButtonsRenderer(),
                'button_item' => new \Gene\BlueFoot\Setup\ButtonItemRenderer(),
            ]
        );

        $childrenExtractorPool = new \Gene\BlueFoot\Setup\ChildrenExtractorPool(
            [
                'default' => new \Gene\BlueFoot\Setup\DummyChildrenExtractor(),
                'row' => new \Gene\BlueFoot\Setup\ConfigurableChildrenExtractor('children'),
                'buttons' => new \Gene\BlueFoot\Setup\ConfigurableChildrenExtractor('children/button_items'),
            ]
        );

        $treeConverter = new \Gene\BlueFoot\Setup\TreeConverter(
            $rendererPool,
            $childrenExtractorPool,
            new \Magento\Framework\Serialize\Serializer\Json()
        );

        $masterFormat = $treeConverter->convert(
            '[{"type":"row","children":[{"contentType":"buttons","children":{"button_items":[{"contentType":"button_item","entityId":"3","formData":{"align":"","metric":""}}]},"entityId":"2","formData":{"align":"","metric":""}}]}]'
        );

        $this->assertEquals(
            '<div data-role="row"><div data-role="buttons"><button data-role="button-item"></button></div></div>',
            $masterFormat
        );
    }
}
