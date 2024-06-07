<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Magento\PageBuilder\Controller\Adminhtml\Template;

use Magento\Framework\App\Request\Http as HttpRequest;
use Magento\Framework\Filesystem;
use Magento\Framework\Filesystem\Directory\Write;
use Magento\Framework\Filesystem\DriverInterface;
use Magento\Framework\Image\Adapter\Gd2;
use Magento\Framework\Image\AdapterFactory;
use Magento\Framework\Serialize\Serializer\Json;
use Magento\MediaStorage\Helper\File\Storage\Database;
use Magento\PageBuilder\Api\TemplateRepositoryInterface;
use Magento\TestFramework\Helper\Bootstrap;
use Magento\TestFramework\ObjectManager;

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
     * @var Write|\PHPUnit\Framework\MockObject\MockObject
     */
    private $directoryWrite;

    /**
     * @var Filesystem|\PHPUnit\Framework\MockObject\MockObject
     */
    private $filesystem;

    /**
     * @var Database|\PHPUnit\Framework\MockObject\MockObject
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
     * @var Gd2|\PHPUnit\Framework\MockObject\MockObject
     */
    private $imageAdapter;

    /**
     * @var AdapterFactory|\PHPUnit\Framework\MockObject\MockObject
     */
    private $imageAdapterFactory;

    /**
     * @inheritDoc
     */
    protected function setUp(): void
    {
        parent::setUp();
        $this->objectManager = Bootstrap::getObjectManager();
        $this->templateRepository = $this->objectManager->get(TemplateRepositoryInterface::class);

        $this->directoryWrite = $this->getMockBuilder(Write::class)
            ->disableOriginalConstructor()
            ->getMock();
        $this->filesystem = $this->getMockBuilder(Filesystem::class)
            ->onlyMethods(['getDirectoryWrite'])
            ->disableOriginalConstructor()
            ->getMock();

        $this->mediaStorage = $this->getMockBuilder(Database::class)
            ->onlyMethods(['checkDbUsage', 'saveFile'])
            ->disableOriginalConstructor()
            ->getMock();

        $this->imageAdapter = $this->getMockBuilder(Gd2::class)
            ->onlyMethods(['open', 'resize', 'save'])
            ->disableOriginalConstructor()
            ->getMock();

        $this->imageAdapterFactory = $this->getMockBuilder(AdapterFactory::class)
            ->onlyMethods(['create'])
            ->disableOriginalConstructor()
            ->getMock();

        $this->saveController = $this->objectManager->create(
            \Magento\PageBuilder\Controller\Adminhtml\Template\Save::class,
            [
                'filesystem' => $this->filesystem,
                'mediaStorage' => $this->mediaStorage,
                'imageAdapterFactory' => $this->imageAdapterFactory
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
        $this->directoryWrite->expects(self::atLeastOnce())->method('getAbsolutePath')
            ->with('.template-manager')
            ->willReturn('absolute/path/.template-manager/');
        $this->directoryWrite->expects(self::atLeastOnce())->method('create')
            ->with('absolute/path/.template-manager/');
        $driver = $this->getMockBuilder(DriverInterface::class)
            ->disableOriginalConstructor()
            ->getMock();
        $this->directoryWrite->expects(self::atLeastOnce())->method('getDriver')
            ->willReturn($driver);
        $this->directoryWrite->expects(self::atLeastOnce())->method('getRelativePath')
            ->willReturn('.template-manager/automatedtemplate');
        $driver->expects(self::atLeastOnce())->method('filePutContents');
        $this->imageAdapterFactory->expects($this->once())
            ->method('create')
            ->willReturn($this->imageAdapter);

        $this->imageAdapter->expects($this->once())
            ->method('save')
            ->with(
                $this->stringContains('-thumb.jpg')
            );

        $this->filesystem->expects($this->once())
            ->method('getDirectoryWrite')
            ->willReturn($this->directoryWrite);

        $post = [
            'name' => 'Automated Template',
            'template' => '<div data-content-type="row"></div>',
            'createdFor' => 'any',
            // phpcs:disable Generic.Files.LineLength
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
        $this->assertStringContainsString('.template-manager/automatedtemplate', $template->getPreviewImage());
    }
}
