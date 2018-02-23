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
class Inputtype
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
            $result[0][] = 'pagebuilder';
        }
        return $result;
    }
}
