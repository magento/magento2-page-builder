<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */
namespace Magento\PageBuilderDataMigration\Setup\DataConverter;

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
        $objectManager = Bootstrap::getObjectManager();
        $mixedToPageBuilderConverter = $objectManager->create(
            \Magento\PageBuilderDataMigration\Setup\DataConverter\MixedToPageBuilder::class
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
