<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Magento\PageBuilder\Controller\Adminhtml\Form\Element\ProductConditions;

use Magento\Framework\App\Action\HttpPostActionInterface;
use Magento\Rule\Model\Condition\AbstractCondition;

/**
 * Responsible for rendering the child elements of the conditions rule tree using the provided params
 */
class Child extends \Magento\CatalogWidget\Controller\Adminhtml\Product\Widget implements HttpPostActionInterface
{
    /**
     * @var \Magento\CatalogWidget\Model\Rule
     */
    private $rule;

    /**
     * @param \Magento\Backend\App\Action\Context $context
     * @param \Magento\CatalogWidget\Model\Rule $rule
     */
    public function __construct(
        \Magento\Backend\App\Action\Context $context,
        \Magento\CatalogWidget\Model\Rule $rule
    ) {
        $this->rule = $rule;
        parent::__construct($context);
    }

    /**
     * Render child template
     *
     * @return void
     */
    public function execute()
    {
        $id = $this->getRequest()->getParam('id');
        $formName = $this->getRequest()->getParam('form_namespace');
        $jsObjectName = $this->getRequest()->getParam('js_object_name');

        $typeData = explode('|', str_replace('-', '/', $this->getRequest()->getParam('type')));
        $className = $typeData[0];
        $prefix = $this->getRequest()->getParam('prefix', 'conditions');

        $model = $this->_objectManager->create($className)
            ->setId($id)
            ->setType($className)
            ->setRule($this->rule)
            ->setPrefix($prefix);

        if (!empty($typeData[1])) {
            $model->setAttribute($typeData[1]);
        }

        $result = '';
        if ($model instanceof AbstractCondition) {
            // set value of $prefix in model's data registry to value of 'conditions',
            // as is required for correct use of \Magento\Rule\Model\Condition\Combine::getConditions
            if ($model->getData($prefix) === null) {
                $model->setData($prefix, $model->getData('conditions'));
            }
            $model->setJsFormObject($jsObjectName);
            $model->setFormName($formName);
            $result = $model->asHtmlRecursive();
        }
        $this->getResponse()->setBody($result);
    }
}
