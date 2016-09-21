<?php

namespace Gene\BlueFoot\Helper;

/**
 * Class Config
 *
 * @package Gene\BlueFoot\Helper
 *
 * @author Dave Macaulay <dave@gene.co.uk>
 */
class Config extends \Magento\Framework\App\Helper\AbstractHelper
{
    /**
     * @var \Magento\Framework\Filesystem\DirectoryList
     */
    protected $directoryList;

    /**
     * Config constructor.
     *
     * @param \Magento\Framework\App\Helper\Context       $context
     * @param \Magento\Framework\Filesystem\DirectoryList $directoryList
     */
    public function __construct(
        \Magento\Framework\App\Helper\Context $context,
        \Magento\Framework\Filesystem\DirectoryList $directoryList
    ) {
        parent::__construct($context);
        $this->directoryList = $directoryList;
    }

    /**
     * Return the upload directory
     *
     * @return string
     */
    public function getUploadDir()
    {
        return $this->directoryList->getPath('media') . DIRECTORY_SEPARATOR . 'gene-cms';
    }

    /**
     * Return the upload URL for uploaded content
     *
     * @param $removeHttp
     *
     * @return string
     */
    public function getUploadUrl($removeHttp = false)
    {
        $uploadUrl = $this->_urlBuilder->getBaseUrl() . '/media/gene-cms';
        if ($removeHttp) {
            $uploadUrl = str_replace('http:', '', $uploadUrl);
        }
        return $uploadUrl;
    }

    /**
     * Return the upload URL for uploaded content

     * @return string
     */
    public function getRelativeUploadUrl()
    {
        return '/media/gene-cms';
    }
}
