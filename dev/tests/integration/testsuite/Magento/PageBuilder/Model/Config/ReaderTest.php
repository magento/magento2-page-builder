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
     * @var \Magento\PageBuilder\Model\Config\Reader
     */
    private $model;

    /**
     * @var \Magento\Framework\Config\FileResolverInterface|\PHPUnit_Framework_MockObject_MockObject
     */
    private $fileResolverMock;

    public function setUp()
    {
        $this->fileResolverMock = $this->getMockForAbstractClass(
            \Magento\Framework\Config\FileResolverInterface::class
        );
        $objectManager = Bootstrap::getObjectManager();
        $this->model = $objectManager->create(
            \Magento\PageBuilder\Model\Config\Reader::class,
            ['fileResolver' => $this->fileResolverMock]
        );
    }

    public function testMerge()
    {
        $fileList = [
            file_get_contents(__DIR__ . '/../../_files/content_type/test_content_type1.xml'),
            file_get_contents(__DIR__ . '/../../_files/content_type/test_content_type2.xml'),
        ];
        $this->fileResolverMock->expects($this->any())
            ->method('get')
            ->with('content_types.xml', 'global')
            ->willReturn($fileList);
        $expected = include __DIR__ . '/../../_files/content_type/expected_merged_array.php';
        $this->assertEquals($expected, $this->model->read('global'));
    }
}
