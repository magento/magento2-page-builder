<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */
namespace Magento\PageBuilderDataMigration\Setup\DataConverter;

use Magento\Framework\ObjectManagerInterface;
use Magento\TestFramework\Helper\Bootstrap;

/**
 * @SuppressWarnings(PHPMD.CouplingBetweenObjects)
 */
class TreeConverterTest extends \PHPUnit\Framework\TestCase
{
    /**
     * @var ObjectManagerInterface
     */
    private static $objectManager;

    /**
     * @var \Magento\Framework\App\ResourceConnection
     */
    private static $resourceConnection;

    /**
     * @var \Magento\Framework\DB\Adapter\AdapterInterface
     */
    private static $dbAdapter;

    /**
     * @var \Magento\PageBuilderDataMigration\Setup\DataConverter\TreeConverter
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
        $installSchema = self::$objectManager->create(
            \Magento\TestModulePageBuilderDataMigration\Setup\InstallSchema::class
        );

        /** @var \Magento\Framework\Setup\InstallDataInterface $installData */
        $installData = self::$objectManager->create(
            \Magento\TestModulePageBuilderDataMigration\Setup\InstallData::class
        );

        /** @var \Magento\Framework\Setup\SchemaSetupInterface $schemaSetup */
        $schemaSetup = self::$objectManager->create(\Magento\Setup\Module\Setup::class);

        /** @var \Magento\Framework\Setup\ModuleDataSetupInterface $moduleDataSetup */
        $moduleDataSetup = self::$objectManager->create(\Magento\Framework\Setup\ModuleDataSetupInterface::class);

        /** @var \Magento\Framework\Setup\ModuleContextInterface $moduleContext */
        $moduleContext = self::$objectManager->create(
            \Magento\Setup\Model\ModuleContext::class,
            ['version' => '1.0.0']
        );

        /** @var \Magento\Framework\App\ResourceConnection $resourceConnection */
        self::$resourceConnection = self::$objectManager->create(\Magento\Framework\App\ResourceConnection::class);

        self::$dbAdapter = self::$resourceConnection->getConnection();

        $entityTypeSelect = self::$dbAdapter->select()
            ->from(self::$resourceConnection->getTableName('eav_entity_type'), ['entity_type_id'])
            ->where('entity_type_code = ?', 'gene_bluefoot_entity');

        $entityTypeId = self::$dbAdapter->fetchOne($entityTypeSelect);

        foreach (self::$dropTableNames as $tableName) {
            self::$dbAdapter->dropTable(self::$resourceConnection->getTableName($tableName));
        }

        if ($entityTypeId) {
            $entityTypeIdWhere = 'entity_type_id = ' . $entityTypeId;
            self::$dbAdapter->delete(self::$resourceConnection->getTableName('eav_attribute'), $entityTypeIdWhere);
            self::$dbAdapter->delete(
                self::$resourceConnection->getTableName('eav_entity_attribute'),
                $entityTypeIdWhere
            );
            self::$dbAdapter->delete(self::$resourceConnection->getTableName('eav_entity'), $entityTypeIdWhere);
            self::$dbAdapter->delete(self::$resourceConnection->getTableName('eav_entity_type'), $entityTypeIdWhere);
        }

        $installSchema->install($schemaSetup, $moduleContext);

        $installData->install($moduleDataSetup, $moduleContext);

        self::$treeConverter = self::$objectManager->create(
            \Magento\PageBuilderDataMigration\Setup\DataConverter\TreeConverter::class
        );
    }

    protected function setUp()
    {
        self::$dbAdapter->delete(self::$resourceConnection->getTableName('gene_bluefoot_entity'));
    }

    /**
     * @param array $contentTypes
     * @param string$jsonFormatFileName
     * @param string $masterFormatFileName
     * @param callable|null $callSetupEntity
     * @dataProvider convertDataProvider
     */
    public function testConvert(
        $contentTypes,
        $jsonFormatFileName,
        $masterFormatFileName,
        $callSetupEntity = null
    ) {
        if ($callSetupEntity) {
            $this->$callSetupEntity();
        }

        foreach ($contentTypes as $contentTypesCode => $contentTypesData) {
            foreach ($contentTypesData as $contentType) {
                $this->saveContentType($contentTypesCode, $contentType);
            }
        }

        $this->assertEquals(
            trim(file_get_contents(__DIR__ . '/../../_files/' . $masterFormatFileName)),
            self::$treeConverter->convert(file_get_contents(__DIR__ . '/../../_files/' . $jsonFormatFileName))
        );
    }

    /**
     * @return array
     *
     * @SuppressWarnings(PHPMD.ExcessiveMethodLength)
     */
    public function convertDataProvider()
    {
        return [
            'row empty' => [
                [],
                'row_empty.json',
                'row_empty.html'
            ],
            'row default and full width' => [
                [],
                'row_default_full_width.json',
                'row_default_full_width.html'
            ],
            'row with column and heading' => [
                [
                    'heading' => [
                        [
                            'entity_id' => 1,
                            'title' => 'Heading title',
                            'css_classes' => 'one two',
                            'metric' => '{\"margin\":\"2px 3px 4px 1px\",\"padding\":\"6px 7px 8px 5px\"}',
                            'align' => 'center',
                            'heading_type' => 'h4',
                        ]
                    ]
                ],
                'row_with_column_and_heading.json',
                'row_with_column_and_heading.html'
            ],
            'one column' => [
                [],
                'one_column.json',
                'one_column.html'
            ],
            'two columns' => [
                [],
                'two_columns.json',
                'two_columns.html'
            ],
            'column with mapped widths' => [
                [],
                'mapped_columns.json',
                'mapped_columns.html'
            ],
            'four half columns' => [
                [],
                'four_half_columns.json',
                'four_half_columns.html'
            ],
            'three uneven columns' => [
                [],
                'three_uneven_columns.json',
                'three_uneven_columns.html'
            ],
            'invalid column' => [
                [],
                'invalid_column.json',
                'invalid_column.html'
            ],
            'mixed columns (not 100%) and heading' => [
                [
                    'heading' => [
                        [
                            'entity_id' => 1,
                            'title' => 'Heading title',
                            'css_classes' => 'one two',
                            'metric' => '{\"margin\":\"2px 3px 4px 1px\",\"padding\":\"6px 7px 8px 5px\"}',
                            'align' => 'center',
                            'heading_type' => 'h4',
                        ]
                    ]
                ],
                'mixed_columns_and_heading.json',
                'mixed_columns_and_heading.html',
            ],
            'heading' => [
                [
                    'heading' => [
                        [
                            'entity_id' => 1,
                            'title' => 'Heading title',
                            'css_classes' => 'one two',
                            'metric' => '{\"margin\":\"2px 3px 4px 1px\",\"padding\":\"6px 7px 8px 5px\"}',
                            'align' => 'center',
                            'heading_type' => 'h2',
                        ]
                    ]
                ],
                'heading.json',
                'heading.html'
            ],
            'row column and heading' => [
                [
                    'heading' => [
                        [
                            'entity_id' => 1,
                            'title' => 'Heading title',
                            'css_classes' => 'one two',
                            'metric' => '{\"margin\":\"2px 3px 4px 1px\",\"padding\":\"6px 7px 8px 5px\"}',
                            'align' => 'center',
                            'heading_type' => 'h4',
                        ]
                    ]
                ],
                'row_column_heading.json',
                'row_column_heading.html'
            ],
            'textarea' => [
                [
                    'textarea' => [
                        [
                            'entity_id' => 5,
                            'css_classes' => 'one two',
                            'metric' => '{\"margin\":\"5px 0px 10px 0px\",\"padding\":\"0px 9px 0px 3px\"}',
                            'align' => 'right',
                            'textarea' => '<p><span style="text-decoration: underline;">Hello</span></p>'
                                . '<p><strong>World!</strong></p>',
                        ]
                    ]
                ],
                'textarea.json',
                'textarea.html'
            ],
            'html' => [
                [
                    'html' => [
                        [
                            'entity_id' => 5,
                            'css_classes' => 'one two',
                            'metric' => '{\"margin\":\"5px 5px 5px 5px\",\"padding\":\"1px 1px 1px 1px\"}',
                            'align' => 'center',
                            'html' => '<p style="text-align: center;">The <span style="color: #800000;"><strong>brown'
                                . '</strong></span> cow <span style="text-decoration: underline;">jumped</span>'
                                . ' over the <span style="color: #ffff00;"><em>yellow</em></span> moon.</p>',
                        ]
                    ]
                ],
                'html.json',
                'html.html'
            ],
            'code' => [
                [
                    'code' => [
                        [
                            'entity_id' => 1,
                            'css_classes' => 'one two',
                            'metric' => '{\"margin\":\"5px 5px 5px 5px\",\"padding\":\"1px 1px 1px 1px\"}',
                            'align' => 'left',
                            'html' => '<p style="text-align: center;">The <span style="color: #800000;"><strong>brown'
                                . '</strong></span> cow <span style="text-decoration: underline;">jumped</span>'
                                . ' over the <span style="color: #ffff00;"><em>yellow</em></span> moon.</p>',
                        ]
                    ]
                ],
                'code.json',
                'code.html'
            ],
            'anchor' => [
                [
                    'anchor' => [
                        [
                            'entity_id' => 1,
                            'css_classes' => 'one two',
                            'metric' => '{\"margin\":\"0px 0px 0px 0px\",\"padding\":\"0px 0px 0px 0px\"}',
                            'align' => 'left',
                            'anchor_id' => 'anchor-identifier',
                        ]
                    ]
                ],
                'anchor.json',
                'anchor.html'
            ],
            'divider' => [
                [
                    'hr' => [
                        [
                            'entity_id' => 1,
                            'css_classes' => 'one two',
                            'color' => '9e6767',
                            'hr_height' => '22px',
                            'hr_width' => '100px'
                        ]
                    ]
                ],
                'divider.json',
                'divider.html'
            ],
            'divider width in percentage' => [
                [
                    'hr' => [
                        [
                            'entity_id' => 1,
                            'css_classes' => 'one two',
                            'color' => '9e6767',
                            'hr_height' => '22px',
                            'hr_width' => '50%'
                        ]
                    ]
                ],
                'divider_width_in_percentage.json',
                'divider_width_in_percentage.html'
            ],
            'advanced slider' => [
                [
                    'advanced_slider' => [
                        [
                            'entity_id' => 1,
                            'css_classes' => 'one two',
                            'metric' => '{\"margin\":\"2px 3px 4px 1px\",\"padding\":\"6px 7px 8px 5px\"}',
                            'align' => 'center',
                            'autoplay' => '0',
                            'autoplay_speed' => '0',
                            'fade' => '0',
                            'is_infinite' => '0',
                            'show_arrows' => '0',
                            'show_dots' => '0',
                            'slider_advanced_settings' => '{}',
                        ]
                    ],
                    'advanced_slider_item' => [
                        [
                            'entity_id' => 2,
                            'title' => 'Slide title',
                            'css_classes' => 'one two',
                            'metric' => '{\"margin\":\"2px 3px 4px 1px\",\"padding\":\"6px 7px 8px 5px\"}',
                            'align' => 'center',
                            'has_overlay' => '0',
                            'link_text' => 'Domain',
                            'link_url' => 'http://domain.com/',
                            'textarea' => '<p>Slide <strong>content</strong></p>',
                        ]
                    ]
                ],
                'advanced_slider.json',
                'advanced_slider.html'
            ],
            'advanced slider image appearance' => [
                [
                    'advanced_slider' => [
                        [
                            'entity_id' => 1,
                            'css_classes' => 'one two',
                            'metric' => '{\"margin\":\"2px 3px 4px 1px\",\"padding\":\"6px 7px 8px 5px\"}',
                            'align' => 'center',
                            'autoplay' => '1',
                            'autoplay_speed' => '500',
                            'fade' => '0',
                            'is_infinite' => '0',
                            'show_arrows' => '1',
                            'show_dots' => '0',
                            'slider_advanced_settings' => '',
                        ]
                    ],
                    'advanced_slider_item' => [
                        [
                            'entity_id' => 2,
                            'title' => 'Slide title',
                            'css_classes' => 'one two',
                            'metric' => '{\"margin\":\"2px 3px 4px 1px\",\"padding\":\"6px 7px 8px 5px\"}',
                            'align' => 'center',
                            'has_overlay' => '0',
                            'link_text' => 'Domain',
                            'link_url' => 'http://domain.com/',
                            'textarea' => '<p>Slide <strong>content</strong></p>',
                            'background_image' => '/m/a/magento.png'
                        ]
                    ]
                ],
                'advanced_slider_image_appearance.json',
                'advanced_slider_image_appearance.html'
            ],
            'advanced slider no link text' => [
                [
                    'advanced_slider' => [
                        [
                            'entity_id' => 1,
                            'css_classes' => '',
                            'metric' => '',
                            'align' => '',
                            'autoplay' => '1',
                            'autoplay_speed' => '500',
                            'fade' => '0',
                            'is_infinite' => '0',
                            'show_arrows' => '1',
                            'show_dots' => '0',
                            'slider_advanced_settings' => '',
                        ]
                    ],
                    'advanced_slider_item' => [
                        [
                            'entity_id' => 2,
                            'title' => 'Slide title',
                            'css_classes' => '',
                            'metric' => '{}',
                            'align' => '',
                            'has_overlay' => '0',
                            'link_url' => 'http://domain.com/',
                            'textarea' => '<p>Slide <strong>content</strong></p>',
                        ]
                    ]
                ],
                'advanced_slider_no_link_text.json',
                'advanced_slider_no_link_text.html'
            ],
            'advanced slider overlay' => [
                [
                    'advanced_slider' => [
                        [
                            'entity_id' => 1,
                            'css_classes' => '',
                            'metric' => '',
                            'align' => '',
                            'autoplay' => '1',
                            'autoplay_speed' => '500',
                            'fade' => '0',
                            'is_infinite' => '0',
                            'show_arrows' => '1',
                            'show_dots' => '0',
                            'slider_advanced_settings' => '',
                        ]
                    ],
                    'advanced_slider_item' => [
                        [
                            'entity_id' => 2,
                            'title' => 'Slide title',
                            'css_classes' => '',
                            'metric' => '{}',
                            'align' => '',
                            'has_overlay' => '1',
                            'link_url' => 'http://domain.com/',
                            'textarea' => '<p>Slide <strong>content</strong></p>',
                        ]
                    ]
                ],
                'advanced_slider_overlay.json',
                'advanced_slider_overlay.html'
            ],
            'image with all options and mobile' => [
                [
                    'image' => [
                        [
                            'entity_id' => 5,
                            'css_classes' => 'primary',
                            'metric' => '{\"margin\":\"2px 2px 0px 0px\",\"padding\":\"0px 0px 1px 1px\"}',
                            'align' => '',
                            'image' => '/m/a/magento_1.jpeg',
                            'mobile_image' => '/a/u/austin_2.jpeg',
                            'alt_tag' => 'magento?',
                            'title_tag' => 'MAGENTO!',
                            'has_lightbox' => '1',
                            'show_caption' => '1'
                        ]
                    ]
                ],
                'image_with_mobile.json',
                'image_with_mobile.html'
            ],
            'image with alt tag and no mobile' => [
                [
                    'image' => [
                        [
                            'entity_id' => 5,
                            'css_classes' => '',
                            'metric' => '{\"margin\":\"0px 0px 0px 0px\",\"padding\":\"0px 0px 0px 0px\"}',
                            'align' => '',
                            'image' => '/m/a/magento_1.jpeg',
                            'alt_tag' => 'magento?',
                            'has_lightbox' => '0',
                            'show_caption' => '0'
                        ]
                    ]
                ],
                'image_with_primary.json',
                'image_with_primary.html'
            ],
            'image with caption and no mobile' => [
                [
                    'image' => [
                        [
                            'entity_id' => 5,
                            'css_classes' => '',
                            'metric' => '{\"margin\":\"0px 0px 0px 0px\",\"padding\":\"0px 0px 0px 0px\"}',
                            'align' => '',
                            'image' => '/m/a/magento_1.jpeg',
                            'title_tag' => 'MAGENTO!',
                            'has_lightbox' => '0',
                            'show_caption' => '1'
                        ]
                    ]
                ],
                'image_with_caption.json',
                'image_with_caption.html'
            ],
            'accordions' => [
                [
                    'accordion' => [
                        [
                            'entity_id' => 1,
                            'css_classes' => 'one two',
                        ]
                    ],
                    'accordion_item' => [
                        [
                            'entity_id' => 2,
                            'title' => 'Accordion Title',
                            'textarea' => '<p>Accordion Contents</p>',
                            'open_on_load' => 0
                        ]
                    ]
                ],
                'accordions.json',
                'accordions.html'
            ],
            'accordions with multiple children with open on load' => [
                [
                    'accordion' => [
                        [
                            'entity_id' => 1,
                            'css_classes' => 'one two',
                        ]
                    ],
                    'accordion_item' => [
                        [
                            'entity_id' => 2,
                            'title' => 'Title 1',
                            'textarea' => '<p>Content 1</p>',
                            'open_on_load' => 0
                        ],
                        [
                            'entity_id' => 3,
                            'title' => 'Title 2',
                            'textarea' => '<p>Content 2</p>',
                            'open_on_load' => 1
                        ]
                    ]
                ],
                'accordions_open_on_load.json',
                'accordions_open_on_load.html'
            ],
            'buttons' => [
                [
                    'buttons' => [
                        [
                            'entity_id' => 1,
                            'css_classes' => 'one two',
                            'metric' => '{\"margin\":\"2px 3px 4px 1px\",\"padding\":\"6px 7px 8px 5px\"}',
                            'align' => '',
                            'button_items' => '1',
                        ]
                    ],
                    'button_item' => [
                        [
                            'entity_id' => 2,
                            'css_classes' => 'three four',
                            'metric' => '{\"margin\":\"2px 3px 4px 1px\",\"padding\":\"6px 7px 8px 5px\"}',
                            'align' => '',
                            'link_text' => 'Domain.com',
                            'link_url' => 'http://domain.com/',
                        ]
                    ]
                ],
                'buttons.json',
                'buttons.html'
            ],
            'buttons empty' => [
                [
                    'buttons' => [
                        [
                            'entity_id' => 1,
                            'metric' => '',
                            'align' => '',
                        ]
                    ]
                ],
                'buttons_empty.json',
                'buttons_empty.html'
            ],
            'buttons no link text' => [
                [
                    'buttons' => [
                        [
                            'entity_id' => 1,
                            'metric' => '{\"margin\":\"2px 3px 4px 1px\",\"padding\":\"6px 7px 8px 5px\"}',
                            'align' => '',
                            'button_items' => '1',
                        ]
                    ],
                    'button_item' => [
                        [
                            'entity_id' => 2,
                            'metric' => '{\"margin\":\"2px 3px 4px 1px\",\"padding\":\"6px 7px 8px 5px\"}',
                            'align' => '',
                            'link_url' => 'http://domain.com/',
                        ]
                    ]
                ],
                'buttons_no_link_text.json',
                'buttons_no_link_text.html'
            ],
            'buttons no link url' => [
                [
                    'buttons' => [
                        [
                            'entity_id' => 1,
                            'metric' => '{\"margin\":\"2px 3px 4px 1px\",\"padding\":\"6px 7px 8px 5px\"}',
                            'align' => '',
                            'button_items' => '1',
                        ]
                    ],
                    'button_item' => [
                        [
                            'entity_id' => 2,
                            'metric' => '{\"margin\":\"2px 3px 4px 1px\",\"padding\":\"6px 7px 8px 5px\"}',
                            'align' => '',
                            'link_text' => 'Domain.com',
                        ]
                    ]
                ],
                'buttons_no_link_url.json',
                'buttons_no_link_url.html'
            ],
            'slider' => [
                [
                    'slider' => [
                        [
                            'entity_id' => 1,
                            'css_classes' => 'one two',
                            'metric' => '{\"margin\":\"2px 3px 4px 1px\",\"padding\":\"6px 7px 8px 5px\"}',
                            'align' => 'left',
                            'autoplay' => '0',
                            'autoplay_speed' => '0',
                            'fade' => '0',
                            'is_infinite' => '0',
                            'show_arrows' => '0',
                            'show_dots' => '0',
                            'slider_items' => '0',
                            'slider_advanced_settings' => '{}',
                        ]
                    ],
                    'slider_item' => [
                        [
                            'entity_id' => 2,
                            'css_classes' => 'three four',
                            'metric' => '{\"margin\":\"2px 3px 4px 1px\",\"padding\":\"6px 7px 8px 5px\"}',
                            'align' => 'center',
                            'title_tag' => 'Title',
                            'image' => '/m/a/magento.png',
                            'link_url' => 'http://domain.com/',
                        ]
                    ]
                ],
                'slider.json',
                'slider.html'
            ],
            'slider no link url' => [
                [
                    'slider' => [
                        [
                            'entity_id' => 1,
                            'autoplay' => '0',
                            'autoplay_speed' => '0',
                            'fade' => '0',
                            'is_infinite' => '0',
                            'show_arrows' => '0',
                            'show_dots' => '0',
                            'slider_items' => '0',
                            'slider_advanced_settings' => '{}',
                        ]
                    ],
                    'slider_item' => [
                        [
                            'entity_id' => 2,
                            'title_tag' => 'Title',
                            'image' => '/m/a/magento.png',
                        ]
                    ]
                ],
                'slider_no_link_url.json',
                'slider_no_link_url.html'
            ],
            'slider no link text' => [
                [
                    'slider' => [
                        [
                            'entity_id' => 1,
                            'autoplay' => '0',
                            'autoplay_speed' => '0',
                            'fade' => '0',
                            'is_infinite' => '0',
                            'show_arrows' => '0',
                            'show_dots' => '0',
                            'slider_items' => '0',
                            'slider_advanced_settings' => '{}',
                        ]
                    ],
                    'slider_item' => [
                        [
                            'entity_id' => 2,
                            'image' => '/m/a/magento.png',
                            'link_url' => 'http://domain.com/',
                        ]
                    ]
                ],
                'slider_no_link_text.json',
                'slider_no_link_text.html'
            ],
            'tabs with no items' => [
                [
                    'tabs' => [
                        [
                            'entity_id' => 1,
                            'tabs_items' => 0,
                        ]
                    ]
                ],
                'tabs_with_no_items.json',
                'tabs_with_no_items.html'
            ],
            'tabs with items' => [
                [
                    'tabs' => [
                        [
                            'entity_id' => 1,
                            'css_classes' => 'primary',
                            'metric' => '{\"margin\":\"5px 0px 0px 0px\",\"padding\":\"0px 0px 5px 0px\"}',
                            'tabs_items' => 3
                        ]
                    ],
                    'tabs_item' => [
                        [
                            'entity_id' => 2,
                            'css_classes' => 'secondary',
                            'title' => 'Item 1',
                            'textarea' => '<p><strong>Item 1</strong></p>',
                            'metric' => '{\"margin\":\"0px 0px 0px 5px\",\"padding\":\"0px 5px 0px 0px\"}',
                        ],
                        [
                            'entity_id' => 3,
                            'css_classes' => 'secondary',
                            'title' => 'Item 2',
                            'textarea' => '<p><em>Item 2</em></p>',
                            'metric' => '{\"margin\":\"0px 0px 10px 0px\",\"padding\":\"10px 0px 0px 0px\"}',
                        ],
                        [
                            'entity_id' => 4,
                            'css_classes' => 'secondary',
                            'title' => 'Item 3',
                            'textarea' => '<p><span style="text-decoration: underline;">Item 3</span></p>',
                            'metric' => '{\"margin\":\"0px 0px 0px 15px\",\"padding\":\"15px 0px 0px 0px\"}',
                        ]
                    ]
                ],
                'tabs_with_items.json',
                'tabs_with_items.html'
            ],
            'video with px' => [
                [
                    'video' => [
                        [
                            'entity_id' => 5,
                            'css_classes' => 'primary',
                            'video_url' => 'https://www.youtube.com',
                            'video_width' => '640px',
                            'video_height' => '480px'
                        ]
                    ]
                ],
                'video_px.json',
                'video_px.html'
            ],
            'video with percent' => [
                [
                    'video' => [
                        [
                            'entity_id' => 5,
                            'css_classes' => 'primary',
                            'video_url' => 'https://www.youtube.com',
                            'video_width' => '75%',
                            'video_height' => '25%'
                        ]
                    ]
                ],
                'video_percent.json',
                'video_percent.html'
            ],
            'video with invalid sizes' => [
                [
                    'video' => [
                        [
                            'entity_id' => 5,
                            'css_classes' => 'primary',
                            'video_url' => 'https://www.youtube.com',
                            'video_width' => '600',
                            'video_height' => '600'
                        ]
                    ]
                ],
                'video_invalid_size.json',
                'video_invalid_size.html'
            ],
            'map' => [
                [
                    'map' => [
                        [
                            'entity_id' => 1,
                            'css_classes' => 'one two',
                            'metric' => '{\"margin\":\"0px 0px 0px 0px\",\"padding\":\"0px 0px 0px 0px\"}',
                            'align' => 'center',
                            'map' => '50.821392,-0.139439,8',
                            'map_height' => '300px'
                        ]
                    ]
                ],
                'map.json',
                'map.html'
            ],
            'map default src empty' => [
                [
                    'map' => [
                        [
                            'entity_id' => 1,
                            'css_classes' => 'one two',
                            'map' => '',
                            'map_height' => '300px'
                        ]
                    ]
                ],
                'map_default_src.json',
                'map_default_src.html'
            ],
            'map default src missing' => [
                [
                    'map' => [
                        [
                            'entity_id' => 1,
                            'css_classes' => 'one two',
                            'map_height' => '300px'
                        ]
                    ]
                ],
                'map_default_src.json',
                'map_default_src.html'
            ],
            'newsletter' => [
                [
                    'newsletter' => [
                        [
                            'entity_id' => 1,
                            'css_classes' => 'newsletter-one newsletter-two',
                            'metric' => '{\"margin\":\"5px 5px 5px 5px\",\"padding\":\"1px 1px 1px 1px\"}',
                            'align' => 'center',
                            'title' => 'Title',
                            'button_text' => 'Button Text',
                            'label' => 'Label',
                            'placeholder' => 'Placeholder',
                        ]
                    ]
                ],
                'newsletter.json',
                'newsletter.html'
            ],
            'search' => [
                [
                    'search' => [
                        [
                            'entity_id' => 1,
                            'css_classes' => 'search-one search-two',
                            'metric' => '{\"margin\":\"5px 5px 5px 5px\",\"padding\":\"1px 1px 1px 1px\"}',
                            'align' => 'center',
                            'placeholder' => 'Placeholder',
                        ]
                    ]
                ],
                'search.json',
                'search.html'
            ],
            'search_no_placeholder' => [
                [
                    'search' => [
                        [
                            'entity_id' => 1,
                            'css_classes' => 'search-no-placeholder-one search-no-placeholder-two',
                            'metric' => '{\"margin\":\"5px 5px 5px 5px\",\"padding\":\"1px 1px 1px 1px\"}',
                            'align' => 'center',
                            'placeholder' => '',
                        ]
                    ]
                ],
                'search_no_placeholder.json',
                'search_no_placeholder.html'
            ],
            'block' => [
                [
                    'static_block' => [
                        [
                            'entity_id' => 1,
                            'css_classes' => 'block-one block-two',
                            'metric' => '{\"margin\":\"5px 5px 5px 5px\",\"padding\":\"1px 1px 1px 1px\"}',
                            'align' => 'center',
                            'block_id' => '10'
                        ]
                    ]
                ],
                'block.json',
                'block.html',
                'createCmsBlock'
            ],
            'custom' => [
                [],
                'custom.json',
                'custom.html'
            ],
            'driver' => [
                [
                    'driver' => [
                        [
                            'entity_id' => 1,
                            'css_classes' => 'one two',
                            'image' => '/m/a/magento.png',
                            'link_url' => 'http://domain.com/',
                            'link_text' => 'Link Text',
                            'target_blank' => '0'
                        ]
                    ]
                ],
                'driver.json',
                'banner.html'
            ],
            'driver mobile image' => [
                [
                    'driver' => [
                        [
                            'entity_id' => 1,
                            'css_classes' => 'one two',
                            'image' => '/m/a/magento1.png',
                            'link_url' => 'http://domain.com/',
                            'mobile_image' => '/m/a/magento2.png',
                            'target_blank' => '0'
                        ]
                    ]
                ],
                'driver_mobile_image.json',
                'banner_mobile_image.html'
            ],
            'driver open in new window' => [
                [
                    'driver' => [
                        [
                            'entity_id' => 1,
                            'css_classes' => 'one two',
                            'image' => '/m/a/magento1.png',
                            'link_url' => 'http://domain.com/',
                            'target_blank' => '1',
                        ]
                    ]
                ],
                'driver_new_window.json',
                'banner_new_window.html'
            ],
            'product' => [
                [
                    'product' => [
                        [
                            'entity_id' => 1,
                            'css_classes' => 'one two',
                            'product_display' => '2',
                            'product_id' => 2
                        ]
                    ]
                ],
                'product.json',
                'product.html',
                'createProduct'
            ],
            'product list' => [
                [
                    'product_list' => [
                        [
                            'entity_id' => 1,
                            'css_classes' => 'productlist-one productlist-two',
                            'metric' => '{\"margin\":\"5px 5px 5px 5px\",\"padding\":\"1px 1px 1px 1px\"}',
                            'align' => 'center',
                            'category_id' => 10,
                            'product_count' => 3,
                            'hide_out_of_stock' => 1,
                        ]
                    ]
                ],
                'product_list.json',
                'product_list.html'
            ],
            'non existent entity' => [
                [
                    'advanced_slider' => [
                        [
                            'entity_id' => 1,
                        ]
                    ],
                    'slider' => [
                        [
                            'entity_id' => 1,
                        ]
                    ],
                    'buttons' => [
                        [
                            'entity_id' => 1,
                        ]
                    ],
                    'tabs' => [
                        [
                            'entity_id' => 1,
                        ]
                    ],
                    'accordion' => [
                        [
                            'entity_id' => 1,
                        ]
                    ]
                ],
                'non_existent_entity.json',
                'non_existent_entity.html'
            ]
        ];
    }

    /**
     * Creates and saves a CMS Block to database
     *
     * @SuppressWarnings(PHPMD.UnusedPrivateMethod)
     */
    private function createCmsBlock()
    {
        /** @var \Magento\Cms\Api\BlockRepositoryInterface $blockRepository */
        $blockRepository = self::$objectManager->create(\Magento\Cms\Api\BlockRepositoryInterface::class);

        /** @var \Magento\Cms\Api\Data\BlockInterfaceFactory $blockFactory */
        $blockFactory = self::$objectManager->create(\Magento\Cms\Api\Data\BlockInterfaceFactory::class);

        $block = $blockFactory->create(
            [
                'data' => [
                    'block_id' => 10,
                    'title' => 'Block title',
                    'identifier' => 'Identifier',
                    'content' => 'Content'
                ]
            ]
        );

        $blockRepository->save($block);
    }

    /**
     * @SuppressWarnings(PHPMD.UnusedPrivateMethod)
     */
    private function createProduct()
    {
        /** @var \Magento\Catalog\Api\ProductRepositoryInterface $productRepository */
        $productRepository = self::$objectManager->create(\Magento\Catalog\Api\ProductRepositoryInterface::class);

        /** @var \Magento\Catalog\Api\Data\ProductInterfaceFactory $productFactory */
        $productFactory = self::$objectManager->create(\Magento\Catalog\Api\Data\ProductInterfaceFactory::class);

        /** @var \Magento\Catalog\Setup\CategorySetup $installer */
        $installer = self::$objectManager->create(\Magento\Catalog\Setup\CategorySetup::class);
        $attributeSetId = $installer->getAttributeSetId('catalog_product', 'Default');

        $productSku = 'product-for-data-migration';

        $product = $productFactory->create(
            [
                'data' => [
                    'entity_id' => 2,
                    'description' => $productSku,
                    'attribute_set_id' => $attributeSetId,
                    'name' => $productSku,
                    'sku' => $productSku,
                    'price' => 10,
                    'visibility' => \Magento\Catalog\Model\Product\Visibility::VISIBILITY_NOT_VISIBLE,
                    'status' => \Magento\Catalog\Model\Product\Attribute\Source\Status::STATUS_ENABLED,
                    'stock_data' => [
                        'use_config_manage_stock' => 1,
                        'qty' => 100,
                        'is_qty_decimal' => 0,
                        'is_in_stock' => 1
                    ]
                ]
            ]
        );

        $productRepository->save($product);
    }

    /**
     * Save a content type into the database
     *
     * @param $contentTypeCode
     * @param $data
     * @throws \Exception
     * @throws \Magento\Framework\Exception\NoSuchEntityException
     */
    private function saveContentType($contentTypeCode, $data)
    {
        /** @var \Magento\PageBuilderDataMigration\Model\Entity */
        $entity = self::$objectManager->create(\Magento\PageBuilderDataMigration\Model\Entity::class);

        $data['attribute_set_id'] = $this->getContentTypeId($contentTypeCode);

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

        /* @var \Magento\PageBuilderDataMigration\Model\ResourceModel\Entity $entityResource */
        $entityResource = self::$objectManager->create(
            \Magento\PageBuilderDataMigration\Model\ResourceModel\Entity::class
        );
        $entityResource->save($entity);
    }

    /**
     * @param $contentTypeCode
     * @return mixed
     * @throws \Magento\Framework\Exception\NoSuchEntityException
     */
    private function getContentTypeId($contentTypeCode)
    {
        /* @var \Magento\TestModulePageBuilderDataMigration\Model\Attribute\ContentTypeFactory $contentTypeFactory */
        $contentTypeFactory = self::$objectManager->create(
            \Magento\TestModulePageBuilderDataMigration\Model\Attribute\ContentTypeFactory::class
        );
        $contentType = $contentTypeFactory->create();

        $contentTypeResource = self::$objectManager->create(
            \Magento\TestModulePageBuilderDataMigration\Model\ResourceModel\Attribute\ContentType::class
        );
        /* @var \Magento\TestModulePageBuilderDataMigration\Model\Attribute\ContentType $contentType */
        $contentTypeResource->load(
            $contentType,
            $contentTypeCode,
            sprintf('%s.identifier', self::$resourceConnection->getTableName('entity_type'))
        );
        if (!$contentType->getId()) {
            throw \Magento\Framework\Exception\NoSuchEntityException::singleField(
                'identifier',
                $contentTypeCode
            );
        }

        return $contentType->getId();
    }
}
