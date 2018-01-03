<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */
namespace Gene\BlueFoot\Controller\Adminhtml\Installer;

/**
 * Class Index
 */
class Index extends \Magento\Backend\App\Action
{
    /**
     * @var \Magento\Framework\Module\Dir\Reader
     */
    protected $moduleReader;

    /**
     * @var \Magento\Framework\Filesystem\Io\File
     */
    protected $ioFile;

    /**
     * @var \Gene\BlueFoot\Model\Installer\File
     */
    protected $fileInstaller;

    /**
     * Index constructor.
     *
     * @param \Magento\Backend\App\Action\Context   $context
     * @param \Magento\Framework\Module\Dir\Reader  $moduleReader
     * @param \Magento\Framework\Filesystem\Io\File $ioFile
     * @param \Gene\BlueFoot\Model\Installer\File   $fileInstaller
     */
    public function __construct(
        \Magento\Backend\App\Action\Context $context,
        \Magento\Framework\Module\Dir\Reader $moduleReader,
        \Magento\Framework\Filesystem\Io\File $ioFile,
        \Gene\BlueFoot\Model\Installer\File $fileInstaller
    ) {
        parent::__construct($context);

        $this->moduleReader = $moduleReader;
        $this->ioFile = $ioFile;
        $this->fileInstaller = $fileInstaller;
    }

    /**
     * Return the systems configuration as a JSON string
     *
     * @return $this
     */
    public function execute()
    {
        $file = $this->moduleReader->getModuleDir(false, 'Gene_BlueFoot') .
            DIRECTORY_SEPARATOR .
            'Setup' . DIRECTORY_SEPARATOR .
            'data' . DIRECTORY_SEPARATOR .
            'pagebuilder_blocks_core.json';

        if ($this->ioFile->fileExists($file)) {
            $this->fileInstaller->install($file);
        }
    }
}
