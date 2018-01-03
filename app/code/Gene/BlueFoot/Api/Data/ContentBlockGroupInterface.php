<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */
namespace Gene\BlueFoot\Api\Data;

/**
 * Interface ContentBlockGroupInterface
 */
interface ContentBlockGroupInterface
{
    const GROUP_ID = 'group_id';
    const CODE = 'code';
    const NAME = 'name';
    const ICON = 'icon';
    const SORT_ORDER = 'sort_order';
    const CACHE_TAG = 'gene_bluefoot_entity_type_group';

    /**
     * Get ID
     *
     * @return int|null
     */
    public function getId();

    /**
     * Get the code
     *
     * @return string|null;
     */
    public function getCode();

    /**
     * Get the name
     *
     * @return string|null;
     */
    public function getName();

    /**
     * Get the icon
     *
     * @return string|null;
     */
    public function getIcon();

    /**
     * Retrieve the sort order
     *
     * @return mixed
     */
    public function getSortOrder();

    /**
     * Set ID
     *
     * @param int $id
     * @return \Gene\BlueFoot\Api\Data\ContentBlockGroupInterface
     */
    public function setId($id);

    /**
     * Set the group code
     *
     * @param $code
     *
     * @return \Gene\BlueFoot\Api\Data\ContentBlockGroupInterface
     */
    public function setCode($code);

    /**
     * Set group name
     *
     * @param $name
     *
     * @return \Gene\BlueFoot\Api\Data\ContentBlockGroupInterface
     */
    public function setName($name);

    /**
     * Set group icon
     *
     * @param $icon
     *
     * @return \Gene\BlueFoot\Api\Data\ContentBlockGroupInterface
     */
    public function setIcon($icon);

    /**
     * Set the sort order
     *
     * @param $sort
     *
     * @return mixed
     */
    public function setSortOrder($sort);
}
