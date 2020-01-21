<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Magento\PageBuilder\Controller\Adminhtml\Template;

use Magento\PageBuilder\Api\TemplateRepositoryInterface;
use Magento\TestFramework\Helper\Bootstrap;
use Magento\TestFramework\ObjectManager;
use Magento\Framework\App\Request\Http as HttpRequest;
use Magento\Framework\Serialize\Serializer\Json;
use Magento\MediaStorage\Helper\File\Storage\Database;
use Magento\Framework\Filesystem;
use Magento\Framework\Filesystem\Directory\Write;

/**
 * Perform tests upon Template save controller
 *
 * @magentoAppArea adminhtml
 */
class SaveTest extends \Magento\TestFramework\TestCase\AbstractBackendController
{
    /**
     * @var TemplateRepositoryInterface
     */
    private $templateRepository;

    /**
     * @var ObjectManager
     */
    private $objectManager;

    /**
     * @var Write|\PHPUnit_Framework_MockObject_MockObject
     */
    private $directoryWrite;

    /**
     * @var Filesystem|\PHPUnit_Framework_MockObject_MockObject
     */
    private $filesystem;

    /**
     * @var Database|\PHPUnit_Framework_MockObject_MockObject
     */
    private $mediaStorage;

    /**
     * @var \Magento\PageBuilder\Controller\Adminhtml\Template\Save
     */
    private $saveController;

    /**
     * @var Json
     */
    private $serializer;

    /**
     * @inheritDoc
     */
    protected function setUp()
    {
        parent::setUp();
        $this->objectManager = Bootstrap::getObjectManager();
        $this->templateRepository = $this->objectManager->get(TemplateRepositoryInterface::class);

        $this->directoryWrite = $this->getMockBuilder(Write::class)
            ->setMethods(['writeFile'])
            ->disableOriginalConstructor()
            ->getMock();
        $this->filesystem = $this->getMockBuilder(Filesystem::class)
            ->setMethods(['getDirectoryWrite'])
            ->disableOriginalConstructor()
            ->getMock();

        $this->mediaStorage = $this->getMockBuilder(Database::class)
            ->setMethods(['checkDbUsage', 'saveFile'])
            ->disableOriginalConstructor()
            ->getMock();

        $this->saveController = $this->objectManager->create(
            \Magento\PageBuilder\Controller\Adminhtml\Template\Save::class,
            [
                'filesystem' => $this->filesystem,
                'mediaStorage' => $this->mediaStorage
            ]
        );

        $this->serializer = $this->objectManager->get(Json::class);
    }

    /**
     * Test saving a template using the controller
     *
     * @magentoDbIsolation enabled
     */
    public function testSaveAction()
    {
        // Disable DB media usage
        $this->mediaStorage->expects($this->once())
            ->method('checkDbUsage')
            ->willReturn(false);

        // Verify that the system attempts to write the file with the current name
        $this->directoryWrite->expects($this->once())
            ->method('writeFile')
            ->with(
                $this->stringContains('.template-manager/automatedtemplate'),
                $this->anything()
            );

        $this->filesystem->expects($this->once())
            ->method('getDirectoryWrite')
            ->willReturn($this->directoryWrite);

        $post = [
            'name' => 'Automated Template',
            'template' => '<div data-content-type="row"></div>',
            'createdFor' => 'any',
            'previewImage' => 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAMCAgICAgMCAgIDAwMDBAYEBAQEBAgGBgUGCQgKCgkICQkKDA8MCgsOCwkJDRENDg8QEBEQCgwSExIQEw8QEBD/2wBDAQMDAwQDBAgEBAgQCwkLEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBD/wAARCAAZABkDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAn/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFAEBAAAAAAAAAAAAAAAAAAAAAP/EABQRAQAAAAAAAAAAAAAAAAAAAAD/2gAMAwEAAhEDEQA/AJVAAAAAAAA//9k='
        ];
        $this->getRequest()->setPostValue($post)->setMethod(HttpRequest::METHOD_POST);
        $response = $this->saveController->execute();
        $response->renderResult($this->getResponse());

        $this->assertEquals(
            'application/json',
            $this->getResponse()->getHeader('Content-Type')->getFieldValue()
        );

        $response = $this->serializer->unserialize($this->getResponse()->getBody());
        $this->assertNotNull($response['status']);
        $this->assertEquals(
            'ok',
            $response['status'],
            isset($response['message']) ? $response['message'] : null
        );

        $template = $this->templateRepository->get($response['data']['id']);
        $this->assertEquals('Automated Template', $template->getName());
        $this->assertEquals('<div data-content-type="row"></div>', $template->getTemplate());
        $this->assertEquals('any', $template->getCreatedFor());
        $this->assertContains('.template-manager/automatedtemplate', $template->getPreviewImage());
    }
}
