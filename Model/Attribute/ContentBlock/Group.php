<?php

namespace Gene\BlueFoot\Model\Attribute\ContentBlock;

/**
 * Class Group
 *
 * @package Gene\BlueFoot\Model\ResourceModel\Attribute\ContentBlock
 *
 * @author Dave Macaulay <dave@gene.co.uk>
 */
class Group extends \Magento\Framework\Model\AbstractModel implements GroupInterface, \Magento\Framework\DataObject\IdentityInterface
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

}