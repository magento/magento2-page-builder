<?php
/**
 * Copyright © 2013-2017 Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

namespace Gene\BlueFoot\Block\Adminhtml\ContentType;

use Gene\BlueFoot\Model\Config\ConfigInterface;
use Magento\Framework\View\Element\Template\Context;
use Gene\BlueFoot\Model\ComponentRenderer;

/**
 * Class ComponentList
 *
 * @package Gene\BlueFoot\Block\Adminhtml
 */
class ComponentList extends \Magento\Framework\View\Element\Template
{
    /**
     * @var ConfigInterface
     */
    private $configInterface;

    /**
     * @var ComponentRenderer
     */
    private $componentRenderer;

    /**
     * ComponentList constructor.
     *
     * @param ConfigInterface   $configInterface
     * @param ComponentRenderer $componentRenderer
     * @param Context           $context
     * @param array             $data
     */
    public function __construct(
        ConfigInterface $configInterface,
        ComponentRenderer $componentRenderer,
        Context $context,
        array $data = []
    ) {
        parent::__construct($context, $data);
        $this->configInterface = $configInterface;
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

        foreach ($this->configInterface->getContentTypes() as $key => $contentType) {
            $result[$contentType['form']] = $this->componentRenderer->renderComponent(
                $contentType['form']
            );
        }
        return $result;
    }
}
