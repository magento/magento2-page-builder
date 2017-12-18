<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */
namespace Gene\BlueFoot\Test\Unit\Setup\DataConverter;

class TreeConverterTest extends \PHPUnit\Framework\TestCase
{
    /**
     * @var \Gene\BlueFoot\Setup\DataConverter\StyleExtractorInterface
     */
    private $styleExtractor;

    protected function setUp()
    {
        $this->styleExtractor = new \Gene\BlueFoot\Setup\DataConverter\StyleExtractor(
            new \Magento\Framework\Serialize\Serializer\Json()
        );
    }

    /**
     * @dataProvider dataProviderRender
     */
    public function testRender($hydrated, $original, $expected)
    {
        $headerHydratorMock = $this->getMockBuilder(\Gene\BlueFoot\Setup\DataConverter\EntityHydratorInterface::class)
            ->getMockForAbstractClass();
        $headerHydratorMock->expects($this->any())
            ->method('hydrate')
            ->willReturn($hydrated);
        $textHydratorMock = $this->getMockBuilder(\Gene\BlueFoot\Setup\DataConverter\EntityHydratorInterface::class)
            ->getMockForAbstractClass();
        $textHydratorMock->expects($this->any())
            ->method('hydrate')
            ->willReturn($hydrated);

        $rendererPool = new \Gene\BlueFoot\Setup\DataConverter\RendererPool(
            [
                'row' => new \Gene\BlueFoot\Setup\DataConverter\Renderer\Row($this->styleExtractor),
                'column' => new \Gene\BlueFoot\Setup\DataConverter\Renderer\Column($this->styleExtractor),
                'heading' => new \Gene\BlueFoot\Setup\DataConverter\Renderer\Heading(
                    $this->styleExtractor,
                    $headerHydratorMock
                ),
                'textarea' => new \Gene\BlueFoot\Setup\DataConverter\Renderer\Text(
                    $this->styleExtractor,
                    $textHydratorMock
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

        $masterFormat = $treeConverter->convert($original);

        $this->assertEquals(
            $expected,
            $masterFormat
        );
    }

    public function dataProviderRender()
    {
        return [
            [
                [
                    'css_classes' => 'primary',
                    'title' => 'Heading text',
                    'heading_type' => 'h2'
                ],
                '[{"type":"row","children":[{"type":"column","formData":{"width":"0.500","remove_padding":"1","css_classes":"","undefined":"","align":"","metric":"{\"margin\":\"- 5px - -\",\"padding\":\"- - - -\"}"},"children":[{"contentType":"heading","entityId":"1","formData":{"align":"","metric":""}}]}]}]',
                '<div data-role="row" style="display: flex;"><div data-role="column" style="width: 50%; margin: 0px 5px 0px 0px; padding: 0px 0px 0px 0px;"><h2 data-role="heading" class="primary">Heading text</h2></div></div>',
            ],
            [
                [
                    'css_classes' => '',
                    'textarea' => '<p><span style="text-decoration: underline;">fdsafsd</span></p><p><strong>Hello</strong></p>'
                ],
                '[{"type":"row","children":[{"contentType":"textarea","entityId":"27","formData":{"align":"center","metric":"{\"margin\":\"10px - - -\",\"padding\":\"- - - -\"}"}}]}]',
                '<div data-role="row"><div data-role="text" style="text-align: center; margin: 10px 0px 0px 0px; padding: 0px 0px 0px 0px;"><p><span style="text-decoration: underline;">fdsafsd</span></p><p><strong>Hello</strong></p></div></div>'
            ]
        ];
    }

    public function testRenderContentWithButtons()
    {
        $rendererPool = new \Gene\BlueFoot\Setup\DataConverter\RendererPool(
            [
                'row' => new \Gene\BlueFoot\Setup\DataConverter\Renderer\Row($this->styleExtractor),
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
