<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */
declare(strict_types=1);

namespace Magento\PageBuilder\Setup\DataConverter;

/**
 * Extract styles from an object of form data to be used in the new mark up
 *
 * @api
 */
interface StyleExtractorInterface
{
    /**
     * Extract style and transform to string
     *
     * Given a map of style attributes from PageBuilder data object, we will convert specific attributes to PageBuilder
     * master format and output as an injectable string.
     *
     * @param array $formData
     * @param array $stylesToExtract
     * @return string
     */
    public function extractStyle(array $formData, array $stylesToExtract = []) : string;
}
