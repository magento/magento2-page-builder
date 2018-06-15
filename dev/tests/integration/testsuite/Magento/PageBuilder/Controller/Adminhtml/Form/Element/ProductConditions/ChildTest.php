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
                'form_namespace' => 'test_namespace',
            ])
            ->setPostValue([
                'type' => 'Magento\CatalogWidget\Model\Rule\Condition\Product|custom_design_from',
                'id' => '1--3',
            ]);

        $this->dispatch('backend/pagebuilder/form/element_productconditions_child');
        $responseBody = $this->getResponse()->getBody();
        // Assert form is associated correctly
        $this->assertContains('data-form-part="test_namespace"', $responseBody);
        // Assert id is used
        $this->assertContains('name="parameters[conditions][1--3][type]"', $responseBody);
        // Assert type is used
        $this->assertContains('value="Magento\CatalogWidget\Model\Rule\Condition\Product"', $responseBody);
    }

    public function testFormLoadsCustomPrefix()
    {
        $this->getRequest()
            ->setParams([
                'form_namespace' => 'test_namespace',
                'prefix' => 'myprefix',
            ])
            ->setPostValue([
                'type' => 'Magento\CatalogWidget\Model\Rule\Condition\Product|custom_design_from',
                'id' => '1--3',
            ]);

        $this->dispatch('backend/pagebuilder/form/element_productconditions_child');
        $responseBody = $this->getResponse()->getBody();

        // Assert id is used
        $this->assertContains('name="parameters[myprefix][1--3][type]"', $responseBody);
    }
}
