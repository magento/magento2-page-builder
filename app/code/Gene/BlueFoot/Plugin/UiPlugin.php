<?php

namespace Gene\BlueFoot\Plugin;

/**
 * Class UiPlugin
 *
 * @package Gene\BlueFoot\Plugin
 *
 * @author Aidan Threadgold <aidan@gene.co.uk>
 */
class UiPlugin
{
    /**
     * @var \Magento\Framework\Event\ManagerInterface
     */
    protected $eventDispatcher;

    /**
     * @var \Magento\Framework\DataObject
     */
    protected $dataObject;

    /**
     * UiPlugin constructor.
     *
     * @param \Magento\Framework\Event\ManagerInterface $eventDispatcher
     */
    public function __construct(
        \Magento\Framework\Event\ManagerInterface $eventDispatcher,
        \Magento\Framework\DataObject $dataObject
    ) {
        $this->eventDispatcher = $eventDispatcher;
        $this->dataObject = $dataObject;
    }

    /**
     * Inject our UI fields into the array built from the core xml
     *
     * @param $subject
     * @param $output
     * @return mixed
     */
    public function afterConvert($subject, $output)
    {
        $this->addComponent('child_entity', [
            'class' => 'Gene\BlueFoot\Ui\Component\Form\Element\DataType\ChildEntity',
            'jsComponent' => 'Gene_BlueFoot/js/form/element/child_entity',
            'elementTmpl' => 'Gene_BlueFoot/form/element/child_entity',
        ], $output);

        $this->addComponent('redactor', [
            'class' => 'Gene\BlueFoot\Ui\Component\Form\Element\DataType\Redactor',
            'jsComponent' => 'Gene_BlueFoot/js/form/element/redactor',
            'elementTmpl' => 'Gene_BlueFoot/form/element/redactor',
        ], $output);

        $this->addComponent('search', [
            'class' => 'Gene\BlueFoot\Ui\Component\Form\Element\DataType\Search',
            'jsComponent' => 'Gene_BlueFoot/js/form/element/search',
            'elementTmpl' => 'Gene_BlueFoot/form/element/search',
        ], $output);

        $this->addComponent('uploader', [
            'class' => 'Gene\BlueFoot\Ui\Component\Form\Element\DataType\Uploader',
            'jsComponent' => 'Gene_BlueFoot/js/form/element/uploader',
            'elementTmpl' => 'Gene_BlueFoot/form/element/uploader',
        ], $output);

        $this->addComponent('magentowidget', [
            'class' => 'Gene\BlueFoot\Ui\Component\Form\Element\DataType\MagentoWidget',
            'jsComponent' => 'Gene_BlueFoot/js/form/element/magentowidget',
            'elementTmpl' => 'Gene_BlueFoot/form/element/magentowidget',
        ], $output);

        $this->addComponent('map', [
            'class' => 'Gene\BlueFoot\Ui\Component\Form\Element\DataType\Map',
            'jsComponent' => 'Gene_BlueFoot/js/form/element/map',
            'elementTmpl' => 'Gene_BlueFoot/form/element/map',
        ], $output);

        $this->addComponent('design_option', [
            'class' => 'Gene\BlueFoot\Ui\Component\Form\Element\DataType\DesignOption',
            'jsComponent' => 'Gene_BlueFoot/js/form/element/design_option',
            'elementTmpl' => 'Gene_BlueFoot/form/element/design_option',
        ], $output);

        $this->addComponent('align', [
            'class' => 'Gene\BlueFoot\Ui\Component\Form\Element\DataType\Align',
            'jsComponent' => 'Gene_BlueFoot/js/form/element/align',
            'elementTmpl' => 'Gene_BlueFoot/form/element/align',
        ], $output);

        $this->addComponent('color', [
            'class' => 'Gene\BlueFoot\Ui\Component\Form\Element\DataType\Color',
            'jsComponent' => 'Gene_BlueFoot/js/form/element/color',
            'elementTmpl' => 'Gene_BlueFoot/form/element/color',
        ], $output);

        $this->addComponent('tags', [
            'class' => 'Gene\BlueFoot\Ui\Component\Form\Element\DataType\Tags',
            'jsComponent' => 'Gene_BlueFoot/js/form/element/tags',
            'elementTmpl' => 'Gene_BlueFoot/form/element/tags',
        ], $output);

        $this->addComponent('video', [
            'class' => 'Gene\BlueFoot\Ui\Component\Form\Element\DataType\Video',
            'jsComponent' => 'Gene_BlueFoot/js/form/element/video',
            'elementTmpl' => 'Gene_BlueFoot/form/element/video',
        ], $output);

        // Pass the output over to an event for custom UI components
        $outputObject = $this->dataObject->setData('output', $output);
        $this->eventDispatcher->dispatch('gene_bluefoot_add_ui_component', [
            'plugin' => $this,
            'output' => $outputObject
        ]);
        $output = $outputObject->getData('output');

        return $output;
    }

    /**
     * Add in a new component to the output
     *
     * @param $name
     * @param $data
     * @param $output
     */
    public function addComponent($name, $data, &$output)
    {
        $output['components'][0][$name] = $this->buildArray($data);
    }

    /**
     * @param array $data
     * @return array
     */
    private function buildArray(array $data)
    {
        return [
            0 => [
                '@arguments' => [
                    'data' => [
                        'name' => 'data',
                        'xsi:type' => 'array',
                        'item' => [
                            'config' => [
                                'name' => 'js_config',
                                'xsi:type' => 'array',
                                'item' => [
                                    // JS 'component' to use (eg Gene_BlueFoot/js/form/element/child_entity)
                                    'component' => [
                                        'name' => 'component',
                                        'xsi:type' => 'string',
                                        'value' => $data['jsComponent']
                                    ],

                                    'template' => [
                                        'name' => 'template',
                                        'xsi:type' => 'string',
                                        'value' => 'ui/form/field'
                                    ],

                                    // html template (eg Gene_BlueFoot/form/element/child_entity)
                                    'elementTmpl' => [
                                        'name' => 'elementTmpl',
                                        'xsi:type' => 'string',
                                        'value' => $data['elementTmpl']
                                    ]
                                ]
                            ]
                        ]
                    ]
                ],
                '@attributes' => [
                    'class' => $data['class']
                ]
            ]
        ];
    }
}
