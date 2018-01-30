<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */
namespace Magento\PageBuilder\Block\Adminhtml\System\Config;

use Magento\Backend\Block\Template;

class EnableButton extends Template
{
    /**
     * @var \Magento\PageBuilder\Block\Adminhtml\System\Config\EnableButton\ModalContentBody
     */
    private $modalContentBodyBlock;

    /**
     * @param \Magento\Backend\Block\Template\Context $context
     * @param \Magento\PageBuilder\Block\Adminhtml\System\Config\EnableButton\ModalContentBody $modalContentBodyBlock
     * @param array $data
     */
    public function __construct(
        \Magento\Backend\Block\Template\Context $context,
        \Magento\PageBuilder\Block\Adminhtml\System\Config\EnableButton\ModalContentBody $modalContentBodyBlock,
        array $data = []
    ) {
        parent::__construct($context, $data);
        $this->modalContentBodyBlock = $modalContentBodyBlock;
    }

    /**
     * Get HTML form element selector for enabling PageBuilder
     *
     * @return string
     */
    public function getEnablePageBuilderSelector()
    {
        return '#cms_pagebuilder_enabled';
    }

    /**
     * Get text for the modal title heading when user switches to disable
     *
     * @return \Magento\Framework\Phrase
     */
    public function getModalTitleText()
    {
        return __('Are You Sure You Want to Turn Off Page Builder?');
    }

    /**
     * Get HTML for the modal content body when user switches to disable
     *
     * @return string
     */
    public function getModalContentBody()
    {
        return $this->modalContentBodyBlock->render();
    }
}
