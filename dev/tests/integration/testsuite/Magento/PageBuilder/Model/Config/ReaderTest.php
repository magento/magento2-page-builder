<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

namespace Magento\PageBuilder\Model\Config;

use Magento\TestFramework\Helper\Bootstrap;

class ReaderTest extends \PHPUnit\Framework\TestCase
{
    /**
     * @var \Magento\Framework\ObjectManagerInterface
     */
    private $objectManager;

    /**
     * @var \Magento\PageBuilder\Model\Config\CompositeReader
     */
    private $model;

    /**
     * @var \Magento\PageBuilder\Model\Config\FileResolver|\PHPUnit\Framework\MockObject\MockObject
     */
    private $menuSectionsFileResolverMock;

    /**
     * @var \Magento\PageBuilder\Model\Config\FileResolver|\PHPUnit\Framework\MockObject\MockObject
     */
    private $contentTypesFileResolverMock;

    protected function setUp(): void
    {
        $this->objectManager = Bootstrap::getObjectManager();

        $this->menuSectionsFileResolverMock = $this->createMock(
            \Magento\PageBuilder\Model\Config\FileResolver::class
        );
        $this->contentTypesFileResolverMock = $this->createMock(
            \Magento\PageBuilder\Model\Config\FileResolver::class
        );

        $menuSectionsReader = $this->objectManager->create(
            \Magento\PageBuilder\Model\Config\MenuSection\Reader::class,
            ['fileResolver' => $this->menuSectionsFileResolverMock]
        );
        $contentTypesReader = $this->objectManager->create(
            \Magento\PageBuilder\Model\Config\ContentType\Reader::class,
            ['fileResolver' => $this->contentTypesFileResolverMock]
        );

        $this->model = $this->objectManager->create(
            \Magento\PageBuilder\Model\Config\CompositeReader::class,
            ['readers' => [$menuSectionsReader, $contentTypesReader]]
        );
    }

    public function testMerge()
    {
        $menuSectionsFileList = [
            file_get_contents(__DIR__ . '/../../_files/content_type/menu_section1.xml'),
            file_get_contents(__DIR__ . '/../../_files/content_type/menu_section2.xml'),
            file_get_contents(__DIR__ . '/../../_files/content_type/menu_section3.xml')
        ];
        $contentTypesFiles = [
            file_get_contents(__DIR__ . '/../../_files/content_type/type1_content_type1.xml'),
            file_get_contents(__DIR__ . '/../../_files/content_type/type1_content_type2.xml'),
            file_get_contents(__DIR__ . '/../../_files/content_type/type2_content_type1.xml'),
            file_get_contents(__DIR__ . '/../../_files/content_type/type2_content_type2.xml'),
            file_get_contents(__DIR__ . '/../../_files/content_type/type3_content_type1.xml'),
            file_get_contents(__DIR__ . '/../../_files/content_type/type3_content_type2.xml')
        ];

        $this->menuSectionsFileResolverMock->expects($this->any())
            ->method('get')
            ->with('menu_section.xml', 'global')
            ->willReturn($menuSectionsFileList);
        $this->contentTypesFileResolverMock->expects($this->any())
            ->method('get')
            ->with('content_type/*.xml', 'global')
            ->willReturn($contentTypesFiles);

        $expected = include __DIR__ . '/../../_files/content_type/expected_merged_array.php';
        $this->assertEquals($expected, $this->model->read());
    }
}
