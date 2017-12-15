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
    private $objectManager;

    /**
     * @var \Gene\BlueFoot\Setup\DataConverter\TreeConverter
     */
    private $treeConverter;

    protected function setUp()
    {
        $this->objectManager = Bootstrap::getObjectManager();
    }

    public function testConvert()
    {
        /** @var \Magento\Framework\Setup\InstallSchemaInterface $installSchema */
        $installSchema = $this->objectManager->create(\Magento\PageBuilder\Setup\DataConverter\InstallSchema::class);
        /** @var \Magento\Framework\Setup\InstallDataInterface $installData */
        $installData = $this->objectManager->create(\Magento\PageBuilder\Setup\DataConverter\InstallData::class);

        /** @var \Magento\Framework\Setup\SchemaSetupInterface $schemaSetup */
        $schemaSetup = $this->objectManager->create(\Magento\Setup\Module\Setup::class);

        /** @var \Magento\Framework\Setup\ModuleDataSetupInterface $moduleDataSetup */
        $moduleDataSetup = $this->objectManager->create(\Magento\Framework\Setup\ModuleDataSetupInterface::class);

        /** @var \Magento\Framework\Setup\ModuleContextInterface $moduleContext */
        $moduleContext = $this->objectManager->create(\Magento\Setup\Model\ModuleContext::class, ['version' => '1.0.0']);

        /** @var \Magento\Framework\DB\Adapter\AdapterInterface $dbAdapter */
        $dbAdapter = $this->objectManager->create(\Magento\Framework\App\ResourceConnection::class)->getConnection();

        $entityTypeSelect = $dbAdapter->select()
            ->from('eav_entity_type', ['entity_type_id'])
            ->where('entity_type_code = ?', 'gene_bluefoot_entity');

        $entityTypeId = $dbAdapter->fetchOne($entityTypeSelect);

        $eavAttributeSetSelect = $dbAdapter->select()
            ->from('eav_attribute_set', ['attribute_set_id'])
            ->where('entity_type_id = ?', $entityTypeId);

        $dbAdapter->dropTable('gene_bluefoot_entity_datetime');
        $dbAdapter->dropTable('gene_bluefoot_entity_decimal');
        $dbAdapter->dropTable('gene_bluefoot_entity_int');
        $dbAdapter->dropTable('gene_bluefoot_entity_text');
        $dbAdapter->dropTable('gene_bluefoot_entity_varchar');
        $dbAdapter->dropTable('gene_bluefoot_eav_attribute');
        $dbAdapter->dropTable('gene_bluefoot_entity_type');
        $dbAdapter->dropTable('gene_bluefoot_entity_type_group');
        $dbAdapter->dropTable('gene_bluefoot_stage_template');
        $dbAdapter->dropTable('gene_bluefoot_entity');

        if ($entityTypeId) {
            $dbAdapter->delete('eav_attribute', 'entity_type_id = ' . $entityTypeId);
            $dbAdapter->delete('eav_entity_attribute', 'entity_type_id = ' . $entityTypeId);
            $dbAdapter->delete('eav_entity', 'entity_type_id = ' . $entityTypeId);
            $dbAdapter->delete('eav_entity_type', 'entity_type_id = ' . $entityTypeId);
        }
        $dbAdapter->delete('eav_attribute_option');
        $dbAdapter->delete('eav_attribute_option_value');
        //$dbAdapter->delete('eav_attribute_group', 'attribute_set_id in (' . implode(',', $dbAdapter->fetchCol($eavAttributeSetSelect)) . ')');

        $installSchema->install($schemaSetup, $moduleContext);

        $installData->install($moduleDataSetup, $moduleContext);

        $this->treeConverter = $this->objectManager->create(\Gene\BlueFoot\Setup\DataConverter\TreeConverter::class);

        $entityRepository = $this->objectManager->create(\Gene\BlueFoot\Api\EntityRepositoryInterface::class);

        /** @var \Gene\BlueFoot\Model\Entity */
        $entity = $this->objectManager->create(\Gene\BlueFoot\Model\Entity::class);

        /** @var \Gene\BlueFoot\Api\ContentBlockRepositoryInterface $contentBlockRepository */
        $contentBlockRepository = $this->objectManager->create(\Gene\BlueFoot\Api\ContentBlockRepositoryInterface::class);
        $contentBlock = $contentBlockRepository->getByIdentifier('heading');

        /** @var \Magento\Eav\Api\AttributeRepositoryInterface $attributeRepository */
        $attributeRepository = $this->objectManager->create(\Magento\Eav\Api\AttributeRepositoryInterface::class);
        $headingTypeAttribute = $attributeRepository->get('gene_bluefoot_entity', 'heading_type');

        $entity->setData(
            [
                'attribute_set_id' => $contentBlock->getId(),
                'title' => 'Heading title',
                'css_classes' => 'heading-class',
                'metric' => '{"margin":"12px - - -","padding":"- - - -"}',
                'align' => 'center',
                'heading_type' => $headingTypeAttribute->getOptions()[3]['value'],
            ]
        );
        $entityRepository->save($entity);

        $masterFormat = $this->treeConverter->convert(
            '[{"type":"row","children":[{"type":"column","formData":{"width":"0.500","remove_padding":"1","css_classes":"","undefined":"","align":"","metric":{"margin":"- 5px - -","padding":"- - - -"}},"children":[{"contentType":"heading","entityId":"' . 1 . '","formData":{"align":"","metric":""}}]}]}]'
        );

        $this->assertEquals(
            '<div data-role="row" style="display: flex;"><div data-role="column" style="margin: 0px 5px 0px 0px; padding: 0px 0px 0px 0px; width: 50%;"><h4 data-role="heading" class="heading-class">Heading title</h4></div></div>',
            $masterFormat
        );
    }
}
