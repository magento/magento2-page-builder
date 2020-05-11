<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */
declare(strict_types=1);

namespace Magento\PageBuilder\Test\Unit\Model\Catalog;

use Magento\Framework\TestFramework\Unit\Helper\ObjectManager;
use Magento\PageBuilder\Model\Catalog\Sorting;
use Magento\PageBuilder\Model\Catalog\Sorting\Factory;
use Magento\PageBuilder\Model\Catalog\Sorting\OptionInterface;
use PHPUnit\Framework\MockObject\MockObject;
use PHPUnit\Framework\MockObject\Stub\ReturnValueMap;
use PHPUnit\Framework\TestCase;

/**
 * Test for Sorting.
 */
class SortingTest extends TestCase
{
    /**
     * @var ObjectManager
     */
    private $objectManager;

    /**
     * @var Factory|MockObject
     */
    private $sortingFactoryMock;

    /**
     * @inheritdoc
     */
    protected function setUp(): void
    {
        $this->objectManager = new ObjectManager($this);
        $this->sortingFactoryMock = $this->createMock(Factory::class);
    }

    /**
     * Tests getSortingInstance method.
     *
     * @return void
     */
    public function testGetSortingInstance(): void
    {
        $sortClassesMap = [
            'position' => [
                'className' => 'Magento\PageBuilder\Model\Catalog\Sorting\Position',
                'label' => 'Position',
            ],
            'position_by_sku' => [
                'className' => 'Magento\PageBuilder\Model\Catalog\Sorting\PositionBySku',
                'label' => 'Position',
            ],
        ];
        $optionMocks = $this->createOptionMocks($sortClassesMap);
        $model = $this->createTestingModel($optionMocks, $sortClassesMap);

        $this->assertEquals(
            $optionMocks['position'],
            $model->getSortingInstance('position'),
            "Appropriate sort class should be returned."
        );

        $this->assertEquals(
            $optionMocks['position_by_sku'],
            $model->getSortingInstance('position_by_sku'),
            "Appropriate sort class should be returned."
        );

        $this->assertNull(
            $model->getSortingInstance('non-existent-class'),
            "Null should be returned for an unassigned sort class."
        );
    }

    /**
     * Creates testing model.
     * Creates testing model with mocked Sorting Factory and populated with Option mocks.
     *
     * @param OptionInterface[]|MockObject[] $optionMocks
     * @param array $sortClassesMap
     * @return Sorting
     */
    private function createTestingModel(array $optionMocks = [], array $sortClassesMap = []): Sorting
    {
        $factoryValueMap = $this->createFactoryValueMap($optionMocks, $sortClassesMap);

        $this->sortingFactoryMock->method('create')
            ->will($factoryValueMap);

        $sortClasses = [];

        foreach ($sortClassesMap as $key => $value) {
            $sortClasses[$key] = $value['className'];
        }

        return $this->objectManager->getObject(
            Sorting::class,
            [
                'factory' => $this->sortingFactoryMock,
                'sortClasses' => $sortClasses,
            ]
        );
    }

    /**
     * Creates value map for the create method of Sorting Factory Mock.
     *
     * @param array $optionMocks
     * @param array $sortClassesMap
     * @return ReturnValueMap
     */
    private function createFactoryValueMap(array $optionMocks, array $sortClassesMap): ReturnValueMap
    {
        $map = [];

        foreach ($optionMocks as $key => $mock) {
            $map[] = [$sortClassesMap[$key]['className'], [], $mock];
        }

        return $this->returnValueMap($map);
    }

    /**
     * Creates OptionInterface mocks by the given configurations.
     *
     * The optionMocksConfiguration parameter should be like:
     * [
     *     'position' => [
     *         'className' => 'Magento\PageBuilder\Model\Catalog\Sorting\Position',
     *         'label' => 'Position',
     *     ],
     *     'position_by_sku' => [
     *         'className' => 'Magento\PageBuilder\Model\Catalog\Sorting\PositionBySku',
     *         'label' => 'Position by sku',
     *     ],
     *     ...
     * ]
     *
     * @param array $optionMocksConfiguration
     * @return OptionInterface[]|MockObject[] OptionInterface mocks indexed by configuration keys
     */
    private function createOptionMocks(array $optionMocksConfiguration): array
    {
        $mocks = [];

        foreach ($optionMocksConfiguration as $key => $optionMockConfiguration) {
            $mocks[$key] = $this->createOptionMock($optionMockConfiguration['label']);
        }

        return $mocks;
    }

    /**
     * Creates OptionInterface mock object.
     *
     * @param string $label
     * @return OptionInterface|MockObject
     */
    private function createOptionMock(string $label): MockObject
    {
        $mock = $this->getMockForAbstractClass(OptionInterface::class);
        $mock->method('getLabel')
            ->willReturn(__($label));

        return $mock;
    }
}
