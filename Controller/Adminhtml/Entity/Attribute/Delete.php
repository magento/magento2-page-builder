<?php

namespace Gene\BlueFoot\Controller\Adminhtml\Entity\Attribute;

/**
 * Class Delete
 *
 * @package Gene\BlueFoot\Controller\Adminhtml\Entity\Attribute
 *
 * @author Dave Macaulay <dave@gene.co.uk>
 */
class Delete extends \Gene\BlueFoot\Controller\Adminhtml\Entity\Attribute
{
    /**
     * @return \Magento\Backend\Model\View\Result\Redirect
     */
    public function execute()
    {
        $id = $this->getRequest()->getParam('attribute_id');
        $resultRedirect = $this->resultRedirectFactory->create();
        if ($id) {
            $model = $this->_objectManager->create('Gene\BlueFoot\Model\Attribute');

            // entity type check
            $model->load($id);
            if ($model->getEntityTypeId() != $this->entityTypeId) {
                $this->messageManager->addErrorMessage(
                    __("We can't delete the attribute.")
                );

                return $resultRedirect->setPath('bluefoot/*/');
            }

            try {
                $model->delete();
                $this->messageManager->addSuccessMessage(
                    __('You deleted the content attribute.')
                );

                return $resultRedirect->setPath('bluefoot/*/');
            } catch (\Exception $e) {
                $this->messageManager->addErrorMessage($e->getMessage());
                return $resultRedirect->setPath(
                    'catalog/*/edit',
                    ['attribute_id' => $this->getRequest()->getParam('attribute_id')]
                );
            }
        }

        $this->messageManager->addErrorMessage(
            __("We can't find an attribute to delete.")
        );

        return $resultRedirect->setPath('bluefoot/*/');
    }
}
