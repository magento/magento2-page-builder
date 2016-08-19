<?php

namespace Gene\BlueFoot\Controller\Adminhtml\Stage\Widget;

/**
 * Class Video
 *
 * @package Gene\BlueFoot\Controller\Adminhtml\Stage\Widget
 *
 * @author Dave Macaulay <dave@gene.co.uk>
 */
class Video extends \Magento\Backend\App\Action
{
    /**
     * @var \Magento\Framework\Controller\Result\JsonFactory
     */
    protected $_resultJsonFactory;

    /**
     * @var \Gene\BlueFoot\Helper\Widget\Video
     */
    protected $_videoHelper;

    /**
     * Video constructor.
     *
     * @param \Magento\Framework\App\Action\Context            $context
     * @param \Magento\Framework\Controller\Result\JsonFactory $resultJsonFactory
     * @param \Gene\BlueFoot\Helper\Widget\Video               $videoHelper
     */
    public function __construct(
        \Magento\Framework\App\Action\Context $context,
        \Magento\Framework\Controller\Result\JsonFactory $resultJsonFactory,
        \Gene\BlueFoot\Helper\Widget\Video $videoHelper
    ) {
        parent::__construct($context);

        $this->_resultJsonFactory = $resultJsonFactory;
        $this->_videoHelper = $videoHelper;
    }

    /**
     * Allow users to upload images to the folder structure
     *
     * @return $this
     */
    public function execute()
    {
        if ($url = $this->getRequest()->getParam('url')) {
            return $this->_resultJsonFactory->create()->setData([
                'success' => true,
                'key' => $this->_videoHelper->previewAction($url)
            ]);
        }

        return $this->_resultJsonFactory->create()->setData(['success' => false]);
    }

}