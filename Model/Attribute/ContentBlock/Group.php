<?php

namespace Gene\BlueFoot\Model\Attribute\ContentBlock;

use Gene\BlueFoot\Api\Data\ContentBlockGroupInterface;

/**
 * Class Group
 *
 * @package Gene\BlueFoot\Model\ResourceModel\Attribute\ContentBlock
 *
 * @author Dave Macaulay <dave@gene.co.uk>
 */
class Group extends \Magento\Framework\Model\AbstractModel implements ContentBlockGroupInterface, \Magento\Framework\DataObject\IdentityInterface
{
    /**
     * The cache tag to ensure this model gets cached effectively
     */
    const CACHE_TAG = 'gene_bluefoot_entity_type_group';

    /**
     * Define resource model
     */
    protected function _construct()
    {
        $this->_init('Gene\BlueFoot\Model\ResourceModel\Attribute\ContentBlock\Group');
    }

    /**
     * Return the identities associated with the model
     *
     * @return array
     */
    public function getIdentities()
    {
        return [self::CACHE_TAG . '_' . $this->getId()];
    }

    /**
     * Get ID
     *
     * @return int
     */
    public function getId()
    {
        return parent::getData(self::GROUP_ID);
    }

    /**
     * Alias the ID
     *
     * @return int
     */
    public function getGroupId()
    {
        return $this->getId();
    }

    /**
     * Get the name
     *
     * @return mixed
     */
    public function getName()
    {
        return $this->getData(self::NAME);
    }

    /**
     * Get the code
     *
     * @return mixed
     */
    public function getCode()
    {
        return $this->getData(self::CODE);
    }

    /**
     * Get the icon
     *
     * @return mixed
     */
    public function getIcon()
    {
        return $this->getData(self::ICON);
    }

    /**
     * Retrieve the sort order
     *
     * @return mixed
     */
    public function getSortOrder()
    {
        return $this->getData(self::SORT_ORDER);
    }

    /**
     * Set the ID
     *
     * @param int|mixed $id
     *
     * @return $this
     */
    public function setId($id)
    {
        return $this->setData(self::GROUP_ID, $id);
    }

    /**
     * Set the group ID
     *
     * @param $id
     *
     * @return \Gene\BlueFoot\Model\Attribute\ContentBlock\Group
     */
    public function setGroupId($id)
    {
        return $this->setId($id);
    }

    /**
     * Set the name
     *
     * @param $name
     *
     * @return $this
     */
    public function setName($name)
    {
        return $this->setData(self::NAME, $name);
    }

    /**
     * Set the code
     *
     * @param $code
     *
     * @return $this
     */
    public function setCode($code)
    {
        return $this->setData(self::CODE, $code);
    }

    /**
     * Set the icon
     *
     * @param $icon
     *
     * @return $this
     */
    public function setIcon($icon)
    {
        return $this->setData(self::ICON, $icon);
    }

    /**
     * Set the sort order
     *
     * @param $sort
     *
     * @return $this
     */
    public function setSortOrder($sort)
    {
        return $this->setData(self::SORT_ORDER, $sort);
    }
}