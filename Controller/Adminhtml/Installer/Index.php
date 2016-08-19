<?php

namespace Gene\BlueFoot\Controller\Adminhtml\Installer;

/**
 * Class Index
 *
 * @package Gene\BlueFoot\Controller\Adminhtml\Installer
 *
 * @author Dave Macaulay <dave@gene.co.uk>
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
     * @param \Magento\Framework\App\Action\Context $context
     * @param \Magento\Framework\Module\Dir\Reader  $moduleReader
     */
    public function __construct(
        \Magento\Framework\App\Action\Context $context,
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
            DIRECTORY_SEPARATOR . 'Setup' .
            DIRECTORY_SEPARATOR . 'data' .
            DIRECTORY_SEPARATOR . 'pagebuilder_blocks_core.json';

        if ($this->ioFile->fileExists($file)) {
            $this->fileInstaller->install($file);
        }
    }
}