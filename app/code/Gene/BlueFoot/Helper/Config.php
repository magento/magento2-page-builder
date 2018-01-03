<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */
namespace Gene\BlueFoot\Helper;

use Magento\Framework\UrlInterface;

/**
 * Class Config
 */
class Config extends \Magento\Framework\App\Helper\AbstractHelper
{
    const UPLOAD_DIR = 'wysiwyg' . DIRECTORY_SEPARATOR . 'bluefoot';

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
        return $this->directoryList->getPath('media') . DIRECTORY_SEPARATOR . self::UPLOAD_DIR;
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
        $uploadUrl = $this->_urlBuilder->getBaseUrl(['_type' => UrlInterface::URL_TYPE_MEDIA]) . '/media/gene-cms';
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
        return '/media/wysiwyg/bluefoot';
    }
}
