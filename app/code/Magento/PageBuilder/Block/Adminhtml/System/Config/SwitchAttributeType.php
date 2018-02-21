<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

namespace Magento\PageBuilder\Block\Adminhtml\System\Config;

use Magento\Framework\Data\Form\Element\AbstractElement;

class SwitchAttributeType extends \Magento\Config\Block\System\Config\Form\Field
{
    /**
     * @param \Magento\Backend\Block\Template\Context $context
     * @param array $data
     */
    public function __construct(
        \Magento\Backend\Block\Template\Context $context,
        array $data = []
    ) {
        parent::__construct($context, $data);
    }

    /**
     * Get text for the modal title heading when user switches to disable
     *
     * @return string
     */
    public function getModalSelector()
    {
        return '#frontend_input';
    }

    /**
     * Get text for the modal title heading when user switches to disable
     *
     * @return string
     */
    public function getModalTitleText()
    {
        return __('Product data may be lost');
    }

    /**
     * Get HTML for the modal content body when user switches to disable
     *
     * @return string
     */
    public function getModalContentBody()
    {
        $content = __("Changing the Input Type may result in product data loss. Proceed with caution.");
        return '<div class="pagebuilder-modal-content-body">' . $content . '</div>';
    }
}
