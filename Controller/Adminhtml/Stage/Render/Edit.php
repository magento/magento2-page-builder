<?php

namespace Gene\BlueFoot\Controller\Adminhtml\Stage\Render;

use Magento\Framework\View\Element\Template;
use Magento\Ui\Component\Control\ActionPool;
use Magento\Ui\Component\Wrapper\UiComponent;
use Magento\Ui\Controller\Adminhtml\AbstractAction;

/**
 * Class Edit
 *
 * @package Gene\BlueFoot\Controller\Adminhtml\Stage\Render
 *
 * @author Dave Macaulay <dave@gene.co.uk>
 */
class Edit extends AbstractAction
{
    /**
     * Render UI component by namespace in handle context
     *
     * @return void
     */
    public function execute()
    {
        $namespace = $this->_request->getParam('namespace');
        $buttons = $this->_request->getParam('buttons', false);

        $this->_view->loadLayout(['default', 'bluefoot_entity_edit'], true, true, false);

        $uiComponent = $this->_view->getLayout()->getBlock('contentblock_entity_form');
        $response = $uiComponent instanceof UiComponent ? $uiComponent->toHtml() : '';

        if ($buttons) {
            $actionsToolbar = $this->_view->getLayout()->getBlock(ActionPool::ACTIONS_PAGE_TOOLBAR);
            $response .= $actionsToolbar instanceof Template ? $actionsToolbar->toHtml() : '';
        }

        // Replace the contentblock_entity_form tag with our custom namespace
        // @todo explore completing this without a string replace
        $response = str_replace(
            'contentblock_entity_form',
            $namespace . '_form',
            $response
        );

        $this->_response->appendBody($response);
    }
}
