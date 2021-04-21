<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Magento\PageBuilder\Block\Adminhtml\System\Config;

use Magento\Backend\Block\Template\Context;
use Magento\Config\Block\System\Config\Form\Field;
use Magento\Framework\Phrase;

/**
 * Class SwitchAttributeType renders modal window to confirm changing attribute type
 *
 * @api
 */
class SwitchAttributeType extends Field
{
    /**
     * @param Context $context
     * @param array $data
     */
    public function __construct(
        Context $context,
        array $data = []
    ) {
        parent::__construct($context, $data);
    }

    /**
     * Get text for the modal title heading when user switches to disable
     *
     * @return string
     */
    public function getModalSelector() : string
    {
        return '#frontend_input';
    }

    /**
     * Get text for the modal title heading when user switches to disable
     *
     * @return Phrase
     */
    public function getModalTitleText() : Phrase
    {
        return __('Product data may be lost');
    }

    /**
     * Get HTML for the modal content body when user switches to disable
     *
     * @return string
     */
    public function getModalContentBody() :string
    {
        $content = __("Changing the Input Type may result in product data loss. Proceed with caution.");
        return '<div class="pagebuilder-modal-content-body">' . $content . '</div>';
    }
}
