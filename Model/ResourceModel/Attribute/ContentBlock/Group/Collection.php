<?php

namespace Gene\BlueFoot\Model\ResourceModel\Attribute\ContentBlock\Group;

/**
 * Class Collection
 *
 * @package Gene\BlueFoot\Model\ResourceModel\Attribute\ContentBlock\Group
 *
 * @author Dave Macaulay <dave@gene.co.uk>
 */
class Collection extends \Magento\Framework\Model\ResourceModel\Db\Collection\AbstractCollection
{
    /**
     * Constructor
     */
    protected function _construct()
    {
        $this->_init('Gene\BlueFoot\Model\Attribute\ContentBlock\Group','Gene\BlueFoot\Model\ResourceModel\Attribute\ContentBlock\Group');
    }

    /**
     * Convert the collection into an option hash
     *
     * @return array
     */
    public function toOptionHash()
    {
        return $this->_toOptionHash('group_id', 'name');
    }

    /**
     * Return the data in an array suitable for the page builder
     *
     * @return array
     */
    public function toPageBuilderArray()
    {
        $array = [];

        foreach ($this->getItems() as $item) {
            $array[$item->getId()] = [
                'icon' => $item->getIcon(),
                'name' => $item->getName(),
                'sort' => $item->getSortOrder()
            ];
        }

        return $array;
    }
}