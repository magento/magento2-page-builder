<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */
namespace Magento\PageBuilder\Setup\DataConverter;

use Magento\Framework\ObjectManagerInterface;
use Magento\TestFramework\Helper\Bootstrap;

class MixedToPageBuilderTest extends \PHPUnit\Framework\TestCase
{
    /**
     * @param $originalContentFileName
     * @param $migratedContentFileName
     * @dataProvider convertDataProvider
     */
    public function testConvert($originalContentFileName, $migratedContentFileName)
    {
        $serializer = new \Magento\Framework\Serialize\Serializer\Json();
        $rendererPool = new \Gene\BlueFoot\Setup\DataConverter\RendererPool(
            [
                'default' => new \Gene\BlueFoot\Setup\DataConverter\Renderer\Unmigrated($serializer),
                'custom' => new \Magento\TestPageBuilderDataMigration\Renderer\Custom()
            ]
        );
        $childrenExtractorPool = new \Gene\BlueFoot\Setup\DataConverter\ChildrenExtractorPool(
            [
                'default' => new \Gene\BlueFoot\Setup\DataConverter\ChildrenExtractor\Dummy()
            ]
        );
        $treeConverter = new \Gene\BlueFoot\Setup\DataConverter\TreeConverter(
            $rendererPool,
            $childrenExtractorPool,
            $serializer
        );
        $mixedToPageBuilderConverter = new \Gene\BlueFoot\Setup\DataConverter\MixedToPageBuilder(
            $treeConverter,
            new \Gene\BlueFoot\Setup\DataConverter\Validator($serializer)
        );
        $this->assertEquals(
            file_get_contents(__DIR__ . '/../../_files/' . $migratedContentFileName),
            $mixedToPageBuilderConverter->convert(
                file_get_contents(__DIR__ . '/../../_files/' . $originalContentFileName)
            )
        );
    }

    /**
     * @return array
     */
    public function convertDataProvider()
    {
        return [
            [
                'mixed.html',
                'mixed_migrated.html'
            ],
            [
                'mixed_multiple_content_types.html',
                'mixed_multiple_content_types_migrated.html'
            ]
        ];
    }
}
