<?php

namespace Gene\BlueFoot\Block\Entity\PageBuilder\Block;

/**
 * Class Gene\BlueFoot\Block\Entity\PageBuilder\Block\Newsletter
 *
 * @author Hob Adams <hob@gene.co.uk>
 */
class Newsletter extends \Magento\Newsletter\Block\Subscribe
{
    /**
     * Array of directions, used for the metrics
     *
     * @var array
     */
    protected $order = array('top', 'right', 'bottom', 'left');

    /**
     * Redeclared abstract function due to extension
     *
     * @return mixed
     */
    public function getEntity()
    {
        return $this->getData('entity');
    }

    /**
     * Function to return css classes as a well formatted string
     *
     * @return string
     */
    public function getCssAttributes()
    {
        $html = 'bluefoot-entity';

        // Add Align class
        $align = '';
        if ($this->getEntity()->getAlign()) {
            $align = 'bluefoot-align-' . $this->getEntity()->getAlign();
        }

        // Build and array of classes from the entity, the block and the alignment
        $classes = $this->parseCss($this->getCssClasses() . ' ' . $align . ' ' . $this->getEntity()->getCssClasses());

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
        if ($this->getStyles() || $this->parseMetrics()) {
            $html = ' style="';
            $html .= $this->getStyles() . $this->parseMetrics();
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
}
