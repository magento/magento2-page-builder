<?php

namespace Gene\BlueFoot\Model\ResourceModel\Setup;

/**
 * Class PropertyMapper
 *
 * @package Gene\BlueFoot\Model\ResourceModel\Setup
 *
 * @author Dave Macaulay <dave@gene.co.uk>
 */
class PropertyMapper extends \Magento\Eav\Model\Entity\Setup\PropertyMapperAbstract
{
    /**
     * Map input attribute properties to storage representation
     *
     * @param array $input
     * @param int $entityTypeId
     * @return array
     * @SuppressWarnings(PHPMD.UnusedFormalParameter)
     */
    public function map(array $input, $entityTypeId)
    {
        return [
            'backend_model' => $this->_getValue($input, 'backend_model'),
            'backend_type' => $this->_getValue($input, 'backend_type', 'varchar'),
            'backend_table' => $this->_getValue($input, 'backend_table'),
            'frontend_model' => $this->_getValue($input, 'frontend_model'),
            'frontend_input' => $this->_getValue($input, 'frontend_input', 'text'),
            'frontend_label' => $this->_getValue($input, 'frontend_label'),
            'frontend_class' => $this->_getValue($input, 'frontend_class'),
            'source_model' => $this->_getValue($input, 'source_model'),
            'is_required' => $this->_getValue($input, 'is_required', 1),
            'is_user_defined' => $this->_getValue($input, 'is_user_defined', 0),
            'default_value' => $this->_getValue($input, 'default_value'),
            'is_unique' => $this->_getValue($input, 'is_unique', 0),
            'note' => $this->_getValue($input, 'note'),
            'is_global' => $this->_getValue(
                $input,
                'global',
                \Magento\Eav\Model\Entity\Attribute\ScopedAttributeInterface::SCOPE_GLOBAL
            ),

            /* Additional BlueFoot eav attribute table */
            'content_scope' => $this->_getValue($input, 'content_scope'),
            'frontend_input_renderer' => $this->_getValue($input, 'frontend_input_renderer'),
            'widget' => $this->_getValue($input, 'widget'),
            'data_model' => $this->_getValue($input, 'data_model'),
            'template' => $this->_getValue($input, 'template'),
            'list_template' => $this->_getValue($input, 'list_template'),
            'additional_data' => $this->_getValue($input, 'additional_data')
        ];
    }
}
