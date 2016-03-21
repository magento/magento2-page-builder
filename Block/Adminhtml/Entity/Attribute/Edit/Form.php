<?php

namespace Gene\BlueFoot\Block\Adminhtml\Entity\Attribute\Edit;

use Magento\Backend\Block\Widget\Form\Generic;
use Magento\Framework\Data\Form as DataForm;

/**
 * Class Form
 *
 * @package Gene\BlueFoot\Block\Adminhtml\Entity\Attribute\Edit
 *
 * @author Dave Macaulay <dave@gene.co.uk>
 */
class Form extends Generic
{
    /**
     * @return $this
     */
    protected function _prepareForm()
    {
        /** @var DataForm $form */
        $form = $this->_formFactory->create(
            ['data' => ['id' => 'edit_form', 'action' => $this->getData('action'), 'method' => 'post']]
        );
        $form->setUseContainer(true);
        $this->setForm($form);
        return parent::_prepareForm();
    }
}
