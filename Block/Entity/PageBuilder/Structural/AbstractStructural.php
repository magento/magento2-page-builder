<?php

namespace Gene\BlueFoot\Block\Entity\PageBuilder\Structural;

/**
 * Class Base
 *
 * @package Gene\BlueFoot\Block\Entity\PageBuilder\Structural
 *
 * @author Dave Macaulay <dave@gene.co.uk>
 */
class AbstractStructural extends \Magento\Framework\View\Element\Template
{

    const GENE_BLUEFOOT_MEDIA_DIRECTORY = 'pub/media/gene-cms';

    /**
     * Return the form data
     *
     * @param $key
     *
     * @return mixed|null
     */
    public function getFormData($key)
    {
        if(!$key) {
            return $this->getData('form_data');
        } else {
            $formData = $this->getData('form_data');
            if(isset($formData[$key])) {
                return $formData[$key];
            }
        }

        return null;
    }

    /**
     * Function to return css classes as a well formatted string
     * @return string
     */
    public function getCssAttributes()
    {
        $html = 'bluefoot-entity';

        // Add Align class
        $align = '';
        if ($align = $this->getFormData('align')) {
            $align = 'bluefoot-align-' . $align;
        }

        // Build and array of classes from the entity, the block and the alignment
        $classes = $this->parseCss($this->getCssClasses() . ' ' . $align . ' ' . $this->getFormData('css_classes'));

        if (!empty($classes)) {

            // Loop through all the classes
            foreach($classes as $class) {
                $html .= ' ' . $class;
            }
        }
        return $html;
    }


    /**
     * Convert classes to an array with only unique values
     * @param bool|false $string
     * @return array
     */
    public function parseCss($string = false)
    {
        $array = array();
        if($string) {
            $array = explode(' ', trim($string));
        }
        return array_unique(array_filter($array));
    }


    /**
     * Function to build up the style attributes of a block
     * @return string
     */
    public function getStyleAttributes()
    {
        if ($this->getStyles() || $this->parseMetrics() || $this->getBackgroundStyles()) {
            $html = ' style="';
            $html .= $this->getStyles() . $this->parseMetrics() . $this->getBackgroundStyles();
            $html .= '"';
            return $html;
        }
        return '';
    }

    /**
     * Array of directions, used for the metrics
     * @var array
     */
    protected $_order = array('top', 'right', 'bottom', 'left');


    /**
     * Function to return the metrics as a useful string
     * @return string
     */
    public function parseMetrics()
    {
        $html = '';
        if($this->getFormData('metric')) {

            foreach(json_decode($this->getFormData('metric'), true) as $key => $string) {

                $values = explode(' ', $string);

                // Loop through all metrics and add any with values
                $i = 0; foreach ($values as $value) {
                    if ($value != '-') {
                        $html .= $key . '-' . $this->_order[$i] . ':' . $value . ';';
                    }
                    $i++;
                }
            }
        }
        return $html;
    }


    /**
     * Set the style if a background color or image has been set
     * @return string
     */
    public function getBackgroundStyles()
    {

        $style = '';

        if ($image = $this->getUrl(self::GENE_BLUEFOOT_MEDIA_DIRECTORY . $this->getFormData('background_image'))) {
            $style .= 'background-image:url(' . $image . ');';
        }
        if ($color = $this->getFormData('background_color')) {
            $style .= 'background-color:#' . $color . ';';
        }

        return $style;

    }

}