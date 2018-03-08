<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Magento\PageBuilder\Plugin\Model\Eav\Adminhtml\System\Config\Source;

/**
 * Plugin for \Magento\Eav\Model\Adminhtml\System\Config\Source\Inputtype
 */
class InputtypePlugin
{
    /**
     * PageBuilder config
     *
     * @var \Magento\PageBuilder\Model\Config
     */
    private $config;

    /**
     * @param \Magento\PageBuilder\Model\Config $config
     */
    public function __construct(\Magento\PageBuilder\Model\Config $config)
    {
        $this->config = $config;
    }

    /**
     * Remove Page builder option if Page Builder is disabled in config setting
     *
     * @param \Magento\Eav\Model\Adminhtml\System\Config\Source\Inputtype $subject
     * @param array $result
     * @return array
     * @SuppressWarnings(PHPMD.UnusedFormalParameter)
     */
    public function afterToOptionArray(
        \Magento\Eav\Model\Adminhtml\System\Config\Source\Inputtype $subject,
        array $result
    ) {
        if (!$this->config->isEnabled()) {
            foreach ($result as $key => $value) {
                if ($value['value'] == 'pagebuilder') {
                    unset($result[$key]);
                    break;
                }
            }
        }
        return $result;
    }

    /**
     * Append result with additional compatible input types.
     *
     * @param \Magento\Eav\Model\Adminhtml\System\Config\Source\Inputtype $subject
     * @param array $result
     * @return array
     * @SuppressWarnings(PHPMD.UnusedFormalParameter)
     */
    public function afterGetVolatileInputTypes(
        \Magento\Eav\Model\Adminhtml\System\Config\Source\Inputtype $subject,
        array $result
    ) {
        if ($this->config->isEnabled()) {
            $result = array_merge($result, [['pagebuilder', 'textarea', 'texteditor']]);
        }
        return $result;
    }
}
