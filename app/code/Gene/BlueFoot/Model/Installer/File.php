<?php

namespace Gene\BlueFoot\Model\Installer;

/**
 * Class File
 *
 * @package Gene\BlueFoot\Model\Installer
 *
 * @author  Dave Macaulay <dave@gene.co.uk>
 */
class File extends \Magento\Framework\Model\AbstractModel
{
    /**
     * @var \Magento\Framework\Filesystem\Io\File
     */
    protected $ioFile;

    /**
     * @var \Gene\BlueFoot\Model\Installer\Install
     */
    protected $install;

    /**
     * File constructor.
     *
     * @param \Magento\Framework\Model\Context                             $context
     * @param \Magento\Framework\Registry                                  $registry
     * @param \Magento\Framework\Filesystem\Io\File                        $ioFile
     * @param \Gene\BlueFoot\Model\Installer\Install                       $install
     * @param \Magento\Framework\Model\ResourceModel\AbstractResource|null $resource
     * @param \Magento\Framework\Data\Collection\AbstractDb|null           $resourceCollection
     * @param array                                                        $data
     */
    public function __construct(
        \Magento\Framework\Model\Context $context,
        \Magento\Framework\Registry $registry,
        \Magento\Framework\Filesystem\Io\File $ioFile,
        Install $install,
        \Magento\Framework\Model\ResourceModel\AbstractResource $resource = null,
        \Magento\Framework\Data\Collection\AbstractDb $resourceCollection = null,
        array $data = []
    ) {
        parent::__construct($context, $registry, $resource, $resourceCollection, $data);

        $this->ioFile = $ioFile;
        $this->install = $install;
    }

    /**
     * Install data from a file path
     *
     * @param $filePath
     * @param $setup
     *
     * @return bool
     * @throws \Exception
     */
    public function install($filePath, $setup)
    {
        if ($this->ioFile->fileExists($filePath)) {
            $fileContents = $this->ioFile->read($filePath);
            if (strlen($fileContents) > 0) {
                $installData = \Zend_Json::decode($fileContents);
                if (is_array($installData)) {
                    return $this->install->install($installData, $setup);
                }

                throw new \Exception('Unable to correctly parse file ' . $filePath);
            }
        }

        throw new \Exception('Unable to open ' . $filePath);
    }
}
