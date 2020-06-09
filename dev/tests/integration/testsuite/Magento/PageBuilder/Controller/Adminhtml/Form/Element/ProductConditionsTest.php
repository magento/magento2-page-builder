<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Magento\PageBuilder\Controller\Adminhtml\Form\Element;

class ProductConditionsTest extends \Magento\TestFramework\TestCase\AbstractBackendController
{
    public function testFormLoadsEmptyFormUsingParams()
    {
        $this->getRequest()
            ->setParams([
                'form_namespace' => 'test_namespace',
            ])
            ->setPostValue([
                'conditions' => '[]',
            ]);

        $this->dispatch('backend/pagebuilder/form/element_productconditions');
        $responseBody = $this->getResponse()->getBody();
        // Assert form is associated correctly
        $this->assertStringContainsString('data-form-part="test_namespace"', $responseBody);
        // Assert correct conditions are loaded
        $this->assertStringContainsString(\Magento\CatalogWidget\Model\Rule\Condition\Combine::class, $responseBody);
    }

    public function testFormLoadsConditionsFromPost()
    {
        $conditions = [
            '1--1' => [
                'type' => \Magento\CatalogWidget\Model\Rule\Condition\Product::class,
                'attribute' => 'description',
                'operator' => '{}',
                'value' => 'foo',
            ],
            '1--2' => [
                'type' => \Magento\CatalogWidget\Model\Rule\Condition\Combine::class,
                'aggregator' => 'all',
                'value' => '1',
                'new_child' => '',
            ],
            '1--2--1' => [
                'type' => \Magento\CatalogWidget\Model\Rule\Condition\Product::class,
                'attribute' => 'amounts',
                'operator' => '==',
                'value' => '123',
            ],
        ];
        $this->getRequest()
            ->setParams([
                'form_namespace' => 'test_namespace',
            ])
            ->setPostValue([
                'conditions' => json_encode($conditions),
            ]);

        $this->dispatch('backend/pagebuilder/form/element_productconditions');

        $responseBody = $this->getResponse()->getBody();

        // Assert the description rule is loaded correctly
        $this->assertMatchesRegularExpression(
            '/<option value="{}" id="(.+)"\s selected="selected">contains<\/option>/',
            $responseBody
        );
        $expected = 'data-ui-id="editable-0-text-parameters-conditions-1-1-value"' .
            '  value="foo" data-form-part="test_namespace"';
        $this->assertStringContainsString($expected, $responseBody);

        // Assert the combine form has form-part
        $expected = 'name="parameters[conditions][1--2][value]" data-form-part="test_namespace"';
        $this->assertStringContainsString($expected, $responseBody);

        // Assert the combine condition has the correct child value and form-part
        $expected = 'data-ui-id="editable-0-text-parameters-conditions-1-2-1-value"' .
            '  value="123" data-form-part="test_namespace"';
        $this->assertStringContainsString($expected, $responseBody);
    }

    public function testFormLoadsProperPrefix()
    {
        $conditions = [
            '1--1' => [
                'type' => \Magento\CatalogWidget\Model\Rule\Condition\Product::class,
                'attribute' => 'description',
                'operator' => '{}',
                'value' => 'foo',
            ],
            '1--2' => [
                'type' => \Magento\CatalogWidget\Model\Rule\Condition\Combine::class,
                'aggregator' => 'all',
                'value' => '1',
                'new_child' => '',
            ],
            '1--2--1' => [
                'type' => \Magento\CatalogWidget\Model\Rule\Condition\Product::class,
                'attribute' => 'amounts',
                'operator' => '==',
                'value' => '123',
            ],
        ];
        $this->getRequest()
            ->setParams([
                'form_namespace' => 'test_namespace',
                'prefix' => 'myprefix',
            ])
            ->setPostValue([
                'conditions' => json_encode($conditions),
            ]);

        $this->dispatch('backend/pagebuilder/form/element_productconditions');

        $responseBody = $this->getResponse()->getBody();

        // Assert the combine form has form-part
        $expected = 'name="parameters[myprefix][1--2][value]"';
        $this->assertStringContainsString($expected, $responseBody);
    }
}
