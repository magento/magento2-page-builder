<?php
/**
 * Copyright © 2013-2017 Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */
namespace Gene\BlueFoot\Block\Adminhtml;

use Magento\Framework\View\Element\Template\Context;
use Magento\Framework\View\Element\UiComponentFactory;
use Magento\Ui\Component\Control\ActionPool;

class ComponentList extends \Magento\Framework\View\Element\Template
{
    /**
     * @var UiComponentFactory
     */
    private $uiComponentFactory;

    /**
     * Constructor
     *
     * @param UiComponentFactory $uiComponentFactory
     * @param Context $context
     * @param array $data
     */
    public function __construct(
        UiComponentFactory $uiComponentFactory,
        Context $context,
        array $data = []
    ) {
        parent::__construct($context, $data);
        $this->uiComponentFactory = $uiComponentFactory;
    }

    /**
     * Get components [component_name => instance]
     *
     * @return array
     */
    public function getComponents()
    {
        $result = [];

        // @todo generate instead of hard coding
        $actionsToolbar = <<<EOF
            <div data-mage-init='{"floatingHeader": {}}' class="page-actions" data-ui-id="page-actions-toolbar-content-header">
                <button id="save" title="Save" type="button" class="action- scalable save primary" data-mage-init="{&quot;button&quot;:{&quot;event&quot;:&quot;save&quot;}}" data-form-role="save" data-ui-id="save-button" > <span>Save</span> </button>
                <button id="reset" title="Reset" type="button" class="action- scalable reset" data-ui-id="reset-button"> <span>Reset</span> </button>
                <button id="cancel" title="Cancel" type="button" class="action- scalable back" data-ui-id="cancel-button" data-role="closeBtn"><span>Cancel</span></button>
            </div>
EOF;

        foreach ($this->getChildNames() as $name) {
            $result[$name] = $this->getChildHtml($name) . $actionsToolbar;
        }
        return $result;
    }
}
