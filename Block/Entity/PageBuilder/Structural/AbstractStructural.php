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

}