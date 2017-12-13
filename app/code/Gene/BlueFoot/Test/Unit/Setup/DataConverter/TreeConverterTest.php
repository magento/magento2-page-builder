<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */
namespace Gene\BlueFoot\Test\Unit\Setup\DataConverter;

class TreeConverterTest extends \PHPUnit\Framework\TestCase
{
    public function testRender()
    {
        $headerHydratorMock = $this->getMockBuilder(\Gene\BlueFoot\Setup\DataConverter\EntityHydratorInterface::class)
            ->getMockForAbstractClass();
        $headerHydratorMock->expects($this->once())
            ->method('hydrate')
            ->willReturn(
                [
                    'css_classes' => 'primary',
                    'title' => 'Heading text',
                    'heading_type' => 'h2'
                ]
            );

        $rendererPool = new \Gene\BlueFoot\Setup\DataConverter\RendererPool(
            [
                'row' => new \Gene\BlueFoot\Setup\DataConverter\Renderer\Row(),
                'column' => new \Gene\BlueFoot\Setup\DataConverter\Renderer\Column(),
                'heading' => new \Gene\BlueFoot\Setup\DataConverter\Renderer\Heading(
                    new \Gene\BlueFoot\Setup\DataConverter\StyleExtractor(),
                    $headerHydratorMock
                )
            ]
        );

        $childrenExtractorPool = new \Gene\BlueFoot\Setup\DataConverter\ChildrenExtractorPool(
            [
                'default' => new \Gene\BlueFoot\Setup\DataConverter\ChildrenExtractor\Dummy(),
                'row' => new \Gene\BlueFoot\Setup\DataConverter\ChildrenExtractor\Configurable('children'),
                'column' => new \Gene\BlueFoot\Setup\DataConverter\ChildrenExtractor\Configurable('children')
            ]
        );

        $treeConverter = new \Gene\BlueFoot\Setup\DataConverter\TreeConverter(
            $rendererPool,
            $childrenExtractorPool,
            new \Magento\Framework\Serialize\Serializer\Json()
        );

        $masterFormat = $treeConverter->convert(
            '[{"type":"row","children":[{"type":"column","formData":{"width":"0.500","remove_padding":"1","css_classes":"","undefined":"","align":"","metric":{"margin":"- 5px - -","padding":"- - - -"}},"children":[{"contentType":"heading","entityId":"1","formData":{"align":"","metric":""}}]}]}]'
        );

        $this->assertEquals(
            '<div data-role="row"><div data-role="column"><h2 data-role="heading" class="primary">Heading text</h2></div></div>',
            $masterFormat
        );
    }

    public function testRenderContentWithButtons()
    {
        $rendererPool = new \Gene\BlueFoot\Setup\DataConverter\RendererPool(
            [
                'row' => new \Gene\BlueFoot\Setup\DataConverter\Renderer\Row(),
                'buttons' => new \Gene\BlueFoot\Setup\DataConverter\Renderer\Buttons(),
                'button_item' => new \Gene\BlueFoot\Setup\DataConverter\Renderer\ButtonItem(),
            ]
        );

        $childrenExtractorPool = new \Gene\BlueFoot\Setup\DataConverter\ChildrenExtractorPool(
            [
                'default' => new \Gene\BlueFoot\Setup\DataConverter\ChildrenExtractor\Dummy(),
                'row' => new \Gene\BlueFoot\Setup\DataConverter\ChildrenExtractor\Configurable('children'),
                'buttons' => new \Gene\BlueFoot\Setup\DataConverter\ChildrenExtractor\Configurable('children/button_items'),
            ]
        );

        $treeConverter = new \Gene\BlueFoot\Setup\DataConverter\TreeConverter(
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
