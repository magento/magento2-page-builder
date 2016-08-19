<?php

namespace Gene\BlueFoot\Controller\Adminhtml\Entity\Attribute;

/**
 * Class Edit
 *
 * @package Gene\BlueFoot\Controller\Adminhtml\Entity\Attribute
 *
 * @author Dave Macaulay <dave@gene.co.uk>
 */
class Edit extends \Gene\BlueFoot\Controller\Adminhtml\Entity\Attribute
{
    /**
     * @return \Magento\Framework\Controller\ResultInterface
     */
    public function execute()
    {
        $id = $this->getRequest()->getParam('attribute_id');

        /* @var $model \Magento\Catalog\Model\ResourceModel\Eav\Attribute */
        $model = $this->_objectManager->create('Gene\BlueFoot\Model\Attribute')
            ->setEntityTypeId($this->entityTypeId);

        if ($id) {
            $model->getResource()->load($model, $id);

            if (!$model->getId()) {
                $this->messageManager->addErrorMessage(
                    __('This attribute no longer exists.')
                );

                $resultRedirect = $this->resultRedirectFactory->create();
                return $resultRedirect->setPath('catalog/*/');
            }

            // entity type check
            if ($model->getEntityTypeId() != $this->entityTypeId) {
                $this->messageManager->addErrorMessage(
                    __('This attribute cannot be edited.')
                );

                $resultRedirect = $this->resultRedirectFactory->create();
                return $resultRedirect->setPath('catalog/*/');
            }
        }

        // set entered data if was error when we do save
        $data = $this->_objectManager->get('Magento\Backend\Model\Session')
            ->getAttributeData(true);

        if (!empty($data)) {
            $model->addData($data);
        }

        $attributeData = $this->getRequest()->getParam('attribute');
        if (!empty($attributeData) && $id === null) {
            $model->addData($attributeData);
        }

        $this->coreRegistry->register('entity_attribute', $model);

        $item = $id ? __('Edit Content Attribute') : __('New Content Attribute');

        $resultPage = $this->createActionPage($item);
        $resultPage->getConfig()->getTitle()->prepend(
            ($id ? $model->getName() : __('New Content Attribute'))
        );

        $resultPage->getLayout()
            ->getBlock('attribute_edit_js')
            ->setIsPopup((bool)$this->getRequest()->getParam('popup'));

        return $resultPage;
    }
}
