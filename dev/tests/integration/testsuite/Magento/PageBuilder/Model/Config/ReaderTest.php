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
     * @var \Magento\PageBuilder\Model\Config\FileResolver|\PHPUnit_Framework_MockObject_MockObject
     */
    private $groupsFileResolverMock;

    /**
     * @var \Magento\PageBuilder\Model\Config\FileResolver|\PHPUnit_Framework_MockObject_MockObject
     */
    private $contentTypesFileResolverMock;

    protected function setUp()
    {
        $this->objectManager = Bootstrap::getObjectManager();

        $this->groupsFileResolverMock = $this->createMock(
            \Magento\PageBuilder\Model\Config\FileResolver::class
        );
        $this->contentTypesFileResolverMock = $this->createMock(
            \Magento\PageBuilder\Model\Config\FileResolver::class
        );

        $groupsReader = $this->objectManager->create(
            \Magento\PageBuilder\Model\Config\Group\Reader::class,
            ['fileResolver' => $this->groupsFileResolverMock]
        );
        $contentTypesReader = $this->objectManager->create(
            \Magento\PageBuilder\Model\Config\ContentType\Reader::class,
            ['fileResolver' => $this->contentTypesFileResolverMock]
        );

        $this->model = $this->objectManager->create(
            \Magento\PageBuilder\Model\Config\CompositeReader::class,
            ['readers' => [$groupsReader, $contentTypesReader]]
        );
    }

    public function testMerge()
    {
        $groupsFileList = [
            file_get_contents(__DIR__ . '/../../_files/content_type/groups1.xml'),
            file_get_contents(__DIR__ . '/../../_files/content_type/groups2.xml'),
            file_get_contents(__DIR__ . '/../../_files/content_type/groups3.xml')
        ];
        $contentTypesFiles = [
            file_get_contents(__DIR__ . '/../../_files/content_type/type1_content_type1.xml'),
            file_get_contents(__DIR__ . '/../../_files/content_type/type1_content_type2.xml'),
            file_get_contents(__DIR__ . '/../../_files/content_type/type2_content_type1.xml'),
            file_get_contents(__DIR__ . '/../../_files/content_type/type2_content_type2.xml'),
            file_get_contents(__DIR__ . '/../../_files/content_type/type3_content_type1.xml'),
            file_get_contents(__DIR__ . '/../../_files/content_type/type3_content_type2.xml')
        ];

        $this->groupsFileResolverMock->expects($this->any())
            ->method('get')
            ->with('group.xml', 'global')
            ->willReturn($groupsFileList);
        $this->contentTypesFileResolverMock->expects($this->any())
            ->method('get')
            ->with('content_type/*.xml', 'global')
            ->willReturn($contentTypesFiles);

        $expected = include __DIR__ . '/../../_files/content_type/expected_merged_array.php';
        $this->assertEquals($expected, $this->model->read());
    }
}
