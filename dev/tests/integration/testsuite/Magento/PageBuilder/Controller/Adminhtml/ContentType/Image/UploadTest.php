<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */
declare(strict_types=1);

namespace Magento\PageBuilder\Controller\Adminhtml\ContentType\Image;

use Magento\Framework\App\ObjectManager;
use Magento\Framework\Controller\Result\Json;
use Magento\Framework\Controller\Result\JsonFactory;
use Magento\Framework\File\Mime;
use Magento\Framework\File\Uploader;
use Magento\Framework\File\UploaderFactory;
use Magento\Framework\ObjectManagerInterface;
use Magento\PageBuilder\Controller\Adminhtml\ContentType\Image\Upload as UploadController;
use PHPUnit\Framework\MockObject\MockObject;
use PHPUnit\Framework\TestCase;

class UploadTest extends TestCase
{
    /**
     * @var UploadController
     */
    private $controller;

    /**
     * @var ObjectManagerInterface
     */
    private $objectManager;

    /**
     * @var UploaderFactory|MockObject
     */
    private $uploaderFactory;

    /**
     * @var Json|MockObject
     */
    private $resultJson;

    /**
     * @var JsonFactory|MockObject
     */
    private $resultJsonFactory;

    /**
     * @inheritdoc
     */
    protected function setUp(): void
    {
        $this->objectManager = ObjectManager::getInstance();

        $this->uploaderFactory = $this->createPartialMock(UploaderFactory::class, ['create']);

        $this->resultJson = $this->getMockBuilder(Json::class)
            ->setMethods(['setData'])
            ->disableOriginalConstructor()
            ->getMock();

        $this->resultJsonFactory = $this->getMockBuilder(JsonFactory::class)
            ->setMethods(['create'])
            ->disableOriginalConstructor()
            ->getMock();

        $this->resultJsonFactory->expects($this->once())
            ->method('create')
            ->willReturn($this->resultJson);

        $this->controller = $this->objectManager->create(UploadController::class, [
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
     * @magentoAppArea adminhtml
     */
    public function testFileValidationPassesWhenFileHasCorrectExtensionAndValidMimeType()
    {
        $valid_file_pathname = realpath(__DIR__ . '/../../../../_files/uploader/a.png');

        $this->setFilesGlobalMock($valid_file_pathname);
        $this->setUploaderMockForField('background_image');

        $this->resultJson->expects($this->once())
            ->method('setData')
            ->willReturnCallback(function ($result) {
                $this->assertNotEquals([
                    'error' => 'File validation failed.',
                    'errorcode' => 0
                ], $result);
            });

        $this->controller->execute();
    }

    /**
     * Assert that file validation fails when uploaded file has correct extension but invalid mime type
     * @magentoAppArea adminhtml
     */
    public function testFileValidationFailsWhenFileHasCorrectExtensionButInvalidMimeType()
    {
        $invalid_file_pathname = realpath(__DIR__ . '/../../../../_files/uploader/not-a.png');

        $this->setFilesGlobalMock($invalid_file_pathname);
        $this->setUploaderMockForField('background_image');

        $this->resultJson->expects($this->once())->method('setData')->willReturnCallback(function ($result) {
            $this->assertEquals([
                'error' => 'File validation failed.',
                'errorcode' => 0
            ], $result);
        });

        $this->controller->execute();
    }

    /**
     * Initiates Uploader object for `$fieldId` and returns as a result of `UploaderFactory::create()`
     *
     * @param string $fieldId
     * @return void
     */
    private function setUploaderMockForField(string $fieldId): void
    {
        $uploader = $this->objectManager->create(Uploader::class, [
            'fileId' => $fieldId,
            'fileMime' => $this->objectManager->create(Mime::class),
        ]);

        $this->uploaderFactory
            ->expects($this->once())
            ->method('create')
            ->will($this->returnValue($uploader));
    }

    /**
     * Mock that `$pathname` was uploaded (mock of `$_FILES` array)
     *
     * @param string $pathname
     * @return void
     */
    private function setFilesGlobalMock(string $pathname): void
    {
        $_FILES = [
            'background_image' => [
                'type' => 'image/png',
                'name' => basename($pathname),
                'tmp_name' => $pathname,
                'size' => filesize($pathname),
                'error' => UPLOAD_ERR_OK,
            ]
        ];
    }
}
