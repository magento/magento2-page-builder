<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */
declare(strict_types=1);

namespace Magento\PageBuilder\Model;

use Magento\MediaStorage\Helper\File\Storage;
use Magento\MediaStorage\Helper\File\Storage\Database;
use Magento\MediaStorage\Model\File\Uploader;
use Magento\Framework\App\Filesystem\DirectoryList;
use Magento\Framework\Filesystem;
use Magento\MediaStorage\Model\File\Validator\NotProtectedExtension;

/**
 * Upload image content to storage
 */
class ImageContentUploader extends Uploader
{
    /**
     * Default MIME type
     */
    private const DEFAULT_MIME_TYPE = 'application/octet-stream';

    /**
     * Filename prefix for temporary files
     *
     * @var string
     */
    private $filePrefix = 'magento_api';

    /**
     * @var \Magento\Framework\Filesystem\Directory\WriteInterface
     */
    private $systemTmpDirectory;

    /**
     * @param Database $coreFileStorageDb
     * @param Storage $coreFileStorage
     * @param NotProtectedExtension $validator
     * @param Filesystem $filesystem
     * @throws \Magento\Framework\Exception\FileSystemException
     */
    public function __construct(
        Database $coreFileStorageDb,
        Storage $coreFileStorage,
        NotProtectedExtension $validator,
        Filesystem $filesystem
    ) {
        $this->_validator = $validator;
        $this->_coreFileStorage = $coreFileStorage;
        $this->_coreFileStorageDb = $coreFileStorageDb;
        $this->systemTmpDirectory = $filesystem->getDirectoryWrite(DirectoryList::SYS_TMP);
    }

    /**
     * Upload file data to storage
     *
     * @param string $fileName
     * @param string $directoryPath
     * @param string $fileData
     * @return string|null
     * @throws \Exception
     */
    public function upload($fileName, $fileData, $directoryPath): ?string
    {
        $this->_file = $this->decodeContent($fileName, $fileData);
        if (!$this->systemTmpDirectory->isExist($this->_file['tmp_name'])) {
            throw new \InvalidArgumentException('There was an error during file content upload.');
        }
        $this->_fileExists = true;
        $this->_uploadType = self::SINGLE_STYLE;
        $this->setAllowRenameFiles(true);
        $this->setFilesDispersion(true);
        $result = $this->save($directoryPath);
        return $result['file'] ?? null;
    }

    /**
     * Decode base64 encoded content and save it in system tmp folder
     *
     * @param string $fileName
     * @param string $fileData
     * @return array
     * @throws \Magento\Framework\Exception\FileSystemException
     */
    private function decodeContent($fileName, $fileData): array
    {
        $tmpFileName = $this->getTmpFileName();
        $fileSize = $this->systemTmpDirectory->writeFile($tmpFileName, base64_decode($fileData));

        return [
            'name' => $fileName,
            'type' => self::DEFAULT_MIME_TYPE,
            'tmp_name' => $this->systemTmpDirectory->getAbsolutePath($tmpFileName),
            'error' => 0,
            'size' => $fileSize,
        ];
    }

    /**
     * Generate temporary file name
     *
     * @return string
     */
    private function getTmpFileName(): string
    {
        return uniqid($this->filePrefix, true);
    }
}
