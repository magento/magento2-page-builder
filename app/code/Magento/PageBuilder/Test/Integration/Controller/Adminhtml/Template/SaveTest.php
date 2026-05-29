<?php
/**
 * Copyright 2020 Adobe
 * All Rights Reserved.
 */
declare(strict_types=1);

namespace Magento\PageBuilder\Test\Integration\Controller\Adminhtml\Template;

use Magento\Framework\App\Request\Http as HttpRequest;
use Magento\Framework\Exception\LocalizedException;
use Magento\Framework\Filesystem;
use Magento\Framework\Filesystem\Directory\Write;
use Magento\Framework\Filesystem\DriverInterface;
use Magento\Framework\Image\Adapter\Gd2;
use Magento\Framework\Image\AdapterFactory;
use Magento\Framework\Serialize\Serializer\Json;
use Magento\MediaStorage\Helper\File\Storage\Database;
use Magento\PageBuilder\Api\TemplateRepositoryInterface;
use Magento\PageBuilder\Controller\Adminhtml\Template\Save as TemplateSaveController;
use Magento\TestFramework\Helper\Bootstrap;
use Magento\TestFramework\ObjectManager;
use PHPUnit\Framework\MockObject\MockObject;

/**
 * Perform tests upon Template save controller
 *
 * @magentoAppArea adminhtml
 *
 * @SuppressWarnings(PHPMD.CouplingBetweenObjects)
 */
class SaveTest extends \Magento\TestFramework\TestCase\AbstractBackendController
{
    /**
     * @var ObjectManager
     */
    private $objectManager;

    /**
     * @var TemplateSaveController
     */
    private $templateSaveController;

    /**
     * @inheritDoc
     */
    protected function setUp(): void
    {
        parent::setUp();
        $this->objectManager = Bootstrap::getObjectManager();
        $this->templateSaveController = $this->objectManager->create(
            TemplateSaveController::class,
            [
                'filesystem' => $this->getFileSystem(),
                'mediaStorage' => $this->getMediaStorage(),
                'imageAdapterFactory' => $this->getImageAdapterFactory()
            ]
        );
    }

    /**
     * Assert response data if previewImage POST value is absent.
     * @magentoDbIsolation enabled
     *
     * @return void
     */
    public function testSaveTemplateNoPreviewImage()
    {
        $post = [
            'name' => 'Automated Template',
            'template' => '<div data-content-type="row"></div>',
            'createdFor' => 'any'
        ];
        $this->assertArrayNotHasKey(
            'preview_image',
            $this->getControllerResponse($post)['data'],
            'Result data should not contain "preview_image" property'
        );
    }

    /**
     * Assert response data contains error if overflowed image data received from POST request.
     * If canvas size is overflowed on frontend, `data:,` will return in 'previewImage'.
     * @magentoDbIsolation enabled
     *
     * @return void
     */
    public function testSaveTemplateOverflowMaximumCanvasSize()
    {
        $post = [
            'name' => 'Automated Template',
            'template' => '<div data-content-type="row"></div>',
            'createdFor' => 'any',
            'previewImage' => 'data:,'
        ];
        $response = $this->getControllerResponse($post);
        $this->assertEquals(
            'error',
            $response['status']
        );
        $this->assertEquals(
            'Unable to upload image.',
            $response['message']
        );
    }

    /**
     * Test saving a template using the controller.
     * @magentoDbIsolation enabled
     *
     * @return void
     * @throws LocalizedException
     */
    public function testSaveAction()
    {
        $post = [
            'name' => 'Automated Template',
            'template' => '<div data-content-type="row"></div>',
            'createdFor' => 'any',
            // phpcs:disable Generic.Files.LineLength
            'previewImage' => 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAMCAgICAgMCAgIDAwMDBAYEBAQEBAgGBgUGCQgKCgkICQkKDA8MCgsOCwkJDRENDg8QEBEQCgwSExIQEw8QEBD/2wBDAQMDAwQDBAgEBAgQCwkLEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBD/wAARCAAZABkDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAn/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFAEBAAAAAAAAAAAAAAAAAAAAAP/EABQRAQAAAAAAAAAAAAAAAAAAAAD/2gAMAwEAAhEDEQA/AJVAAAAAAAA//9k='
        ];

        $response = $this->getControllerResponse($post);
        $this->assertEquals(
            'application/json',
            $this->getResponse()->getHeader('Content-Type')->getFieldValue()
        );

        $this->assertNotNull($response['status']);
        $this->assertEquals(
            'ok',
            $response['status'],
            $response['message'] ?? null
        );

        $template = $this->getTemplateRepository()->get($response['data']['id']);
        $this->assertEquals('Automated Template', $template->getName());
        $this->assertEquals('<div data-content-type="row"></div>', $template->getTemplate());
        $this->assertEquals('any', $template->getCreatedFor());
        $this->assertStringContainsString('.template-manager/automatedtemplate', $template->getPreviewImage());
    }

    /**
     * Perform POST request and unserialize response.
     *
     * @param array $post
     * @return array
     */
    private function getControllerResponse(array $post): array
    {
        $this->getRequest()->setPostValue($post)->setMethod(HttpRequest::METHOD_POST);
        $response = $this->templateSaveController->execute();
        $response->renderResult($this->getResponse());
        return $this->getSerializer()->unserialize($this->getResponse()->getBody());
    }

    /**
     * Create DirectoryWrite mock.
     *
     * @return (Write&MockObject)|MockObject
     */
    private function getDirectoryWrite(): Write|MockObject
    {
        $directoryWrite = $this->getMockBuilder(Write::class)
            ->disableOriginalConstructor()
            ->getMock();
        $directoryWrite->expects($this->any())
            ->method('getAbsolutePath')
            ->with('.template-manager')
            ->willReturn('absolute/path/.template-manager/');
        $directoryWrite->expects($this->any())
            ->method('create')
            ->with('absolute/path/.template-manager/');
        $directoryWrite->expects($this->any())
            ->method('getDriver')
            ->willReturn($this->getDriver());
        $directoryWrite->expects($this->any())
            ->method('getRelativePath')
            ->willReturn('.template-manager/automatedtemplate');

        return $directoryWrite;
    }

    /**
     * Create Driver mock.
     *
     * @return (DriverInterface&MockObject)|MockObject
     */
    private function getDriver(): DriverInterface|MockObject
    {
        $driver = $this->getMockBuilder(DriverInterface::class)
            ->disableOriginalConstructor()
            ->getMock();
        $driver->expects($this->any())->method('filePutContents');
        return $driver;
    }

    /**
     * Retrieve TemplateRepository.
     *
     * @return TemplateRepositoryInterface
     */
    private function getTemplateRepository(): TemplateRepositoryInterface
    {
        return $this->objectManager->get(TemplateRepositoryInterface::class);
    }

    /**
     * Create FileSystem mock.
     *
     * @return (Filesystem&MockObject)|MockObject
     */
    private function getFileSystem(): FileSystem|MockObject
    {
        $filesystem = $this->getMockBuilder(Filesystem::class)
            ->onlyMethods(['getDirectoryWrite'])
            ->disableOriginalConstructor()
            ->getMock();
        $filesystem->expects($this->any())
            ->method('getDirectoryWrite')
            ->willReturn($this->getDirectoryWrite());

        return $filesystem;
    }

    /**
     * Create MediaStorage mock.
     *
     * @return (Database&MockObject)|MockObject
     */
    private function getMediaStorage(): Database|MockObject
    {
        return $this->getMockBuilder(Database::class)
            ->onlyMethods(['checkDbUsage', 'saveFile'])
            ->disableOriginalConstructor()
            ->getMock();
    }

    /**
     * Create ImageAdapterFactory mock.
     *
     * @return (AdapterFactory&MockObject)|MockObject
     */
    private function getImageAdapterFactory(): AdapterFactory|MockObject
    {
        $imageAdapterFactory = $this->getMockBuilder(AdapterFactory::class)
            ->onlyMethods(['create'])
            ->disableOriginalConstructor()
            ->getMock();
        $imageAdapterFactory->expects($this->any())
            ->method('create')
            ->willReturn($this->getImageAdapter());

        return $imageAdapterFactory;
    }

    /**
     * Create ImageAdapter mock.
     *
     * @return (Gd2&MockObject)|MockObject
     */
    private function getImageAdapter(): Gd2|MockObject
    {
        $imageAdapter = $this->getMockBuilder(Gd2::class)
            ->onlyMethods(['open', 'resize', 'save'])
            ->disableOriginalConstructor()
            ->getMock();
        $imageAdapter->expects($this->any())
            ->method('save')
            ->with(
                $this->stringContains('-thumb.jpg')
            );

        return $imageAdapter;
    }

    /**
     * Retrieve Json serializer.
     *
     * @return Json
     */
    private function getSerializer(): Json
    {
        return $this->objectManager->get(Json::class);
    }
}
