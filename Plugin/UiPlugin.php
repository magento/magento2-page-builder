<?php

namespace Gene\BlueFoot\Plugin;

/**
 * Class UiPlugin
 * @package Gene\BlueFoot\Plugin
 * @author Aidan Threadgold <aidan@gene.co.uk>
 */
class UiPlugin
{
    /**
     * Inject our UI fields into the array built from the core xml
     * @param $subject
     * @param $output
     * @return mixed
     */
    public function afterConvert($subject, $output)
    {
        // @todo generate these from XML
        $output['components'][0]['child_entity'] = $this->buildArray([
            'class' => 'Gene\BlueFoot\Ui\Component\Form\Element\DataType\ChildEntity',
            'jsComponent' => 'Gene_BlueFoot/js/form/element/child_entity',
            'elementTmpl' => 'Gene_BlueFoot/form/element/child_entity',
        ]);

        $output['components'][0]['search'] = $this->buildArray([
            'class' => 'Gene\BlueFoot\Ui\Component\Form\Element\DataType\Search',
            'jsComponent' => 'Gene_BlueFoot/js/form/element/search',
            'elementTmpl' => 'Gene_BlueFoot/form/element/search',
        ]);

        $output['components'][0]['alignment'] = $this->buildArray([
            'class' => 'Gene\BlueFoot\Ui\Component\Form\Element\DataType\Alignment',
            'jsComponent' => 'Gene_BlueFoot/js/form/element/alignment',
            'elementTmpl' => 'Gene_BlueFoot/form/element/alignment',
        ]);

        $output['components'][0]['uploader'] = $this->buildArray([
            'class' => 'Gene\BlueFoot\Ui\Component\Form\Element\DataType\Uploader',
            'jsComponent' => 'Gene_BlueFoot/js/form/element/uploader',
            'elementTmpl' => 'Gene_BlueFoot/form/element/uploader',
        ]);

        return $output;
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