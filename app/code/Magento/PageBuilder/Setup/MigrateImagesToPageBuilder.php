<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Magento\PageBuilder\Setup;

use Magento\Framework\App\Filesystem\DirectoryList;
use Magento\Framework\Filesystem\Directory\ReadInterface;

/**
 * Migrates images from old BlueFoot directory to new PageBuilder directory
 */
class MigrateImagesToPageBuilder
{
    /**
     * @var \Magento\Framework\Filesystem
     */
    private $filesystem;

    /**
     * @var \Magento\Framework\Filesystem\Driver\File
     */
    private $fileDriver;

    /**
     * @var DirectoryList
     */
    private $directoryList;

    /**
     * @var \Psr\Log\LoggerInterface
     */
    private $logger;

    /**
     * @param \Magento\Framework\Filesystem $filesystem
     */
    public function __construct(
        \Magento\Framework\Filesystem $filesystem,
        \Magento\Framework\Filesystem\Driver\File $fileDriver,
        \Magento\Framework\App\Filesystem\DirectoryList $directoryList,
        \Psr\Log\LoggerInterface $logger
    ) {
        $this->filesystem = $filesystem;
        $this->fileDriver = $fileDriver;
        $this->directoryList = $directoryList;
        $this->logger = $logger;
    }

    /**
     * Perform image migration
     *
     * @return void
     */
    public function migrate(): void
    {
        // check if /pub/media/gene-cms is readable
        $blueFootImagesPath = $this->directoryList->getPath('media') . DIRECTORY_SEPARATOR . 'gene-cms';
        $blueFootDir = $this->filesystem->getDirectoryReadByPath($blueFootImagesPath);
        if (!$blueFootDir->isReadable()) {
            $this->logger->error(sprintf('The path "%s" is not readable.', $blueFootDir->getAbsolutePath()));
            return;
        }

        // check if /pub/media/wysiwyg is writable
        $pageBuilderImagesPath = $this->directoryList->getPath('media') . DIRECTORY_SEPARATOR . 'wysiwyg';
        $pageBuilderDir = $this->filesystem->getDirectoryWrite(DirectoryList::MEDIA);
        if (!$pageBuilderDir->isWritable()) {
            $this->logger->error(sprintf('The path "%s" is not writable.', $pageBuilderDir->getAbsolutePath()));
            return;
        }

        $allFiles = $blueFootDir->readRecursively();
        try {
            // move images
            foreach ($allFiles as $file) {
                if ($blueFootDir->isFile($file)) {
                    $newImagePath = $pageBuilderImagesPath . DIRECTORY_SEPARATOR . $file;
                    if (!$this->fileDriver->isExists(dirname($newImagePath))) {
                        $this->fileDriver->createDirectory(dirname($newImagePath));
                    }
                    $this->fileDriver->rename($blueFootImagesPath . DIRECTORY_SEPARATOR . $file, $newImagePath);
                }
            }

            // remove gene-cms folder
            $this->fileDriver->deleteDirectory($blueFootImagesPath);
        } catch (\Magento\Framework\Exception\LocalizedException $e) {
            $this->logger->error($e->getMessage());
        } catch (\Exception $e) {
            $message = 'An error has occurred during image migration for PageBuilder. The error message was: ' .
                $e->getMessage();
            $this->logger->critical($message);
        }
    }
}
