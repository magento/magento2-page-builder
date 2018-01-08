<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */
namespace Gene\BlueFoot\Controller\Adminhtml\Stage\Template;

use Magento\Framework\View\Element\Template;
use Magento\Ui\Component\Control\ActionPool;
use Magento\Ui\Component\Wrapper\UiComponent;

/**
 * Class Edit
 */
class Form extends \Magento\Backend\App\Action
{
    /**
     * Render UI component by namespace in handle context
     *
     * @return void
     */
    public function execute()
    {
        $this->_view->loadLayout(['default', 'bluefoot_stage_template_form'], true, true, false);

        $uiComponent = $this->_view->getLayout()->getBlock('bluefoot_template_create');
        $response = $uiComponent instanceof UiComponent ? $uiComponent->toHtml() : '';

        $actionsToolbar = $this->_view->getLayout()->getBlock(ActionPool::ACTIONS_PAGE_TOOLBAR);
        $response .= $actionsToolbar instanceof Template ? $actionsToolbar->toHtml() : '';

        $this->_response->appendBody($response);
    }
}
