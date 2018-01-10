<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */
namespace Gene\BlueFoot\Setup\DataConverter;

/**
 * Extract styles from an object of form data to be used in the new mark up
 */
interface StyleExtractorInterface
{
    /**
     * Extract style and transform to string
     *
     * Given a map of style attributes from BlueFoot data object, we will convert specific attributes to PageBuilder
     * master format and output as an injectable string.
     *
     * @param array $formData
     * @return string
     */
    public function extractStyle(array $formData);
}
