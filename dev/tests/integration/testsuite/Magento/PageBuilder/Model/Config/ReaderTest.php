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
     * @var \Magento\PageBuilder\Model\Config\CompositeReader
     */
    private $model;

    /**
     * @var \Magento\Framework\Config\FileResolverInterface|\PHPUnit_Framework_MockObject_MockObject
     */
    private $groupsFileResolverMock;

    /**
     * @var \Magento\PageBuilder\Model\Config\ContentTypes\FileResolver|\PHPUnit_Framework_MockObject_MockObject
     */
    private $contentTypesFileResolverMock;

    protected function setUp()
    {
        $objectManager = Bootstrap::getObjectManager();

        $this->groupsFileResolverMock = $this->createMock(
            \Magento\Framework\Config\FileResolverInterface::class
        );
        $this->contentTypesFileResolverMock = $this->createMock(
            \Magento\PageBuilder\Model\Config\ContentTypes\FileResolver::class
        );

        $groupsReader = $objectManager->create(
            \Magento\PageBuilder\Model\Config\Groups\Reader::class,
            ['fileResolver' => $this->groupsFileResolverMock]
        );
        $contentTypesReader = $objectManager->create(
            \Magento\PageBuilder\Model\Config\ContentTypes\Reader::class,
            ['fileResolver' => $this->contentTypesFileResolverMock]
        );

        $this->model = $objectManager->create(
            \Magento\PageBuilder\Model\Config\CompositeReader::class,
            ['readers' => [$groupsReader, $contentTypesReader]]
        );
    }

    public function testMerge()
    {
        $groupsFileList = [
            file_get_contents(__DIR__ . '/../../_files/content_type/groups1.xml'),
            file_get_contents(__DIR__ . '/../../_files/content_type/groups2.xml'),
        ];
        $contentTypesFileList = [
            file_get_contents(__DIR__ . '/../../_files/content_type/type1_content_type1.xml'),
            file_get_contents(__DIR__ . '/../../_files/content_type/type1_content_type2.xml'),
            file_get_contents(__DIR__ . '/../../_files/content_type/type2_content_type1.xml'),
            file_get_contents(__DIR__ . '/../../_files/content_type/type2_content_type2.xml'),
            file_get_contents(__DIR__ . '/../../_files/content_type/type3_content_type.xml'),
            file_get_contents(__DIR__ . '/../../_files/content_type/type4_content_type.xml'),
        ];

        $this->groupsFileResolverMock->expects($this->any())
            ->method('get')
            ->with('groups.xml', 'global')
            ->willReturn($groupsFileList);
        $this->contentTypesFileResolverMock->expects($this->any())
            ->method('get')
            ->with('*.xml', 'content_types')
            ->willReturn($contentTypesFileList);

        $expected = include __DIR__ . '/../../_files/content_type/expected_merged_array.php';
        $this->assertEquals($expected, $this->model->read());
    }
}
