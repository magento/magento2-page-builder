<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Magento\PageBuilder\Model\Config\MenuSection;

use Magento\TestFramework\Helper\Bootstrap;

class ReaderTest extends \PHPUnit\Framework\TestCase
{
    /**
     * @var \Magento\PageBuilder\Model\Config\MenuSection\Reader
     */
    private $model;

    /**
     * @var \Magento\PageBuilder\Model\Config\FileResolver|\PHPUnit\Framework\MockObject\MockObject
     */
    private $fileResolverMock;

    protected function setUp(): void
    {
        $objectManager = Bootstrap::getObjectManager();

        $this->fileResolverMock = $this->createMock(
            \Magento\PageBuilder\Model\Config\FileResolver::class
        );

        $this->model = $objectManager->create(
            \Magento\PageBuilder\Model\Config\MenuSection\Reader::class,
            ['fileResolver' => $this->fileResolverMock]
        );
    }

    public function testPartial()
    {
        $this->expectException(\Magento\Framework\Exception\LocalizedException::class);
        $file = file_get_contents(__DIR__ . '/../../../_files/content_type/menu_section3.xml');
        $this->fileResolverMock->expects($this->once())
            ->method('get')
            ->willReturn([$file]);
        $this->model->read('global');
    }

    public function testMergeCompleteAndPartial()
    {
        $fileList = [
            file_get_contents(__DIR__ . '/../../../_files/content_type/menu_section1.xml'),
            file_get_contents(__DIR__ . '/../../../_files/content_type/menu_section2.xml'),
            file_get_contents(__DIR__ . '/../../../_files/content_type/menu_section3.xml'),
        ];
        $this->fileResolverMock->expects($this->once())
            ->method('get')
            ->with('menu_section.xml', 'global')
            ->willReturn($fileList);
        $expected = include __DIR__ . '/../../../_files/content_type/menu_sections_expected_merged_array.php';
        $this->assertEquals($expected, $this->model->read('global'));
    }
}
