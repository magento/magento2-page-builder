<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */
declare(strict_types=1);

namespace Magento\PageBuilder\Test\Unit\Model;

use Magento\Framework\App\Filesystem\DirectoryList;
use Magento\Framework\Filesystem;
use Magento\Framework\Filesystem\Directory\WriteInterface;
use Magento\PageBuilder\Model\ImageContentUploader;
use PHPUnit\Framework\MockObject\MockObject;
use PHPUnit\Framework\TestCase;
use Magento\MediaStorage\Helper\File\Storage;
use Magento\MediaStorage\Helper\File\Storage\Database;
use Magento\MediaStorage\Model\File\Validator\NotProtectedExtension;

/**
 * @see \Magento\PageBuilder\Model\ImageContentUploader
 */
class ImageContentUploaderTest extends TestCase
{
    /**
     * @var ImageContentUploader
     */
    private $imageContentUploader;

    /**
     * @var MockObject
     */
    private $sysDirectory;

    /**
     * @throws \Magento\Framework\Exception\FileSystemException
     */
    protected function setUp(): void
    {
        $filesystem = $this->getMockBuilder(Filesystem::class)
            ->disableOriginalConstructor()
            ->getMock();

        $this->sysDirectory = $this->getMockBuilder(WriteInterface::class)
            ->disableOriginalConstructor()
            ->getMock();
        /** @var Filesystem|MockObject $filesystem */
        $filesystem->expects(self::atLeastOnce())->method('getDirectoryWrite')
            ->with(DirectoryList::SYS_TMP)
            ->willReturn($this->sysDirectory);
        /** @var Database|MockObject $coreFileStorageDb */
        $coreFileStorageDb = $this->getMockBuilder(Database::class)
            ->disableOriginalConstructor()
            ->getMock();
        /** @var Storage|MockObject $coreFileStorage */
        $coreFileStorage = $this->getMockBuilder(Storage::class)
            ->disableOriginalConstructor()
            ->getMock();
        /** @var NotProtectedExtension|MockObject $validator */
        $validator = $this->getMockBuilder(NotProtectedExtension::class)
            ->disableOriginalConstructor()
            ->getMock();

        $this->imageContentUploader = new ImageContentUploader(
            $coreFileStorageDb,
            $coreFileStorage,
            $validator,
            $filesystem
        );
    }

    /**
     * @throws \Exception
     */
    public function testUploadWithException(): void
    {
        $this->expectException(\InvalidArgumentException::class);
        $this->expectExceptionMessage('There was an error during file content upload.');

        $fileName = 'fileName.file';
        $fileData = 'some file data';
        $directoryPath = 'directory/path';
        $absolutePath = 'absolute/' . $directoryPath;
        $fileSize = '1024';
        $this->sysDirectory->expects(self::atLeastOnce())->method('writeFile')->willReturn($fileSize);
        $this->sysDirectory->expects(self::atLeastOnce())->method('getAbsolutePath')->willReturn($absolutePath);
        $this->sysDirectory->expects(self::atLeastOnce())->method('isExist')->willReturn(false);
        $this->imageContentUploader->upload($fileName, $fileData, $directoryPath);
    }
}
