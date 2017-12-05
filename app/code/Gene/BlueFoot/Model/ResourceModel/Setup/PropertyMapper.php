<?php

namespace Gene\BlueFoot\Model\ResourceModel\Setup;

/**
 * Class PropertyMapper
 *
 * @package Gene\BlueFoot\Model\ResourceModel\Setup
 *
 * @author  Dave Macaulay <dave@gene.co.uk>
 */
class PropertyMapper extends \Magento\Eav\Model\Entity\Setup\PropertyMapperAbstract
{
    /**
     * Map input attribute properties to storage representation
     *
     * @param array $input
     * @param int   $entityTypeId
     *
     * @return array
     */
    public function map(array $input, $entityTypeId)
    {
        return [
            /* Additional BlueFoot eav attribute table */
            'content_scope'           => $this->_getValue($input, 'content_scope'),
            'frontend_input_renderer' => $this->_getValue($input, 'frontend_input_renderer'),
            'is_wysiwyg_enabled'      => $this->_getValue($input, 'is_wysiwyg_enabled'),
            'widget'                  => $this->_getValue($input, 'widget'),
            'data_model'              => $this->_getValue($input, 'data'),
            'template'                => $this->_getValue($input, 'template'),
            'list_template'           => $this->_getValue($input, 'list_template'),
            'additional_data'         => $this->_getValue($input, 'additional_data')
        ];
    }
}
