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
    protected $resultJsonFactory;

    /**
     * @var \Gene\BlueFoot\Helper\Widget\Video
     */
    protected $videoHelper;

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

        $this->resultJsonFactory = $resultJsonFactory;
        $this->videoHelper = $videoHelper;
    }

    /**
     * Allow users to upload images to the folder structure
     *
     * @return $this
     */
    public function execute()
    {
        if ($url = $this->getRequest()->getParam('url')) {
            return $this->resultJsonFactory->create()->setData([
                'success' => true,
                'key' => $this->videoHelper->previewAction($url)
            ]);
        }

        return $this->resultJsonFactory->create()->setData(['success' => false]);
    }
}
