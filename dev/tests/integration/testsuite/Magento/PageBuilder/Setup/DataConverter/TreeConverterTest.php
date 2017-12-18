<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */
namespace Magento\PageBuilder\Setup\DataConverter;

use Magento\Framework\ObjectManagerInterface;
use Magento\TestFramework\Helper\Bootstrap;

class TreeConverterTest extends \PHPUnit\Framework\TestCase
{
    /**
     * @var ObjectManagerInterface
     */
    private static $objectManager;

    /**
     * @var \Gene\BlueFoot\Setup\DataConverter\TreeConverter
     */
    private static $treeConverter;

    /**
     * @var array
     */
    private static $dropTableNames = [
        'gene_bluefoot_entity_datetime',
        'gene_bluefoot_entity_decimal',
        'gene_bluefoot_entity_int',
        'gene_bluefoot_entity_text',
        'gene_bluefoot_entity_varchar',
        'gene_bluefoot_eav_attribute',
        'gene_bluefoot_entity_type',
        'gene_bluefoot_entity_type_group',
        'gene_bluefoot_stage_template',
        'gene_bluefoot_entity'
    ];

    /**
     * @var array
     */
    private $dropdownAttributeCodes = ['heading_type'];
    
    public static function setUpBeforeClass()
    {
        self::$objectManager = Bootstrap::getObjectManager();

        /** @var \Magento\Framework\Setup\InstallSchemaInterface $installSchema */
        $installSchema = self::$objectManager->create(\Magento\PageBuilder\Setup\DataConverter\InstallSchema::class);

        /** @var \Magento\Framework\Setup\InstallDataInterface $installData */
        $installData = self::$objectManager->create(\Magento\PageBuilder\Setup\DataConverter\InstallData::class);

        /** @var \Magento\Framework\Setup\SchemaSetupInterface $schemaSetup */
        $schemaSetup = self::$objectManager->create(\Magento\Setup\Module\Setup::class);

        /** @var \Magento\Framework\Setup\ModuleDataSetupInterface $moduleDataSetup */
        $moduleDataSetup = self::$objectManager->create(\Magento\Framework\Setup\ModuleDataSetupInterface::class);

        /** @var \Magento\Framework\Setup\ModuleContextInterface $moduleContext */
        $moduleContext = self::$objectManager->create(
            \Magento\Setup\Model\ModuleContext::class,
            ['version' => '1.0.0']
        );

        /** @var \Magento\Framework\DB\Adapter\AdapterInterface $dbAdapter */
        $dbAdapter = self::$objectManager->create(\Magento\Framework\App\ResourceConnection::class)->getConnection();

        $entityTypeSelect = $dbAdapter->select()
            ->from('eav_entity_type', ['entity_type_id'])
            ->where('entity_type_code = ?', 'gene_bluefoot_entity');

        $entityTypeId = $dbAdapter->fetchOne($entityTypeSelect);

        foreach (self::$dropTableNames as $tableName) {
            $dbAdapter->dropTable($tableName);
        }

        if ($entityTypeId) {
            $dbAdapter->delete('eav_attribute', 'entity_type_id = ' . $entityTypeId);
            $dbAdapter->delete('eav_entity_attribute', 'entity_type_id = ' . $entityTypeId);
            $dbAdapter->delete('eav_entity', 'entity_type_id = ' . $entityTypeId);
            $dbAdapter->delete('eav_entity_type', 'entity_type_id = ' . $entityTypeId);
        }

        $installSchema->install($schemaSetup, $moduleContext);

        $installData->install($moduleDataSetup, $moduleContext);

        self::$treeConverter = self::$objectManager->create(\Gene\BlueFoot\Setup\DataConverter\TreeConverter::class);
    }

    /**
     * @param $contentTypes
     * @param $jsonFormatFileName
     * @param $masterFormatFileName
     * @dataProvider convertDataProvider
     */
    public function testConvert($contentTypes, $jsonFormatFileName, $masterFormatFileName)
    {
        foreach ($contentTypes as $contentTypesCode => $contentTypeData) {
            $this->saveContentType($contentTypesCode, $contentTypeData);
        }

        $this->assertEquals(
            file_get_contents(__DIR__ . '/../../_files/' . $masterFormatFileName),
            self::$treeConverter->convert(file_get_contents(__DIR__ . '/../../_files/' . $jsonFormatFileName))
        );
    }

    /**
     * @return array
     */
    public function convertDataProvider()
    {
        return [
            'empty row' => [
                [],
                'empty_row.json',
                'empty_row.html'
            ],
            'heading' => [
                [
                    'heading' => [
                        'entity_id' => 1,
                        'title' => 'Heading title',
                        'css_classes' => 'one two',
                        'metric' => '{\"margin\":\"2px 3px 4px 1px\",\"padding\":\"6px 7px 8px 5px\"}',
                        'align' => 'center',
                        'heading_type' => 'h2',
                    ]
                ],
                'heading.json',
                'heading.html'
            ],
            'row column and heading' => [
                [
                    'heading' => [
                        'entity_id' => 1,
                        'title' => 'Heading title',
                        'css_classes' => 'one two',
                        'metric' => '{\"margin\":\"2px 3px 4px 1px\",\"padding\":\"6px 7px 8px 5px\"}',
                        'align' => 'center',
                        'heading_type' => 'h4',
                    ]
                ],
                'row_column_heading.json',
                'row_column_heading.html'
            ],
            'textarea' => [
                [
                    'textarea' => [
                        'entity_id' => 5,
                        'css_classes' => '',
                        'metric' => '{\"margin\":\"5px 0px 10px 0px\",\"padding\":\"0px 9px 0px 3px\"}',
                        'align' => 'right',
                        'textarea' => '<p><span style="text-decoration: underline;">Hello</span></p><p><strong>World!</strong></p>',
                    ]
                ],
                'textarea.json',
                'textarea.html'
            ],
        ];
    }

    /**
     * @param string $contentTypeCode
     * @param array $data
     * @return int
     */
    private function saveContentType($contentTypeCode, $data)
    {
        /** @var \Gene\BlueFoot\Model\Entity */
        $entity = self::$objectManager->create(\Gene\BlueFoot\Model\Entity::class);

        /** @var \Gene\BlueFoot\Api\ContentBlockRepositoryInterface $contentBlockRepository */
        $contentBlockRepository = self::$objectManager->create(
            \Gene\BlueFoot\Api\ContentBlockRepositoryInterface::class
        );

        /** @var \Gene\BlueFoot\Model\Attribute\ContentBlock $contentBlock */
        $contentBlock = $contentBlockRepository->getByIdentifier($contentTypeCode);

        $data['attribute_set_id'] = $contentBlock->getId();

        /** @var \Magento\Eav\Api\AttributeRepositoryInterface $attributeRepository */
        $attributeRepository = self::$objectManager->create(\Magento\Eav\Api\AttributeRepositoryInterface::class);

        foreach ($data as $key => $value) {
            if (!in_array($key, $this->dropdownAttributeCodes)) {
                continue;
            }
            $attribute = $attributeRepository->get('gene_bluefoot_entity', $key);
            if ($attribute && $attribute->getOptions()) {
                foreach ($attribute->getOptions() as $option) {
                    if ($option['label'] === $value) {
                        $data[$key] = $option['value'];
                    }
                }
            }
        }

        $entity->setData($data);

        /** @var \Gene\BlueFoot\Api\EntityRepositoryInterface $entityRepository */
        $entityRepository = self::$objectManager->create(\Gene\BlueFoot\Api\EntityRepositoryInterface::class);

        $entityRepository->save($entity);

        return $entity->getId();
    }
}
