<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */
namespace Magento\PageBuilder\Test\Unit\Controller\Adminhtml\ContentType\Image;

use Magento\Framework\File\Mime;
use Magento\PageBuilder\Controller\Adminhtml\ContentType\Image\Upload as Controller;

/**
 * Class UploadTest
 */
class UploadTest extends \PHPUnit\Framework\TestCase
{
    /**
     * Subject under test
     * @var \Magento\PageBuilder\Controller\Adminhtml\ContentType\Image\Upload
     */
    private $controller;

    /**
     * @var \Magento\Framework\TestFramework\Unit\Helper\ObjectManager
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

    protected function setUp()
    {
        $this->objectManager = new \Magento\Framework\TestFramework\Unit\Helper\ObjectManager($this);

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

        $this->controller = $this->objectManager->getObject(Controller::class, [
            'resultJsonFactory' => $this->resultJsonFactory,
            'uploaderFactory' => $this->uploaderFactory
        ]);
    }

    public function testFileValidationPassesWhenFileHasCorrectExtensionAndValidMimeType()
    {
        $valid_file_pathname = realpath(dirname(__FILE__) . '/../../../../_files/a.png');

        $_FILES = [
            'background_image' => [
                'type' => 'image/png',
                'name' => basename($valid_file_pathname),
                'tmp_name' => $valid_file_pathname,
                'size' => filesize($valid_file_pathname),
                'error' => UPLOAD_ERR_OK,
            ]
        ];

        $uploader = $this->objectManager->getObject(\Magento\Framework\File\Uploader::class, [
            'fileId' => 'background_image',
            'fileMime' => $this->objectManager->getObject(Mime::class),
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

    public function testFileValidationFailsWhenFileHasCorrectExtensionButInvalidMimeType()
    {
        $invalid_file_pathname = realpath(dirname(__FILE__) . '/../../../../_files/not-a.png');

        $_FILES = [
            'background_image' => [
                'type' => 'image/png',
                'name' => basename($invalid_file_pathname),
                'tmp_name' => $invalid_file_pathname,
                'size' => filesize($invalid_file_pathname),
                'error' => UPLOAD_ERR_OK,
            ]
        ];

        $uploader = $this->objectManager->getObject(\Magento\Framework\File\Uploader::class, [
            'fileId' => 'background_image',
            'fileMime' => $this->objectManager->getObject(Mime::class),
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
