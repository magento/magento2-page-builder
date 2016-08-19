<?php

namespace Gene\BlueFoot\Block\Entity\PageBuilder\Structural;

/**
 * Class Base
 *
 * @package Gene\BlueFoot\Block\Entity\PageBuilder\Structural
 *
 * @author  Dave Macaulay <dave@gene.co.uk>
 */
class AbstractStructural extends \Magento\Framework\View\Element\Template
{
    /**
     * Array of directions, used for the metrics
     *
     * @var array
     */
    protected $order = array('top', 'right', 'bottom', 'left');

    const GENE_BLUEFOOT_MEDIA_DIRECTORY = '/gene-cms';

    /**
     * Return the form data
     *
     * @param $key
     *
     * @return mixed|null
     */
    public function getFormData($key)
    {
        if (!$key) {
            return $this->getData('form_data');
        } else {
            $formData = $this->getData('form_data');
            if (isset($formData[$key])) {
                return $formData[$key];
            }
        }

        return null;
    }

    /**
     * Function to return css classes as a well formatted string
     *
     * @return string
     */
    public function getCssAttributes()
    {
        $html = 'bluefoot-structural';

        // Add Align class
        $align = '';
        if ($this->getFormData('align')) {
            $align = 'bluefoot-align-' . $this->getFormData('align');
        }

        // Build and array of classes from the entity, the block and the alignment
        $classes = $this->parseCss($this->getCssClasses() . ' ' . $align . ' ' . $this->getFormData('css_classes'));

        if (!empty($classes)) {
            // Loop through all the classes
            foreach ($classes as $class) {
                $html .= ' ' . $class;
            }
        }

        return $html;
    }


    /**
     * Convert classes to an array with only unique values
     *
     * @param bool|false $string
     *
     * @return array
     */
    public function parseCss($string = false)
    {
        $array = array();
        if ($string) {
            $array = explode(' ', trim($string));
        }

        return array_unique(array_filter($array));
    }

    /**
     * Function to build up the style attributes of a block
     *
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
     * Function to return the metrics as a useful string
     *
     * @return string
     */
    public function parseMetrics()
    {
        $html = '';
        if ($this->getEntity() && $this->getEntity()->getMetric()) {
            $json = json_decode($this->getEntity()->getMetric(), true);
            if ($json) {
                foreach ($json as $key => $string) {
                    $values = explode(' ', $string);

                    // Loop through all metrics and add any with values
                    $i = 0;
                    foreach ($values as $value) {
                        if ($value != '-') {
                            $html .= $key . '-' . $this->order[$i] . ':' . $value . ';';
                        }
                        $i++;
                    }
                }
            }
        }

        return $html;
    }

    /**
     * Set the style if a background color or image has been set
     *
     * @return string
     */
    public function getBackgroundStyles()
    {
        $style = '';

        if ($this->getFormData('background_image')) {
            $image = $this->_storeManager->getStore()->getBaseUrl(\Magento\Framework\UrlInterface::URL_TYPE_MEDIA) .
                self::GENE_BLUEFOOT_MEDIA_DIRECTORY . $this->getFormData('background_image');
            $style .= 'background-image:url(' . $image . ');';
        }
        if ($color = $this->getFormData('background_color')) {
            $style .= 'background-color:#' . $color . ';';
        }

        return $style;
    }
}
