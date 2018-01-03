<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */
namespace Gene\BlueFoot\Api\Data;

/**
 * Interface EntityInterface
 */
interface EntityInterface
{
    /**
     * Return the entity name
     */
    const ENTITY = 'gene_bluefoot_entity';

    /**
     * Return the cache tag
     */
    const CACHE_TAG = 'gene_bluefoot_entity';

    /**
     * Get ID
     *
     * @return int|null
     */
    public function getId();

    /**
     * Return the front-end for the entity
     *
     * @return mixed
     */
    public function getFrontend();

    /**
     * Get the associated content block
     *
     * @return mixed
     */
    public function getContentBlock();

    /**
     * Set ID
     *
     * @param int $id
     * @return \Gene\BlueFoot\Api\Data\EntityInterface
     */
    public function setId($id);
}
