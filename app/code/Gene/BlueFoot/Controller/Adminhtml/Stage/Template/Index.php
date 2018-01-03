<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */
namespace Gene\BlueFoot\Controller\Adminhtml\Stage\Template;

/**
 * Class Index
 */
class Index extends \Magento\Backend\App\Action
{
    /**
     * @var \Magento\Framework\Controller\Result\JsonFactory
     */
    protected $resultJsonFactory;

    /**
     * @var \Gene\BlueFoot\Model\ResourceModel\Stage\Template\CollectionFactory
     */
    protected $templateFactory;

    /**
     * @var \Magento\Store\Model\StoreManagerInterface
     */
    protected $storeManager;

    /**
     * Index constructor.
     * @param \Magento\Backend\App\Action\Context $context
     * @param \Magento\Framework\Controller\Result\JsonFactory $resultJsonFactory
     */
    public function __construct(
        \Magento\Backend\App\Action\Context $context,
        \Magento\Framework\Controller\Result\JsonFactory $resultJsonFactory,
        \Gene\BlueFoot\Model\ResourceModel\Stage\Template\CollectionFactory $templateFactory,
        \Magento\Store\Model\StoreManagerInterface $storeManager
    ) {
        parent::__construct($context);

        $this->resultJsonFactory = $resultJsonFactory;
        $this->templateFactory = $templateFactory;
        $this->storeManager = $storeManager;
    }

    /**
     * Return json array of templates
     *
     * @return \Magento\Framework\Controller\Result\Json
     */
    public function execute()
    {
        $collection = $this->templateFactory->create();
        $collection->getSelect()->reset('columns');
        $collection->getSelect()->columns([
            'main_table.template_id',
            'main_table.name',
            'main_table.structure',
            'main_table.preview',
            'main_table.pinned'
        ]);
        $results = $collection->load();

        $json = [];
        foreach ($results as $item) {
            $json[] = [
                'id' => $item->getId(),
                'label' => $item->getName(),
                'preview' => $this->getPreviewUrl($item->getPreview()),
                'structure' => $item->getStructure()
            ];
        }

        return $this->resultJsonFactory->create()->setData([
            'templates' => $json
        ]);
    }

    /**
     * URL to the media path
     * @param string $path
     * @return string
     */
    public function getPreviewUrl($path)
    {
        return
            $this->storeManager->getStore()->getBaseUrl(\Magento\Framework\UrlInterface::URL_TYPE_MEDIA) .
            'bluefoot' . DIRECTORY_SEPARATOR . 'previews' . DIRECTORY_SEPARATOR . $path;
    }
}