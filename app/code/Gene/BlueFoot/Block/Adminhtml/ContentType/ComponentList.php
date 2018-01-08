<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

namespace Gene\BlueFoot\Block\Adminhtml\ContentType;

use Gene\BlueFoot\Model\Config\ConfigInterface;
use Magento\Framework\View\Element\Template\Context;

class ComponentList extends \Magento\Framework\View\Element\Template
{
    /**
     * @var ConfigInterface
     */
    private $config;

    /**
     * @var ComponentRenderer
     */
    private $componentRenderer;

    /**
     * ComponentList constructor.
     *
     * @param Context $context
     * @param ConfigInterface $config
     * @param ComponentRenderer $componentRenderer
     * @param array $data
     */
    public function __construct(
        Context $context,
        ConfigInterface $config,
        ComponentRenderer $componentRenderer,
        array $data = []
    ) {
        parent::__construct($context, $data);
        $this->config = $config;
        $this->componentRenderer = $componentRenderer;
    }

    /**
     * Get components [component_name => instance]
     *
     * @return array
     */
    public function getComponents()
    {
        $result = [];

        foreach ($this->config->getContentTypes() as $contentType) {
            $result[$contentType['form']] = $this->componentRenderer->renderComponent(
                $contentType['form']
            );
        }
        return $result;
    }
}
