<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Magento\PageBuilder\Controller\Adminhtml\ContentType\Image;

use Magento\Framework\File\Mime;
use Magento\PageBuilder\Controller\Adminhtml\ContentType\Image\Upload as Controller;

/**
 * Class UploadTest
 */
class UploadTest extends \PHPUnit\Framework\TestCase
{
    /**
     * @var \Magento\PageBuilder\Controller\Adminhtml\ContentType\Image\Upload
     */
    private $controller;

    /**
     * @var \Magento\Framework\ObjectManagerInterface
     */
    private $objectManager;

    /**
     * @var \Magento\Framework\File\UploaderFactory|\PHPUnit_Framework_MockObject_MockObject
     */
    private $uploaderFactory;

    /**
     * @var \Magento\Framework\Controller\Result\Json|\PHPUnit_Framework_MockObject_MockObject
     */
    private $resultJson;

    /**
     * @var \Magento\Framework\Controller\Result\JsonFactory|\PHPUnit_Framework_MockObject_MockObject
     */
    private $resultJsonFactory;

    /**
     * @inheritdoc
     */
    protected function setUp()
    {
        $this->objectManager = \Magento\TestFramework\Helper\Bootstrap::getObjectManager();

        $this->uploaderFactory = $this->createPartialMock(\Magento\Framework\File\UploaderFactory::class, ['create']);

        $this->resultJson = $this->getMockBuilder(\Magento\Framework\Controller\Result\Json::class)
            ->setMethods(['setData'])
            ->disableOriginalConstructor()
            ->getMock();

        $this->resultJsonFactory = $this->getMockBuilder(\Magento\Framework\Controller\Result\JsonFactory::class)
            ->setMethods(['create'])
            ->disableOriginalConstructor()
            ->getMock();

        $this->resultJsonFactory->expects($this->once())->method('create')->willReturn($this->resultJson);

        $this->controller = $this->objectManager->create(Controller::class, [
            'resultJsonFactory' => $this->resultJsonFactory,
            'uploaderFactory' => $this->uploaderFactory
        ]);
    }

    /**
     * @inheritdoc
     */
    protected function tearDown()
    {
        $_FILES = [];
    }

    /**
     * Assert that file validation passes when uploaded file has correct extension and valid mime type
     */
    public function testFileValidationPassesWhenFileHasCorrectExtensionAndValidMimeType()
    {
        $valid_file_pathname = realpath(dirname(__FILE__) . '/../../../../_files/uploader/a.png');

        $_FILES = [
            'background_image' => [
                'type' => 'image/png',
                'name' => basename($valid_file_pathname),
                'tmp_name' => $valid_file_pathname,
                'size' => filesize($valid_file_pathname),
                'error' => UPLOAD_ERR_OK,
            ]
        ];

        $uploader = $this->objectManager->create(\Magento\Framework\File\Uploader::class, [
            'fileId' => 'background_image',
            'fileMime' => $this->objectManager->create(Mime::class),
        ]);

        $this->uploaderFactory
            ->expects($this->once())
            ->method('create')
            ->will($this->returnValue($uploader));

        $this->resultJson->expects($this->once())->method('setData')->willReturnCallback(function ($result) {
            $this->assertNotEquals([
                'error' => 'File validation failed.',
                'errorcode' => 0
            ], $result);
        });

        $this->controller->execute();
    }

    /**
     * Assert that file validation fails when uploaded file has correct extension but invalid mime type
     */
    public function testFileValidationFailsWhenFileHasCorrectExtensionButInvalidMimeType()
    {
        $invalid_file_pathname = realpath(dirname(__FILE__) . '/../../../../_files/uploader/not-a.png');

        $_FILES = [
            'background_image' => [
                'type' => 'image/png',
                'name' => basename($invalid_file_pathname),
                'tmp_name' => $invalid_file_pathname,
                'size' => filesize($invalid_file_pathname),
                'error' => UPLOAD_ERR_OK,
            ]
        ];

        $uploader = $this->objectManager->create(\Magento\Framework\File\Uploader::class, [
            'fileId' => 'background_image',
            'fileMime' => $this->objectManager->create(Mime::class),
        ]);

        $this->uploaderFactory
            ->expects($this->once())
            ->method('create')
            ->will($this->returnValue($uploader));

        $this->resultJson->expects($this->once())->method('setData')->willReturnCallback(function ($result) {
            $this->assertEquals([
                'error' => 'File validation failed.',
                'errorcode' => 0
            ], $result);
        });

        $this->controller->execute();
    }
}
