<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Magento\PageBuilder\Setup\Patch\Data;

use Magento\Framework\Setup\Patch\DataPatchInterface;
use Magento\Framework\App\Filesystem\DirectoryList;
use Magento\Framework\Filesystem\Directory\ReadInterface;

/**
 * Migrates images from old bluefoot directory to new pagebuilder directory
 */
class MigrateImagesToPageBuilder implements DataPatchInterface
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
     * Do Upgrade
     *
     * @return void
     */
    public function apply(): void
    {
        // check if /pub/media/gene-cms is readable
        $bluefootImagesPath = $this->directoryList->getPath('media') . DIRECTORY_SEPARATOR . 'gene-cms';
        $bluefootDir = $this->filesystem->getDirectoryReadByPath($bluefootImagesPath);
        if (!$bluefootDir->isReadable()) {
            $this->createAndLogException('The path "%1" is not readable.', $bluefootDir);
            return;
        }

        // check if /pub/media/wysiwyg is writable
        $pagebuilderImagesPath = $this->directoryList->getPath('media') . DIRECTORY_SEPARATOR . 'wysiwyg';
        $pagebuilderDir = $this->filesystem->getDirectoryWrite(DirectoryList::MEDIA);
        if (!$pagebuilderDir->isWritable()) {
            $this->createAndLogException('The path "%1" is not writable.', $pagebuilderDir);
            return;
        }

        // move images
        $allFiles = $bluefootDir->readRecursively();
        foreach ($allFiles as $file) {
            if ($bluefootDir->isFile($file)) {
                try {
                    $this->fileDriver->rename(
                        $bluefootImagesPath . DIRECTORY_SEPARATOR . $file,
                        $pagebuilderImagesPath . DIRECTORY_SEPARATOR . basename($file)
                    );
                } catch (\Magento\Framework\Exception\LocalizedException $e) {
                    $this->logger->error($e);
                    return;
                } catch (\Exception $e) {
                    $message = __(
                        'An error has occurred during image migration for PageBuilder. The error message was: %1',
                        $e->getMessage()
                    );
                    $this->logger->critcal($message);
                    return;
                }
            }
        }

        // remove gene-cms folder
        try {
            $this->fileDriver->deleteDirectory($bluefootImagesPath);
        } catch (\Magento\Framework\Exception\LocalizedException $e) {
            $this->logger->error($e);
        } catch (\Exception $e) {
            $message = __(
                'An error has occurred during image migration for PageBuilder. The error message was: %1',
                $e->getMessage()
            );
            $this->logger->critcal($message);
        }
    }

    /**
     * Create exception and log
     *
     * @param string $message
     * @param ReadInterface $path
     * @return void
     */
    private function createAndLogException(string $message, ReadInterface $path): void
    {
        $e = new \Magento\Framework\Exception\FileSystemException(new \Magento\Framework\Phrase($message, [$path]));
        $this->logger->error($e);
    }

    /**
     * {@inheritdoc}
     */
    public function getAliases(): array
    {
        return [];
    }

    /**
     * {@inheritdoc}
     */
    public static function getDependencies(): array
    {
        return [MigrateToPageBuilder::class];
    }
}
