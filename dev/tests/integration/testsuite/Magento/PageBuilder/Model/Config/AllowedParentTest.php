<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Magento\PageBuilder\Model\Config;

use Magento\TestFramework\Helper\Bootstrap;

class AllowedParentTest extends \PHPUnit\Framework\TestCase
{
    /**
     * @var \Magento\PageBuilder\Model\Config\ContentType\Reader
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
            \Magento\PageBuilder\Model\Config\ContentType\Reader::class,
            ['fileResolver' => $this->fileResolverMock]
        );
    }

    public function testParentsAndChildrenConvertToAllowedParents()
    {
        $filePath = '/../../_files/allowed_parent/';
        $fileList = [
            file_get_contents(__DIR__ . $filePath . 'parents_and_children_allow.xml'),
            file_get_contents(__DIR__ . $filePath . 'parents_and_children_deny.xml'),
            file_get_contents(__DIR__ . $filePath . 'parents_allow.xml'),
            file_get_contents(__DIR__ . $filePath . 'parents_deny.xml'),
            file_get_contents(__DIR__ . $filePath . 'children_allow.xml'),
            file_get_contents(__DIR__ . $filePath . 'children_deny.xml'),
            file_get_contents(__DIR__ . $filePath . 'no_parents_and_children.xml'),
            file_get_contents(__DIR__ . $filePath . 'parents_allow_with_parent.xml'),
            file_get_contents(__DIR__ . $filePath . 'parents_deny_with_parent.xml'),
            file_get_contents(__DIR__ . $filePath . 'children_allow_with_child.xml'),
            file_get_contents(__DIR__ . $filePath . 'children_deny_with_child.xml'),
        ];
        $this->fileResolverMock->expects($this->once())
            ->method('get')
            ->with('content_type/*.xml', 'global')
            ->willReturn($fileList);
        $expected = include __DIR__ . '/../../_files/allowed_parent/expected_merged_array.php';
        $this->assertEquals($expected, $this->model->read('global'));
    }
}
