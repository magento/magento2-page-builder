<?php

namespace Gene\BlueFoot\Controller\Adminhtml\Entity\ContentBlock;

/**
 * Class Save
 *
 * @package Gene\BlueFoot\Controller\Adminhtml\Entity\ContentBlock
 *
 * @author Dave Macaulay <dave@gene.co.uk>
 */
class Save extends \Gene\BlueFoot\Controller\Adminhtml\Entity\ContentBlock
{
    /**
     * @var \Magento\Framework\View\LayoutFactory
     */
    protected $layoutFactory;

    /**
     * @var \Magento\Framework\Controller\Result\JsonFactory
     */
    protected $resultJsonFactory;

    /**
     * @param \Magento\Backend\App\Action\Context $context
     * @param \Magento\Framework\Registry $coreRegistry
     * @param \Magento\Framework\View\LayoutFactory $layoutFactory
     * @param \Magento\Framework\Controller\Result\JsonFactory $resultJsonFactory
     */
    public function __construct(
        \Magento\Backend\App\Action\Context $context,
        \Magento\Framework\Registry $coreRegistry,
        \Magento\Framework\View\LayoutFactory $layoutFactory,
        \Magento\Framework\Controller\Result\JsonFactory $resultJsonFactory
    ) {
        parent::__construct($context, $coreRegistry);
        $this->layoutFactory = $layoutFactory;
        $this->resultJsonFactory = $resultJsonFactory;
    }

    /**
     * Retrieve catalog product entity type id
     *
     * @return int
     */
    protected function _getEntityTypeId()
    {
        if ($this->_coreRegistry->registry('entityType') === null) {
            $this->_setTypeId();
        }
        return $this->_coreRegistry->registry('entityType');
    }

    /**
     * Save attribute set action
     *
     * [POST] Create attribute set from another set and redirect to edit page
     * [AJAX] Save attribute set data
     *
     * @return \Magento\Framework\Controller\ResultInterface
     * @SuppressWarnings(PHPMD.CyclomaticComplexity)
     */
    public function execute()
    {
        $entityTypeId = $this->_getEntityTypeId();
        $hasError = false;
        $attributeSetId = $this->getRequest()->getParam('id', false);
        $isNewSet = $this->getRequest()->getParam('gotoEdit', false) == '1';

        /* @var $model \Magento\Eav\Model\Entity\Attribute\Set */
        $model = $this->_objectManager->create('Gene\BlueFoot\Model\Attribute\ContentBlock')
            ->setEntityTypeId($entityTypeId);

        /** @var $filterManager \Magento\Framework\Filter\FilterManager */
        $filterManager = $this->_objectManager->get('Magento\Framework\Filter\FilterManager');

        // A list of extra allowed fields
        $allowedFields = ['identifier', 'show_in_page_builder', 'group_id', 'icon_class', 'color', 'item_view_template', 'renderer'];

        try {
            if ($isNewSet) {
                //filter html tags
                $name = $filterManager->stripTags($this->getRequest()->getParam('attribute_set_name'));
                $model->setAttributeSetName(trim($name));

                // Assign all data to a variable for later user
                $data = $this->getRequest()->getParams();
            } else {
                if ($attributeSetId) {
                    $model->load($attributeSetId);
                }
                if (!$model->getId()) {
                    throw new \Magento\Framework\Exception\LocalizedException(
                        __('This content block no longer exists.')
                    );
                }
                $data = $this->_objectManager->get('Magento\Framework\Json\Helper\Data')
                    ->jsonDecode($this->getRequest()->getPost('data'));

                //filter html tags
                $data['attribute_set_name'] = $filterManager->stripTags($data['attribute_set_name']);

                $model->organizeData($data);
            }

            // Copy over any extra fields
            foreach ($allowedFields as $allowedField)
            {
                // Strip tags, replace missing values with null
                $value = (isset($data[$allowedField]) ? $filterManager->stripTags($data[$allowedField]) : null);
                $model->setData($allowedField, $value);
            }

            $model->validate();
            if ($isNewSet) {
                $model->save();
                $model->initFromSkeleton($this->getRequest()->getParam('skeleton_set'));
            }
            $model->save();
            $this->messageManager->addSuccess(__('You saved the content block.'));
        } catch (\Magento\Framework\Exception\LocalizedException $e) {
            $this->messageManager->addError($e->getMessage());
            $hasError = true;
        } catch (\Exception $e) {
            $this->messageManager->addException($e, __('Something went wrong while saving the content block.'));
            $hasError = true;
        }

        if ($isNewSet) {
            if ($this->getRequest()->getPost('return_session_messages_only')) {
                /** @var $block \Magento\Framework\View\Element\Messages */
                $block = $this->layoutFactory->create()->getMessagesBlock();
                $block->setMessages($this->messageManager->getMessages(true));
                $body = [
                    'messages' => $block->getGroupedHtml(),
                    'error' => $hasError,
                    'id' => $model->getId(),
                ];
                return $this->resultJsonFactory->create()->setData($body);
            } else {
                $resultRedirect = $this->resultRedirectFactory->create();
                if ($hasError) {
                    $resultRedirect->setPath('bluefoot/*/add');
                } else {
                    $resultRedirect->setPath('bluefoot/*/edit', ['id' => $model->getId()]);
                }
                return $resultRedirect;
            }
        } else {
            $response = [];
            if ($hasError) {
                $layout = $this->layoutFactory->create();
                $layout->initMessages();
                $response['error'] = 1;
                $response['message'] = $layout->getMessagesBlock()->getGroupedHtml();
            } else {
                $response['error'] = 0;
                $response['url'] = $this->getUrl('bluefoot/*/');
            }
            return $this->resultJsonFactory->create()->setData($response);
        }
    }
}
