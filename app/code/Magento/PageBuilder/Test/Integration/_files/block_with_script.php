<?php
/**
 * Copyright 2018 Adobe
 * All Rights Reserved.
 */

/** @var $block \Magento\Cms\Model\Block */
$block = \Magento\TestFramework\Helper\Bootstrap::getObjectManager()->create(\Magento\Cms\Model\Block::class);
$block->setTitle(
    'CMS Block Title'
)->setIdentifier(
    'block_with_script'
)->setContent(
    '<h1>Fixture Block Title</h1>
<a href="{{store url=""}}">store url</a>
<p>Config value: "{{config path="web/unsecure/base_url"}}".</p>
<p>Custom variable: "{{customvar code="variable_code"}}".</p>
<script type="text/x-magento-init">alert("test")</script>
'
)->setIsActive(
    1
)->setStores(
    [
        \Magento\TestFramework\Helper\Bootstrap::getObjectManager()->get(
            \Magento\Store\Model\StoreManagerInterface::class
        )->getStore()->getId()
    ]
)->save();
