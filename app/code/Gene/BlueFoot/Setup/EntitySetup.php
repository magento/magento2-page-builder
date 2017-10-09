<?php

namespace Gene\BlueFoot\Setup;

use Magento\Eav\Model\Config;
use Magento\Eav\Model\Entity\Setup\Context;
use Magento\Eav\Setup\EavSetup;
use Magento\Framework\App\CacheInterface;
use Magento\Framework\Setup\ModuleDataSetupInterface;
use Magento\Eav\Model\ResourceModel\Entity\Attribute\Group\CollectionFactory;

/**
 * Class EntitySetup
 *
 * @package Gene\BlueFoot\Setup
 *
 * @author  Dave Macaulay <dave@gene.co.uk>
 */
class EntitySetup extends EavSetup
{
    /**
     * EAV configuration
     *
     * @var Config
     */
    protected $eavConfig;

    /**
     * Init
     *
     * @param ModuleDataSetupInterface $setup
     * @param Context                  $context
     * @param CacheInterface           $cache
     * @param CollectionFactory        $attrGroupCollectionFactory
     * @param Config                   $eavConfig
     */
    public function __construct(
        ModuleDataSetupInterface $setup,
        Context $context,
        CacheInterface $cache,
        CollectionFactory $attrGroupCollectionFactory,
        Config $eavConfig
    ) {
        $this->eavConfig = $eavConfig;
        parent::__construct($setup, $context, $cache, $attrGroupCollectionFactory);
    }

    /**
     * Retrieve default entities: gene_bluefoot_entity
     *
     * @return array
     * @SuppressWarnings(PHPMD.ExcessiveMethodLength)
     */
    public function getDefaultEntities()
    {
        $entities = [
            'gene_bluefoot_entity' => [
                'entity_model'                => 'Gene\BlueFoot\Model\ResourceModel\Entity',
                'attribute_model'             => 'Gene\BlueFoot\Model\Attribute',
                'table'                       => 'gene_bluefoot_entity',
                'increment_model'             => 'Magento\Eav\Model\Entity\Increment\NumericValue',
                'additional_attribute_table'  => 'gene_bluefoot_eav_attribute',
                'entity_attribute_collection' => 'Gene\BlueFoot\Model\ResourceModel\Attribute\Collection',
                'attributes'                  => [
                    'title'                => [
                        'type'         => 'varchar',
                        'label'        => 'Title',
                        'input'        => 'text',
                        'sort_order'   => 1,
                        'global'       => \Magento\Eav\Model\Entity\Attribute\ScopedAttributeInterface::SCOPE_STORE,
                        'note'         => '',
                        'visible'      => 1,
                        'user_defined' => 1,
                        'group'        => 'General'
                    ],
                    'identifier'           => [
                        'type'       => 'static',
                        'label'      => 'Identifier',
                        'input'      => 'text',
                        'sort_order' => 1,
                        'global'     => \Magento\Eav\Model\Entity\Attribute\ScopedAttributeInterface::SCOPE_STORE,
                        'required'   => false,
                        'note'       => '',
                        'visible'    => 2,
                    ],
                    'is_active'            => [
                        'type'         => 'int',
                        'label'        => 'Is Active',
                        'input'        => 'select',
                        'source'       => 'Magento\Eav\Model\Entity\Attribute\Source\Boolean',
                        'sort_order'   => 4,
                        'global'       => \Magento\Eav\Model\Entity\Attribute\ScopedAttributeInterface::SCOPE_STORE,
                        'user_defined' => 1,
                        'group'        => 'General'
                    ],
                    'main_content'         => [
                        'type'            => 'text',
                        'label'           => 'Main Content',
                        'input'           => 'textarea',
                        'wysiwyg_enabled' => 1,
                        'required'        => false,
                        'sort_order'      => 4,
                        'global'          => \Magento\Eav\Model\Entity\Attribute\ScopedAttributeInterface::SCOPE_STORE,
                        'user_defined'    => 1,
                        'group'           => 'General'
                    ],
                    'meta_title'           => [
                        'type'         => 'varchar',
                        'label'        => 'Page Title',
                        'input'        => 'text',
                        'required'     => false,
                        'sort_order'   => 6,
                        'global'       => \Magento\Eav\Model\Entity\Attribute\ScopedAttributeInterface::SCOPE_STORE,
                        'user_defined' => 1,
                        'group'        => 'Meta'
                    ],
                    'meta_keywords'        => [
                        'type'         => 'text',
                        'label'        => 'Meta Keywords',
                        'input'        => 'textarea',
                        'required'     => false,
                        'sort_order'   => 7,
                        'global'       => \Magento\Eav\Model\Entity\Attribute\ScopedAttributeInterface::SCOPE_STORE,
                        'user_defined' => 1,
                        'group'        => 'Meta'
                    ],
                    'meta_description'     => [
                        'type'         => 'text',
                        'label'        => 'Meta Description',
                        'input'        => 'textarea',
                        'required'     => false,
                        'sort_order'   => 8,
                        'global'       => \Magento\Eav\Model\Entity\Attribute\ScopedAttributeInterface::SCOPE_STORE,
                        'user_defined' => 1,
                        'group'        => 'Meta'
                    ],
                    'custom_template'      => [
                        'type'         => 'varchar',
                        'label'        => 'Custom Template',
                        'input'        => 'text',
                        'required'     => false,
                        'sort_order'   => 1,
                        'global'       => \Magento\Eav\Model\Entity\Attribute\ScopedAttributeInterface::SCOPE_STORE,
                        'user_defined' => 1,
                        'group'        => 'Custom Design'
                    ],
                    'custom_design'        => [
                        'type'       => 'varchar',
                        'label'      => 'Custom Design',
                        'input'      => 'select',
                        'source'     => 'Magento\Theme\Model\Theme\Source\Theme',
                        'required'   => false,
                        'sort_order' => 10,
                        'global'     => \Magento\Eav\Model\Entity\Attribute\ScopedAttributeInterface::SCOPE_STORE,
                        'group'      => 'Custom Design',
                    ],
                    'page_layout'          => [
                        'type'       => 'varchar',
                        'label'      => 'Page Layout',
                        'input'      => 'select',
                        'source'     => 'Magento\Catalog\Model\Category\Attribute\Source\Layout',
                        'required'   => false,
                        'sort_order' => 50,
                        'global'     => \Magento\Eav\Model\Entity\Attribute\ScopedAttributeInterface::SCOPE_STORE,
                        'group'      => 'Custom Design',
                    ],
                    'custom_layout_update' => [
                        'type'       => 'text',
                        'label'      => 'Custom Layout Update',
                        'input'      => 'textarea',
                        'backend'    => 'Magento\Catalog\Model\Attribute\Backend\Customlayoutupdate',
                        'required'   => false,
                        'sort_order' => 60,
                        'global'     => \Magento\Eav\Model\Entity\Attribute\ScopedAttributeInterface::SCOPE_STORE,
                        'group'      => 'Custom Design',
                    ],
                    'created_at'           => [
                        'type'       => 'static',
                        'input'      => 'date',
                        'sort_order' => 19,
                        'visible'    => false,
                    ],
                    'updated_at'           => [
                        'type'       => 'static',
                        'input'      => 'date',
                        'sort_order' => 20,
                        'visible'    => false,
                    ],
                ],
            ]
        ];

        return $entities;
    }

    /**
     * Gets EAV configuration
     *
     * @return Config
     */
    public function getEavConfig()
    {
        return $this->eavConfig;
    }
}
