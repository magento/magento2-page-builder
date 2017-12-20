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
     * @var \Magento\Framework\DB\Adapter\AdapterInterface
     */
    private static $dbAdapter;

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

        /** @var \Magento\Framework\App\ResourceConnection $resourceConnection */
        $resourceConnection = self::$objectManager->create(\Magento\Framework\App\ResourceConnection::class);

        self::$dbAdapter = $resourceConnection->getConnection();

        $entityTypeSelect = self::$dbAdapter->select()
            ->from('eav_entity_type', ['entity_type_id'])
            ->where('entity_type_code = ?', 'gene_bluefoot_entity');

        $entityTypeId = self::$dbAdapter->fetchOne($entityTypeSelect);

        foreach (self::$dropTableNames as $tableName) {
            self::$dbAdapter->dropTable($tableName);
        }

        if ($entityTypeId) {
            self::$dbAdapter->delete('eav_attribute', 'entity_type_id = ' . $entityTypeId);
            self::$dbAdapter->delete('eav_entity_attribute', 'entity_type_id = ' . $entityTypeId);
            self::$dbAdapter->delete('eav_entity', 'entity_type_id = ' . $entityTypeId);
            self::$dbAdapter->delete('eav_entity_type', 'entity_type_id = ' . $entityTypeId);
        }

        $installSchema->install($schemaSetup, $moduleContext);

        $installData->install($moduleDataSetup, $moduleContext);

        self::$treeConverter = self::$objectManager->create(\Gene\BlueFoot\Setup\DataConverter\TreeConverter::class);
    }

    protected function setUp()
    {
        self::$dbAdapter->delete('gene_bluefoot_entity');
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
            if ($this->isArrayOfChildren($contentTypeData)) {
                foreach ($contentTypeData as $contentType) {
                    $this->saveContentType($contentTypesCode, $contentType);
                }
            } else {
                $this->saveContentType($contentTypesCode, $contentTypeData);
            }
        }

        $this->assertEquals(
            file_get_contents(__DIR__ . '/../../_files/' . $masterFormatFileName),
            self::$treeConverter->convert(file_get_contents(__DIR__ . '/../../_files/' . $jsonFormatFileName))
        );
    }

    /**
     * Detect if the child array only has numeric keys, if so it contains numerous entities to create
     *
     * @param array $array
     *
     * @return bool
     */
    private function isArrayOfChildren(array $array)
    {
        return count(array_filter(array_keys($array), 'is_string')) === 0;
    }

    /**
     * @return array
     */
    public function convertDataProvider()
    {
        return [
            'row empty' => [
                [],
                'row_empty.json',
                'row_empty.html'
            ],
            'row with column and heading' => [
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
            'html' => [
                [
                    'html' => [
                        'entity_id' => 5,
                        'css_classes' => '',
                        'metric' => '{\"margin\":\"5px 5px 5px 5px\",\"padding\":\"1px 1px 1px 1px\"}',
                        'align' => '',
                        'html' => '<p style="text-align: center;">The <span style="color: #800000;"><strong>brown</strong></span> cow <span style="text-decoration: underline;">jumped</span> over the <span style="color: #ffff00;"><em>yellow</em></span> moon.</p>',
                    ]
                ],
                'html.json',
                'html.html'
            ],
            'anchor' => [
                [
                    'anchor' => [
                        'entity_id' => 1,
                        'css_classes' => 'one two',
                        'metric' => '{\"margin\":\"0px 0px 0px 0px\",\"padding\":\"0px 0px 0px 0px\"}',
                        'align' => 'left',
                        'anchor_id' => 'anchor-identifier',
                    ]
                ],
                'anchor.json',
                'anchor.html'
            ],
            'divider' => [
                [
                    'hr' => [
                        'entity_id' => 1,
                        'css_classes' => 'one two',
                        'color' => '9e6767',
                        'hr_height' => '22px',
                        'hr_width' => '100px'
                    ]
                ],
                'divider.json',
                'divider.html'
            ],
            'advanced slider' => [
                [
                    'advanced_slider' => [
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
                    ],
                    'advanced_slider_item' => [
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
                ],
                'advanced_slider.json',
                'advanced_slider.html'
            ],
            'advanced slider image appearance' => [
                [
                    'advanced_slider' => [
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
                    ],
                    'advanced_slider_item' => [
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
                ],
                'advanced_slider_image_appearance.json',
                'advanced_slider_image_appearance.html'
            ],
            'advanced slider no link text' => [
                [
                    'advanced_slider' => [
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
                    ],
                    'advanced_slider_item' => [
                        'entity_id' => 2,
                        'title' => 'Slide title',
                        'css_classes' => '',
                        'metric' => '{}',
                        'align' => '',
                        'has_overlay' => '0',
                        'link_url' => 'http://domain.com/',
                        'textarea' => '<p>Slide <strong>content</strong></p>',
                    ]
                ],
                'advanced_slider_no_link_text.json',
                'advanced_slider_no_link_text.html'
            ],
            'advanced slider overlay' => [
                [
                    'advanced_slider' => [
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
                    ],
                    'advanced_slider_item' => [
                        'entity_id' => 2,
                        'title' => 'Slide title',
                        'css_classes' => '',
                        'metric' => '{}',
                        'align' => '',
                        'has_overlay' => '1',
                        'link_url' => 'http://domain.com/',
                        'textarea' => '<p>Slide <strong>content</strong></p>',
                    ]
                ],
                'advanced_slider_overlay.json',
                'advanced_slider_overlay.html'
            ],
            'image with mobile' => [
                [
                    'image' => [
                        'entity_id' => 5,
                        'css_classes' => 'primary',
                        'metric' => '{\"margin\":\"0px 0px 0px 0px\",\"padding\":\"0px 0px 0px 0px\"}',
                        'align' => '',
                        'image' => '/b/u/bunny_2.jpeg',
                        'mobile_image' => '/k/i/kitten_2.jpeg',
                        'alt_tag' => 'bunny?',
                        'title_tag' => 'BUNNIES!',
                        'has_lightbox' => '1',
                        'show_caption' => '1'
                    ]
                ],
                'image_with_mobile.json',
                'image_with_mobile.html'
            ],
            'image with less options' => [
                [
                    'image' => [
                        'entity_id' => 5,
                        'css_classes' => '',
                        'metric' => '{\"margin\":\"0px 0px 0px 0px\",\"padding\":\"0px 0px 0px 0px\"}',
                        'align' => '',
                        'image' => '/b/u/bunny_1.jpeg',
                        'alt_tag' => 'bunny?',
                        'has_lightbox' => '0',
                        'show_caption' => '0'
                    ]
                ],
                'image_with_less_options.json',
                'image_with_less_options.html'
            ],
            'accordions' => [
                [
                    'accordion' => [
                        'entity_id' => 1,
                        'css_classes' => 'one two',
                    ],
                    'accordion_item' => [
                        'entity_id' => 2,
                        'title' => 'Accordion Title',
                        'textarea' => '<p>Accordion Contents</p>',
                        'open_on_load' => 0
                    ]
                ],
                'accordions.json',
                'accordions.html'
            ],
            'accordions with multiple children with open on load' => [
                [
                    'accordion' => [
                        'entity_id' => 1,
                        'css_classes' => 'one two',
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
                        'entity_id' => 1,
                        'css_classes' => 'one two',
                        'metric' => '{\"margin\":\"2px 3px 4px 1px\",\"padding\":\"6px 7px 8px 5px\"}',
                        'align' => '',
                        'button_items' => '1',
                    ],
                    'button_item' => [
                        'entity_id' => 2,
                        'css_classes' => 'three four',
                        'metric' => '{\"margin\":\"2px 3px 4px 1px\",\"padding\":\"6px 7px 8px 5px\"}',
                        'align' => '',
                        'link_text' => 'Domain.com',
                        'link_url' => 'http://domain.com/',
                    ]
                ],
                'buttons.json',
                'buttons.html'
            ],
            'buttons empty' => [
                [
                    'buttons' => [
                        'entity_id' => 1,
                        'metric' => '',
                        'align' => '',
                    ]
                ],
                'buttons_empty.json',
                'buttons_empty.html'
            ],
            'buttons no link text' => [
                [
                    'buttons' => [
                        'entity_id' => 1,
                        'metric' => '{\"margin\":\"2px 3px 4px 1px\",\"padding\":\"6px 7px 8px 5px\"}',
                        'align' => '',
                        'button_items' => '1',
                    ],
                    'button_item' => [
                        'entity_id' => 2,
                        'metric' => '{\"margin\":\"2px 3px 4px 1px\",\"padding\":\"6px 7px 8px 5px\"}',
                        'align' => '',
                        'link_url' => 'http://domain.com/',
                    ]
                ],
                'buttons_no_link_text.json',
                'buttons_no_link_text.html'
            ],
            'buttons no link url' => [
                [
                    'buttons' => [
                        'entity_id' => 1,
                        'metric' => '{\"margin\":\"2px 3px 4px 1px\",\"padding\":\"6px 7px 8px 5px\"}',
                        'align' => '',
                        'button_items' => '1',
                    ],
                    'button_item' => [
                        'entity_id' => 2,
                        'metric' => '{\"margin\":\"2px 3px 4px 1px\",\"padding\":\"6px 7px 8px 5px\"}',
                        'align' => '',
                        'link_text' => 'Domain.com',
                    ]
                ],
                'buttons_no_link_url.json',
                'buttons_no_link_url.html'
            ],
            'slider' => [
                [
                    'slider' => [
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
                    ],
                    'slider_item' => [
                        'entity_id' => 2,
                        'css_classes' => 'three four',
                        'metric' => '{\"margin\":\"2px 3px 4px 1px\",\"padding\":\"6px 7px 8px 5px\"}',
                        'align' => 'center',
                        'title_tag' => 'Title',
                        'image' => '/m/a/magento.png',
                        'link_url' => 'http://domain.com/',
                    ]
                ],
                'slider.json',
                'slider.html'
            ],
            'slider no link url' => [
                [
                    'slider' => [
                        'entity_id' => 1,
                        'autoplay' => '0',
                        'autoplay_speed' => '0',
                        'fade' => '0',
                        'is_infinite' => '0',
                        'show_arrows' => '0',
                        'show_dots' => '0',
                        'slider_items' => '0',
                        'slider_advanced_settings' => '{}',
                    ],
                    'slider_item' => [
                        'entity_id' => 2,
                        'title_tag' => 'Title',
                        'image' => '/m/a/magento.png',
                    ]
                ],
                'slider_no_link_url.json',
                'slider_no_link_url.html'
            ],
            'slider no link text' => [
                [
                    'slider' => [
                        'entity_id' => 1,
                        'autoplay' => '0',
                        'autoplay_speed' => '0',
                        'fade' => '0',
                        'is_infinite' => '0',
                        'show_arrows' => '0',
                        'show_dots' => '0',
                        'slider_items' => '0',
                        'slider_advanced_settings' => '{}',
                    ],
                    'slider_item' => [
                        'entity_id' => 2,
                        'image' => '/m/a/magento.png',
                        'link_url' => 'http://domain.com/',
                    ]
                ],
                'slider_no_link_text.json',
                'slider_no_link_text.html'
            ],
            'video' => [
                [
                    'video' => [
                        'entity_id' => 5,
                        'css_classes' => 'primary',
                        'metric' => '{\"margin\":\"0px 0px 0px 0px\",\"padding\":\"0px 0px 0px 0px\"}',
                        'align' => 'center',
                        'video_url' => 'https://www.youtube.com',
                        'video_width' => '640px',
                        'video_height' => '480px'
                    ]
                ],
                'video.json',
                'video.html'
            ],
            'map' => [
                [
                    'map' => [
                        'entity_id' => 1,
                        'css_classes' => 'one two',
                        'metric' => '{\"margin\":\"0px 0px 0px 0px\",\"padding\":\"0px 0px 0px 0px\"}',
                        'align' => 'center',
                        'map' => '50.821392, -0.139439, 8',
                        'map_height' => '300px',
                        'map_width' => '300px'
                    ]
                ],
                'map.json',
                'map.html'
            ],
            'custom' => [
                [],
                'custom.json',
                'custom.html'
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
