<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Magento\PageBuilder\Controller\Adminhtml\Form\Element\ProductConditions;

class ChildTest extends \Magento\TestFramework\TestCase\AbstractBackendController
{
    public function testFormLoadsEmptyFormUsingParams()
    {
        $this->getRequest()
            ->setParams([
                'js_object_name' => 'myobject',
                'form_namespace' => 'test_namespace',
            ])
            ->setPostValue([
                'type' => 'Magento\CatalogWidget\Model\Rule\Condition\Product|category_ids',
                'id' => '1--3',
            ])
            ->setMethod($this->getRequest()::METHOD_POST);

        $this->dispatch('backend/pagebuilder/form/element_productconditions_child');
        $responseBody = $this->getResponse()->getBody();
        // Assert form is associated correctly
        $this->assertStringContainsString('data-form-part="test_namespace"', $responseBody);
        // Assert the form object is propagated
        $this->assertStringContainsString('form/myobject', $responseBody);
        // Assert id is used
        $this->assertStringContainsString('name="parameters[conditions][1--3][type]"', $responseBody);
        // Assert type is used
        $this->assertStringContainsString('value="Magento\CatalogWidget\Model\Rule\Condition\Product"', $responseBody);
    }

    public function testFormLoadsCustomPrefix()
    {
        $this->getRequest()
            ->setParams([
                'js_object_name' => 'myobject',
                'form_namespace' => 'test_namespace',
                'prefix' => 'myprefix',
            ])
            ->setPostValue([
                'type' => 'Magento\CatalogWidget\Model\Rule\Condition\Product|category_ids',
                'id' => '1--3',
            ])
            ->setMethod($this->getRequest()::METHOD_POST);

        $this->dispatch('backend/pagebuilder/form/element_productconditions_child');
        $responseBody = $this->getResponse()->getBody();

        // Assert the form object is propagated
        $this->assertStringContainsString('form/myobject', $responseBody);
        // Assert id is used
        $this->assertStringContainsString('name="parameters[myprefix][1--3][type]"', $responseBody);
    }
}
