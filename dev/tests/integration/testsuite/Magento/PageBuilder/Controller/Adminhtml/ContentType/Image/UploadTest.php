<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */
declare(strict_types=1);

namespace Magento\PageBuilder\Controller\Adminhtml\ContentType\Image;

use Magento\Framework\App\Request\Http as HttpRequest;
use Magento\Framework\Exception\FileSystemException;
use Magento\Framework\Filesystem;
use Magento\Framework\Filesystem\DirectoryList;
use Magento\TestFramework\TestCase\AbstractBackendController;

/**
 * @magentoAppArea adminhtml
 */
class UploadTest extends AbstractBackendController
{
    private const URI = 'backend/pagebuilder/contentType/image_upload';

    /**
     * @inheritdoc
     */
    protected function tearDown(): void
    {
        $_FILES = [];
        parent::tearDown();
    }

    /**
     * Assert that file validation passes when uploaded file has correct extension and valid mime type
     */
    public function testFileValidationPassesWhenFileHasCorrectExtensionAndValidMimeType()
    {
        $filePath = realpath(__DIR__ . '/../../../../_files/uploader/a.png');

        $this->createUploadFixture($filePath);
        $this->makeRequest();
        $this->assertEquals(200, $this->getResponse()->getStatusCode());
        $result = json_decode($this->getResponse()->getBody(), true);
        $this->assertEquals(0, $result['error']);
        $this->assertNotEmpty($result['url']);
    }

    /**
     * Assert that file validation fails when uploaded file has correct extension but invalid mime type
     */
    public function testFileValidationFailsWhenFileHasCorrectExtensionButInvalidMimeType()
    {
        $filePath = realpath(__DIR__ . '/../../../../_files/uploader/not-a.png');

        $this->createUploadFixture($filePath);
        $this->makeRequest();
        $this->assertEquals(200, $this->getResponse()->getStatusCode());
        $result = json_decode($this->getResponse()->getBody(), true);
        $this->assertEquals(
            [
                'error' => 'File validation failed.',
                'errorcode' => 0
            ],
            $result
        );
    }

    /**
     * Assert that file url should be based on backend base url
     *
     * @magentoConfigFixture default_store web/unsecure/base_url http://storefront.magento.test/
     * @magentoConfigFixture default_store web/secure/base_url https://storefront.magento.test/
     */
    public function testFileUrlShouldBeBaseOnBackendBaseUrl()
    {
        $filePath = realpath(__DIR__ . '/../../../../_files/uploader/a.png');

        $this->createUploadFixture($filePath);
        $this->makeRequest();
        $this->assertEquals(200, $this->getResponse()->getStatusCode());
        $result = json_decode($this->getResponse()->getBody(), true);
        $this->assertStringStartsWith('http://localhost/media/', $result['url']);
    }

    /**
     * Initiates request
     *
     * @param string $fileParam
     */
    private function makeRequest(string $fileParam = 'image'): void
    {
        $this->getRequest()
            ->setParams(['param_name' => $fileParam])
            ->setMethod(HttpRequest::METHOD_POST);
        $this->dispatch(self::URI);
    }

    /**
     * Creates a fixture for testing uploaded file
     *
     * @param string $filePath
     * @param string $fileType
     * @param string $fileParam
     * @return void
     * @throws FileSystemException
     */
    private function createUploadFixture(
        string $filePath,
        string $fileType = 'image/png',
        string $fileParam = 'image'
    ): void {
        $filename = basename($filePath);
        $filesize = filesize($filePath);
        /** @var \Magento\TestFramework\App\Filesystem $filesystem */
        $filesystem = $this->_objectManager->get(Filesystem::class);
        $tmpDir = $filesystem->getDirectoryWrite(DirectoryList::SYS_TMP);
        // phpcs:ignore
        $subDir = md5(get_class($this));
        $tmpDir->create($subDir);
        $tmpPath = $tmpDir->getAbsolutePath("{$subDir}/{$filename}");
        copy($filePath, $tmpPath);
        $_FILES = [
            $fileParam => [
                'type' => $fileType,
                'name' => $filename,
                'tmp_name' => $tmpPath,
                'size' => $filesize,
                'error' => UPLOAD_ERR_OK,
            ],
        ];
    }
}
