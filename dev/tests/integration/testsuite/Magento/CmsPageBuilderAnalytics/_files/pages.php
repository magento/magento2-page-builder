<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

// @codingStandardsIgnoreStart
$content = <<<CONTENT
<div data-content-type="row" data-appearance="contained" data-element="main">
  <div data-enable-parallax="0" data-parallax-speed="0.5" data-background-images="{}" data-element="inner" style="justify-content: flex-start; display: flex; flex-direction: column; background-position: left top; background-size: cover; background-repeat: no-repeat; background-attachment: scroll; border-style: none; border-width: 1px; border-radius: 0px; margin: 0px 0px 10px; padding: 10px;">
    <div data-content-type="block" data-appearance="default" data-element="main" style="border-style: none; border-width: 1px; border-radius: 0px; margin: 0px; padding: 0px;">{{widget type="MagentoCmsBlockWidgetBlock" template="widget/static_block/default.phtml" block_id="10" type_name="CMS Static Block"}}</div>
  </div>
</div>
<div data-content-type="row" data-appearance="contained" data-element="main">
  <div data-enable-parallax="0" data-parallax-speed="0.5" data-background-images="{}" data-element="inner" style="justify-content: flex-start; display: flex; flex-direction: column; background-position: left top; background-size: cover; background-repeat: no-repeat; background-attachment: scroll; border-style: none; border-width: 1px; border-radius: 0px; margin: 0px 0px 10px; padding: 10px;">
    <div class="pagebuilder-slider" data-content-type="slider" data-appearance="default" data-autoplay="false" data-autoplay-speed="4000" data-fade="false" data-infinite-loop="false" data-show-arrows="false" data-show-dots="true" data-element="main" style="min-height: 300px; border-style: none; border-width: 1px; border-radius: 0px; margin: 0px; padding: 0px;">
      <div data-content-type="slide" data-slide-name="Red" data-appearance="poster" data-show-button="hover" data-show-overlay="always" data-element="main" style="margin: 1px 2px 3px 4px;">
        <a href="http://google.com/" target="" data-link-type="default" data-element="link">
          <div class="pagebuilder-slide-wrapper" data-background-images="{}" data-element="wrapper" style="background-color: rgb(35, 255, 9); background-position: right top; background-size: cover; background-repeat: no-repeat; border-style: dashed; border-color: rgb(255, 0, 0); border-width: 15px; border-radius: 2px; text-align: center; min-height: 200px;">
            <div class="pagebuilder-overlay pagebuilder-poster-overlay" data-overlay-color="#008000" data-element="overlay" style="min-height: 200px; padding: 5px 6px 7px 8px; background-color: rgb(0, 128, 0);">
              <div class="pagebuilder-poster-content">
                <div data-element="content">
                  <p>Here's some testing text</p>
                </div>
                <button type="button" class="pagebuilder-slide-button pagebuilder-button-secondary" data-element="button" style="opacity: 0; visibility: hidden;">Testing</button>
              </div>
            </div>
          </div>
        </a>
      </div>
      <div data-content-type="slide" data-slide-name="Red" data-appearance="collage-left" data-show-button="hover" data-show-overlay="always" data-element="main" style="min-height: 200px; margin: 1px 2px 3px 4px;">
        <a href="http://google.com/" target="" data-link-type="default" data-element="link">
          <div class="pagebuilder-slide-wrapper" data-background-images="{}" data-element="wrapper" style="background-color: rgb(35, 255, 9); background-position: right top; background-size: cover; background-repeat: no-repeat; border-style: dashed; border-color: rgb(255, 0, 0); border-width: 15px; border-radius: 2px; min-height: 200px; padding: 5px 6px 7px 8px; text-align: center;">
            <div class="pagebuilder-overlay" data-overlay-color="#008000" data-element="overlay" style="background-color: rgb(0, 128, 0);">
              <div class="pagebuilder-collage-content">
                <div data-element="content">
                  <p>Here's some testing text</p>
                </div>
                <button type="button" class="pagebuilder-slide-button pagebuilder-button-secondary" data-element="button" style="opacity: 0; visibility: hidden;">Testing</button>
              </div>
            </div>
          </div>
        </a>
      </div>
      <div data-content-type="slide" data-slide-name="Red" data-appearance="collage-centered" data-show-button="hover" data-show-overlay="always" data-element="main" style="margin: 1px 2px 3px 4px;">
        <a href="http://google.com/" target="" data-link-type="default" data-element="link">
          <div class="pagebuilder-slide-wrapper" data-background-images="{}" data-element="wrapper" style="background-color: rgb(35, 255, 9); background-position: right top; background-size: cover; background-repeat: no-repeat; border-style: dashed; border-color: rgb(255, 0, 0); border-width: 15px; border-radius: 2px; min-height: 200px; padding: 5px 6px 7px 8px; text-align: center;">
            <div class="pagebuilder-overlay" data-overlay-color="#008000" data-element="overlay" style="background-color: rgb(0, 128, 0);">
              <div class="pagebuilder-collage-content">
                <div data-element="content">
                  <p>Here's some testing text</p>
                </div>
                <button type="button" class="pagebuilder-slide-button pagebuilder-button-secondary" data-element="button" style="opacity: 0; visibility: hidden;">Testing</button>
              </div>
            </div>
          </div>
        </a>
      </div>
      <div data-content-type="slide" data-slide-name="Red" data-appearance="collage-right" data-show-button="hover" data-show-overlay="always" data-element="main" style="margin: 1px 2px 3px 4px;">
        <a href="http://google.com/" target="" data-link-type="default" data-element="link">
          <div class="pagebuilder-slide-wrapper" data-background-images="{}" data-element="wrapper" style="background-color: rgb(35, 255, 9); background-position: right top; background-size: cover; background-repeat: no-repeat; border-style: dashed; border-color: rgb(255, 0, 0); border-width: 15px; border-radius: 2px; min-height: 200px; padding: 5px 6px 7px 8px; text-align: center;">
            <div class="pagebuilder-overlay" data-overlay-color="#008000" data-element="overlay" style="background-color: rgb(0, 128, 0);">
              <div class="pagebuilder-collage-content">
                <div data-element="content">
                  <p>Here's some testing text</p>
                </div>
                <button type="button" class="pagebuilder-slide-button pagebuilder-button-secondary" data-element="button" style="opacity: 0; visibility: hidden;">Testing</button>
              </div>
            </div>
          </div>
        </a>
      </div>
    </div>
    <div class="pagebuilder-slider" data-content-type="slider" data-appearance="default" data-autoplay="true" data-autoplay-speed="4000" data-fade="false" data-infinite-loop="true" data-show-arrows="true" data-show-dots="true" data-element="main" style="text-align: center; min-height: 300px; border-style: dotted; border-color: rgb(0, 0, 255); border-width: 5px; border-radius: 5px; display: none; margin: 0px; padding: 0px;">
      <div data-content-type="slide" data-slide-name="Red" data-appearance="poster" data-show-button="hover" data-show-overlay="always" data-element="main" style="margin: 1px 2px 3px 4px;">
        <a href="http://google.com/" target="" data-link-type="default" data-element="link">
          <div class="pagebuilder-slide-wrapper" data-background-images="{}" data-element="wrapper" style="background-color: rgb(35, 255, 9); background-position: right top; background-size: cover; background-repeat: no-repeat; border-style: dashed; border-color: rgb(255, 0, 0); border-width: 15px; border-radius: 2px; text-align: center; min-height: 200px;">
            <div class="pagebuilder-overlay pagebuilder-poster-overlay" data-overlay-color="#008000" data-element="overlay" style="min-height: 200px; padding: 5px 6px 7px 8px; background-color: rgb(0, 128, 0);">
              <div class="pagebuilder-poster-content">
                <div data-element="content">
                  <p>Here's some testing text</p>
                </div>
                <button type="button" class="pagebuilder-slide-button pagebuilder-button-secondary" data-element="button" style="opacity: 0; visibility: hidden;">Testing</button>
              </div>
            </div>
          </div>
        </a>
      </div>
      <div data-content-type="slide" data-slide-name="Red" data-appearance="collage-left" data-show-button="hover" data-show-overlay="always" data-element="main" style="min-height: 200px; margin: 1px 2px 3px 4px;">
        <a href="http://google.com/" target="" data-link-type="default" data-element="link">
          <div class="pagebuilder-slide-wrapper" data-background-images="{&quot;desktop_image&quot;:&quot;{{media url=wysiwyg/AdobeStock_78698208.jpg}}&quot;}" data-element="wrapper" style="background-color: rgb(35, 255, 9); background-position: right top; background-size: cover; background-repeat: no-repeat; border-style: dashed; border-color: rgb(255, 0, 0); border-width: 15px; border-radius: 2px; min-height: 200px; padding: 5px 6px 7px 8px; text-align: center;">
            <div class="pagebuilder-overlay" data-overlay-color="#008000" data-element="overlay" style="background-color: rgb(0, 128, 0);">
              <div class="pagebuilder-collage-content">
                <div data-element="content">
                  <p>Here's some testing text</p>
                </div>
                <button type="button" class="pagebuilder-slide-button pagebuilder-button-secondary" data-element="button" style="opacity: 0; visibility: hidden;">Testing</button>
              </div>
            </div>
          </div>
        </a>
      </div>
      <div data-content-type="slide" data-slide-name="Red" data-appearance="collage-centered" data-show-button="hover" data-show-overlay="always" data-element="main" style="margin: 1px 2px 3px 4px;">
        <a href="http://google.com/" target="" data-link-type="default" data-element="link">
          <div class="pagebuilder-slide-wrapper" data-background-images="{}" data-element="wrapper" style="background-color: rgb(35, 255, 9); background-position: right top; background-size: cover; background-repeat: no-repeat; border-style: dashed; border-color: rgb(255, 0, 0); border-width: 15px; border-radius: 2px; min-height: 200px; padding: 5px 6px 7px 8px; text-align: center;">
            <div class="pagebuilder-overlay" data-overlay-color="#008000" data-element="overlay" style="background-color: rgb(0, 128, 0);">
              <div class="pagebuilder-collage-content">
                <div data-element="content">
                  <p>Here's some testing text</p>
                </div>
                <button type="button" class="pagebuilder-slide-button pagebuilder-button-secondary" data-element="button" style="opacity: 0; visibility: hidden;">Testing</button>
              </div>
            </div>
          </div>
        </a>
      </div>
      <div data-content-type="slide" data-slide-name="Red" data-appearance="collage-right" data-show-button="hover" data-show-overlay="always" data-element="main" style="margin: 1px 2px 3px 4px;">
        <a href="http://google.com/" target="" data-link-type="default" data-element="link">
          <div class="pagebuilder-slide-wrapper" data-background-images="{}" data-element="wrapper" style="background-color: rgb(35, 255, 9); background-position: right top; background-size: cover; background-repeat: no-repeat; border-style: dashed; border-color: rgb(255, 0, 0); border-width: 15px; border-radius: 2px; min-height: 200px; padding: 5px 6px 7px 8px; text-align: center;">
            <div class="pagebuilder-overlay" data-overlay-color="#008000" data-element="overlay" style="background-color: rgb(0, 128, 0);">
              <div class="pagebuilder-collage-content">
                <div data-element="content">
                  <p>Here's some testing text</p>
                </div>
                <button type="button" class="pagebuilder-slide-button pagebuilder-button-secondary" data-element="button" style="opacity: 0; visibility: hidden;">Testing</button>
              </div>
            </div>
          </div>
        </a>
      </div>
    </div>
    <div class="pagebuilder-column-group" style="display: flex;" data-content-type="column-group" data-grid-size="12" data-element="main">
      <div class="pagebuilder-column-line" data-content-type="column-line" data-element="main">
        <div class="pagebuilder-column" data-content-type="column" data-appearance="full-height" data-background-images="{}" data-element="main" style="justify-content: flex-start; display: flex; flex-direction: column; background-position: left top; background-size: cover; background-repeat: no-repeat; background-attachment: scroll; border-style: none; border-width: 1px; border-radius: 0px; width: 50%; margin: 0px; padding: 10px; align-self: stretch;">
          <div class="pagebuilder-slider" data-content-type="slider" data-appearance="default" data-autoplay="true" data-autoplay-speed="4000" data-fade="false" data-infinite-loop="true" data-show-arrows="true" data-show-dots="true" data-element="main" style="text-align: center; min-height: 300px; border-style: dotted; border-color: rgb(0, 0, 255); border-width: 5px; border-radius: 5px; margin: 0px; padding: 0px;">
            <div data-content-type="slide" data-slide-name="Red" data-appearance="poster" data-show-button="hover" data-show-overlay="always" data-element="main" style="margin: 1px 2px 3px 4px;">
              <a href="http://google.com/" target="" data-link-type="default" data-element="link">
                <div class="pagebuilder-slide-wrapper" data-background-images="{}" data-element="wrapper" style="background-color: rgb(35, 255, 9); background-position: right top; background-size: cover; background-repeat: no-repeat; border-style: dashed; border-color: rgb(255, 0, 0); border-width: 15px; border-radius: 2px; text-align: center; min-height: 200px;">
                  <div class="pagebuilder-overlay pagebuilder-poster-overlay" data-overlay-color="#008000" data-element="overlay" style="min-height: 200px; padding: 5px 6px 7px 8px; background-color: rgb(0, 128, 0);">
                    <div class="pagebuilder-poster-content">
                      <div data-element="content">
                        <p>Here's some testing text</p>
                      </div>
                      <button type="button" class="pagebuilder-slide-button pagebuilder-button-secondary" data-element="button" style="opacity: 0; visibility: hidden;">Testing</button>
                    </div>
                  </div>
                </div>
              </a>
            </div>
            <div data-content-type="slide" data-slide-name="Red" data-appearance="collage-left" data-show-button="hover" data-show-overlay="always" data-element="main" style="min-height: 200px; margin: 1px 2px 3px 4px;">
              <a href="http://google.com/" target="" data-link-type="default" data-element="link">
                <div class="pagebuilder-slide-wrapper" data-background-images="{&quot;desktop_image&quot;:&quot;{{media url=wysiwyg/AdobeStock_78698208.jpg}}&quot;}" data-element="wrapper" style="background-color: rgb(35, 255, 9); background-position: right top; background-size: cover; background-repeat: no-repeat; border-style: dashed; border-color: rgb(255, 0, 0); border-width: 15px; border-radius: 2px; min-height: 200px; padding: 5px 6px 7px 8px; text-align: center;">
                  <div class="pagebuilder-overlay" data-overlay-color="#008000" data-element="overlay" style="background-color: rgb(0, 128, 0);">
                    <div class="pagebuilder-collage-content">
                      <div data-element="content">
                        <p>Here's some testing text</p>
                      </div>
                      <button type="button" class="pagebuilder-slide-button pagebuilder-button-secondary" data-element="button" style="opacity: 0; visibility: hidden;">Testing</button>
                    </div>
                  </div>
                </div>
              </a>
            </div>
            <div data-content-type="slide" data-slide-name="Red" data-appearance="collage-centered" data-show-button="hover" data-show-overlay="always" data-element="main" style="margin: 1px 2px 3px 4px;">
              <a href="http://google.com/" target="" data-link-type="default" data-element="link">
                <div class="pagebuilder-slide-wrapper" data-background-images="{}" data-element="wrapper" style="background-color: rgb(35, 255, 9); background-position: right top; background-size: cover; background-repeat: no-repeat; border-style: dashed; border-color: rgb(255, 0, 0); border-width: 15px; border-radius: 2px; min-height: 200px; padding: 5px 6px 7px 8px; text-align: center;">
                  <div class="pagebuilder-overlay" data-overlay-color="#008000" data-element="overlay" style="background-color: rgb(0, 128, 0);">
                    <div class="pagebuilder-collage-content">
                      <div data-element="content">
                        <p>Here's some testing text</p>
                      </div>
                      <button type="button" class="pagebuilder-slide-button pagebuilder-button-secondary" data-element="button" style="opacity: 0; visibility: hidden;">Testing</button>
                    </div>
                  </div>
                </div>
              </a>
            </div>
            <div data-content-type="slide" data-slide-name="Red" data-appearance="collage-right" data-show-button="hover" data-show-overlay="always" data-element="main" style="margin: 1px 2px 3px 4px;">
              <a href="http://google.com/" target="" data-link-type="default" data-element="link">
                <div class="pagebuilder-slide-wrapper" data-background-images="{}" data-element="wrapper" style="background-color: rgb(35, 255, 9); background-position: right top; background-size: cover; background-repeat: no-repeat; border-style: dashed; border-color: rgb(255, 0, 0); border-width: 15px; border-radius: 2px; min-height: 200px; padding: 5px 6px 7px 8px; text-align: center;">
                  <div class="pagebuilder-overlay" data-overlay-color="#008000" data-element="overlay" style="background-color: rgb(0, 128, 0);">
                    <div class="pagebuilder-collage-content">
                      <div data-element="content">
                        <p>Here's some testing text</p>
                      </div>
                      <button type="button" class="pagebuilder-slide-button pagebuilder-button-secondary" data-element="button" style="opacity: 0; visibility: hidden;">Testing</button>
                    </div>
                  </div>
                </div>
              </a>
            </div>
          </div>
        </div>
        <div class="pagebuilder-column" data-content-type="column" data-appearance="full-height" data-background-images="{}" data-element="main" style="justify-content: flex-start; display: flex; flex-direction: column; background-position: left top; background-size: cover; background-repeat: no-repeat; background-attachment: scroll; border-style: none; border-width: 1px; border-radius: 0px; width: 50%; margin: 0px; padding: 10px; align-self: stretch;"></div>
      </div>
    </div>
  </div>
</div>
<div data-content-type="row" data-appearance="contained" data-element="main">
  <div data-enable-parallax="0" data-parallax-speed="0.5" data-background-images="{}" data-element="inner" style="justify-content: flex-start; display: flex; flex-direction: column; background-position: left top; background-size: cover; background-repeat: no-repeat; background-attachment: scroll; border-style: none; border-width: 1px; border-radius: 0px; margin: 0px 0px 10px; padding: 10px;">
    <div class="pagebuilder-column-group" style="display: flex;" data-content-type="column-group" data-grid-size="12" data-element="main">
      <div class="pagebuilder-column-line" data-content-type="column-line" data-element="main">
        <div class="pagebuilder-column test-class" data-content-type="column" data-appearance="full-height" data-background-images="{&quot;desktop_image&quot;:&quot;{{media url=wysiwyg/AdobeStock_78698208.jpg}}&quot;}" data-element="main" style="justify-content: center; display: flex; flex-direction: column; background-color: rgb(33, 255, 255); background-position: right center; background-size: contain; background-repeat: repeat; background-attachment: fixed; text-align: center; border-style: double; border-color: rgb(83, 83, 83); border-width: 15px; border-radius: 2px; min-height: 250px; width: 50%; margin: 0px; padding: 10px; align-self: stretch;">
          <div data-content-type="divider" data-appearance="default" data-element="main" style="text-align: center; border-style: none; border-width: 1px; border-radius: 0px; display: none; margin: 0px; padding: 10px;">
            <hr data-element="line" style="width: 80%; border-width: 15px; border-color: rgb(132, 0, 254); display: inline-block;">
          </div>
          <div data-content-type="divider" data-appearance="default" data-element="main" style="text-align: center; border-style: none; border-width: 1px; border-radius: 0px; margin: 0px; padding: 10px;">
            <hr data-element="line" style="width: 80%; border-width: 15px; border-color: rgb(132, 0, 254); display: inline-block;">
          </div>
        </div>
        <div class="pagebuilder-column" data-content-type="column" data-appearance="full-height" data-background-images="{}" data-element="main" style="justify-content: flex-start; display: flex; flex-direction: column; background-position: left top; background-size: cover; background-repeat: no-repeat; background-attachment: scroll; border-style: none; border-width: 1px; border-radius: 0px; width: 50%; margin: 0px; padding: 10px; align-self: stretch;"></div>
      </div>
    </div>
  </div>
</div>
<div data-content-type="row" data-appearance="contained" data-element="main">
  <div data-enable-parallax="0" data-parallax-speed="0.5" data-background-images="{}" data-element="inner" style="justify-content: flex-start; display: flex; flex-direction: column; background-position: left top; background-size: cover; background-repeat: no-repeat; background-attachment: scroll; border-style: none; border-width: 1px; border-radius: 0px; margin: 0px 0px 10px; padding: 10px;">
    <div class="pagebuilder-column-group" style="display: flex;" data-content-type="column-group" data-grid-size="12" data-element="main">
      <div class="pagebuilder-column-line" data-content-type="column-line" data-element="main">
        <div class="pagebuilder-column" data-content-type="column" data-appearance="full-height" data-background-images="{}" data-element="main" style="justify-content: flex-start; display: flex; flex-direction: column; background-position: left top; background-size: cover; background-repeat: no-repeat; background-attachment: scroll; border-style: none; border-width: 1px; border-radius: 0px; width: 41.6667%; margin: 0px; padding: 10px; align-self: stretch;">
          <div class="testing" data-content-type="video" data-appearance="default" data-element="main" style="text-align: left; display: none; margin: 1px 3px 4px 5px;">
            <div class="pagebuilder-video-inner" data-element="inner" style="max-width: 150px;">
              <div class="pagebuilder-video-wrapper" data-element="wrapper" style="border-style: solid; border-color: rgb(255, 0, 0); border-width: 15px; border-radius: 12px; padding: 6px 7px 8px 9px; background-color: rgb(255, 0, 0);">
                <div class="pagebuilder-video-container"><iframe frameborder="0" allowfullscreen="" src="https://www.youtube.com/embed/hmfEimZ9kM0" data-element="video"></iframe></div>
              </div>
            </div>
          </div>
        </div>
        <div class="pagebuilder-column" data-content-type="column" data-appearance="full-height" data-background-images="{}" data-element="main" style="justify-content: flex-start; display: flex; flex-direction: column; background-position: left top; background-size: cover; background-repeat: no-repeat; background-attachment: scroll; border-style: none; border-width: 1px; border-radius: 0px; width: 8.33333%; margin: 0px; padding: 10px; align-self: stretch;"></div>
        <div class="pagebuilder-column" data-content-type="column" data-appearance="full-height" data-background-images="{}" data-element="main" style="justify-content: flex-start; display: flex; flex-direction: column; background-position: left top; background-size: cover; background-repeat: no-repeat; background-attachment: scroll; border-style: none; border-width: 1px; border-radius: 0px; width: 50%; margin: 0px; padding: 10px; align-self: stretch;">
          <div class="testing" data-content-type="video" data-appearance="default" data-element="main" style="text-align: left; margin: 1px 3px 4px 5px;">
            <div class="pagebuilder-video-inner" data-element="inner" style="max-width: 250px;">
              <div class="pagebuilder-video-wrapper" data-element="wrapper" style="border-style: solid; border-color: rgb(255, 0, 0); border-width: 15px; border-radius: 12px; padding: 6px 7px 8px 9px; background-color: rgb(255, 0, 0);">
                <div class="pagebuilder-video-container"><iframe frameborder="0" allowfullscreen="" src="https://www.youtube.com/embed/hmfEimZ9kM0" data-element="video"></iframe></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
<div data-content-type="row" data-appearance="contained" data-element="main">
  <div data-enable-parallax="0" data-parallax-speed="0.5" data-background-images="{}" data-element="inner" style="justify-content: flex-start; display: flex; flex-direction: column; background-position: left top; background-size: cover; background-repeat: no-repeat; background-attachment: scroll; border-style: none; border-width: 1px; border-radius: 0px; margin: 0px 0px 10px; padding: 10px;">
    <div data-content-type="banner" data-appearance="collage-left" data-show-button="always" data-show-overlay="hover" data-element="main" style="margin: 0px;">
      <a href="http://google.com/" target="" data-link-type="default" data-element="link">
        <div class="pagebuilder-banner-wrapper" data-background-images="{&quot;desktop_image&quot;:&quot;{{media url=wysiwyg/AdobeStock_78698208.jpg}}&quot;,&quot;mobile_image&quot;:&quot;{{media url=wysiwyg/bottom-left.jpg}}&quot;}" data-element="wrapper" style="background-color: rgb(135, 135, 135); background-position: center center; background-size: contain; background-repeat: repeat; background-attachment: fixed; border-style: none; border-width: 1px; border-radius: 0px; padding: 40px; min-height: 300px; text-align: center;">
          <div class="pagebuilder-overlay" data-overlay-color="#21ffff" data-element="overlay" style="background-color: transparent;">
            <div class="pagebuilder-collage-content">
              <div data-element="content">
                <div>Testing a banner really well</div>
              </div>
              <button type="button" class="pagebuilder-banner-button pagebuilder-button-link" data-element="button" style="opacity: 1; visibility: visible;">BUTTON</button>
            </div>
          </div>
        </div>
      </a>
    </div>
    <div data-content-type="banner" data-appearance="poster" data-show-button="always" data-show-overlay="hover" data-element="main" style="margin: 0px;">
      <a href="http://google.com/" target="" data-link-type="default" data-element="link">
        <div class="pagebuilder-banner-wrapper" data-background-images="{&quot;desktop_image&quot;:&quot;{{media url=wysiwyg/AdobeStock_78698208.jpg}}&quot;,&quot;mobile_image&quot;:&quot;{{media url=wysiwyg/bottom-left.jpg}}&quot;}" data-element="wrapper" style="background-color: rgb(135, 135, 135); background-position: center center; background-size: contain; background-repeat: repeat; background-attachment: fixed; border-style: none; border-width: 1px; border-radius: 0px; text-align: center;">
          <div class="pagebuilder-overlay pagebuilder-poster-overlay" data-overlay-color="#21ffff" data-element="overlay" style="border-radius: 0px; min-height: 300px; background-color: transparent; padding: 40px;">
            <div class="pagebuilder-poster-content">
              <div data-element="content">
                <div>
                  <div>Testing a banner really well</div>
                </div>
              </div>
              <button type="button" class="pagebuilder-banner-button pagebuilder-button-link" data-element="button" style="opacity: 1; visibility: visible;">BUTTON</button>
            </div>
          </div>
        </div>
      </a>
    </div>
    <div data-content-type="banner" data-appearance="collage-right" data-show-button="always" data-show-overlay="hover" data-element="main" style="margin: 0px;">
      <a href="http://google.com/" target="" data-link-type="default" data-element="link">
        <div class="pagebuilder-banner-wrapper" data-background-images="{&quot;desktop_image&quot;:&quot;{{media url=wysiwyg/AdobeStock_78698208.jpg}}&quot;,&quot;mobile_image&quot;:&quot;{{media url=wysiwyg/bottom-left.jpg}}&quot;}" data-element="wrapper" style="background-color: rgb(135, 135, 135); background-position: center center; background-size: contain; background-repeat: repeat; background-attachment: fixed; border-style: none; border-width: 1px; border-radius: 0px; padding: 40px; min-height: 300px; text-align: center;">
          <div class="pagebuilder-overlay" data-overlay-color="#21ffff" data-element="overlay" style="background-color: transparent;">
            <div class="pagebuilder-collage-content">
              <div data-element="content">
                <div>Testing a banner really well</div>
              </div>
              <button type="button" class="pagebuilder-banner-button pagebuilder-button-link" data-element="button" style="opacity: 1; visibility: visible;">BUTTON</button>
            </div>
          </div>
        </div>
      </a>
    </div>
    <div data-content-type="banner" data-appearance="collage-centered" data-show-button="hover" data-show-overlay="always" data-element="main" style="margin: 1px 2px 3px 4px;">
      <a href="http://google.com/" target="_blank" data-link-type="default" data-element="link">
        <div class="pagebuilder-banner-wrapper" data-background-images="{&quot;mobile_image&quot;:&quot;{{media url=wysiwyg/bottom-left.jpg}}&quot;}" data-element="wrapper" style="background-color: rgb(0, 0, 254); background-position: right top; background-size: auto; background-repeat: no-repeat; background-attachment: fixed; border-style: dashed; border-color: rgb(83, 83, 83); border-width: 15px; border-radius: 15px; padding: 5px 6px 7px 9px; min-height: 300px; text-align: left;">
          <div class="pagebuilder-overlay" data-overlay-color="#21ffff" data-element="overlay" style="background-color: rgb(33, 255, 255);">
            <div class="pagebuilder-collage-content">
              <div data-element="content">
                <div>Testing a banner really well, yeah</div>
              </div>
              <button type="button" class="pagebuilder-banner-button pagebuilder-button-secondary" data-element="button" style="opacity: 0; visibility: hidden;">BUTTON</button>
            </div>
          </div>
        </div>
      </a>
    </div>
  </div>
</div>
<div class="testing-class" data-content-type="row" data-appearance="full-width" data-enable-parallax="0" data-parallax-speed="0.5" data-background-images="{&quot;desktop_image&quot;:&quot;{{media url=wysiwyg/bottom-left.jpg}}&quot;,&quot;mobile_image&quot;:&quot;{{media url=wysiwyg/AdobeStock_78698208_1.jpg}}&quot;}" data-element="main" style="justify-content: center; display: flex; flex-direction: column; background-color: rgb(0, 0, 0); background-position: center center; background-size: contain; background-repeat: repeat; background-attachment: fixed; text-align: left; border-style: dashed; border-color: rgb(0, 128, 0); border-width: 5px; border-radius: 5px; min-height: 500px; margin: 1px 2px 3px 4px; padding: 5px 6px 7px 8px;">
  <div class="row-full-width-inner" data-element="inner">
    <div class="pagebuilder-column-group" style="display: flex;" data-content-type="column-group" data-grid-size="12" data-element="main">
      <div class="pagebuilder-column-line" data-content-type="column-line" data-element="main">
        <div class="pagebuilder-column testing-1" data-content-type="column" data-appearance="align-center" data-background-images="{}" data-element="main" style="justify-content: flex-start; display: flex; flex-direction: column; background-color: rgba(255, 255, 255, 0.23); background-position: left top; background-size: cover; background-repeat: no-repeat; background-attachment: scroll; text-align: center; border-style: ridge; border-color: rgb(132, 0, 254); border-width: 5px; border-radius: 0px; min-height: 250px; width: 25%; margin: 1px 2px 3px 4px; padding: 5px 6px 7px 8px; align-self: center;">
          <h2 data-content-type="heading" data-appearance="default" data-element="main" style="border-style: none; border-width: 1px; border-radius: 0px;">Here's a heading</h2>
          <div data-content-type="text" data-appearance="default" data-element="main" style="border-style: none; border-width: 1px; border-radius: 0px; margin: 0px; padding: 0px;">
            <p>and a magic text block</p>
          </div>
          <div data-content-type="divider" data-appearance="default" data-element="main" style="border-style: none; border-width: 1px; border-radius: 0px; margin: 0px; padding: 10px;">
            <hr data-element="line" style="width: 100%; border-width: 1px; border-color: rgb(206, 206, 206); display: inline-block;">
          </div>
          <div data-content-type="html" data-appearance="default" data-element="main" style="border-style: none; border-width: 1px; border-radius: 0px; margin: 0px; padding: 0px;">&lt;strong&gt;Testing HTML&lt;/strong&gt;</div>
        </div>
        <div class="pagebuilder-column testing-1" data-content-type="column" data-appearance="align-center" data-background-images="{&quot;desktop_image&quot;:&quot;{{media url=wysiwyg/AdobeStock_78698208.jpg}}&quot;,&quot;mobile_image&quot;:&quot;{{media url=wysiwyg/Screenshot_2018-12-28_at_11.31.12.png}}&quot;}" data-element="main" style="justify-content: flex-start; display: flex; flex-direction: column; background-color: rgba(255, 255, 255, 0.23); background-position: left top; background-size: cover; background-repeat: no-repeat; background-attachment: scroll; text-align: center; border-style: ridge; border-color: rgb(132, 0, 254); border-width: 5px; border-radius: 0px; min-height: 250px; width: 25%; margin: 1px 2px 3px 4px; padding: 5px 6px 7px 8px; align-self: center;"></div>
        <div class="pagebuilder-column" data-content-type="column" data-appearance="full-height" data-background-images="{}" data-element="main" style="justify-content: flex-start; display: flex; flex-direction: column; background-position: left top; background-size: cover; background-repeat: no-repeat; background-attachment: scroll; border-style: none; border-width: 1px; border-radius: 0px; width: 50%; margin: 0px; padding: 10px; align-self: stretch;">
          <h2 data-content-type="heading" data-appearance="default" data-element="main" style="border-style: none; border-width: 1px; border-radius: 0px;">and another</h2>
          <figure class="testinggg" data-content-type="image" data-appearance="full-width" data-element="main" style="text-align: center; margin: 1px 2px 0px 3px; padding: 5px 6px 83px 2px; border-style: none;">
            <a href="http://adobe.com/" target="" data-link-type="default" title="TITLE" data-element="link"><img class="pagebuilder-mobile-hidden" src="{{media url=wysiwyg/bottom-left.jpg}}" alt="ALT" title="TITLE" data-element="desktop_image" style="border-style: double; border-color: rgb(83, 55, 150); border-width: 2px; border-radius: 5px; max-width: 100%; height: auto;"><img class="pagebuilder-mobile-only" src="{{media url=wysiwyg/AdobeStock_78698208_1.jpg}}" alt="ALT" title="TITLE" data-element="mobile_image" style="border-style: double; border-color: rgb(83, 55, 150); border-width: 2px; border-radius: 5px; max-width: 100%; height: auto;"></a>
            <figcaption data-element="caption">Thsi is caption</figcaption>
          </figure>
        </div>
      </div>
    </div>
  </div>
</div>
<div data-content-type="row" data-appearance="contained" data-element="main">
  <div data-enable-parallax="0" data-parallax-speed="0.5" data-background-images="{}" data-element="inner" style="justify-content: flex-start; display: flex; flex-direction: column; background-position: left top; background-size: cover; background-repeat: no-repeat; background-attachment: scroll; border-style: none; border-width: 1px; border-radius: 0px; margin: 0px 0px 10px; padding: 10px;">
    <div class="pagebuilder-column-group" style="display: flex;" data-content-type="column-group" data-grid-size="12" data-element="main">
      <div class="pagebuilder-column-line" data-content-type="column-line" data-element="main">
        <div class="pagebuilder-column" data-content-type="column" data-appearance="full-height" data-background-images="{}" data-element="main" style="justify-content: flex-start; display: flex; flex-direction: column; background-position: left top; background-size: cover; background-repeat: no-repeat; background-attachment: scroll; border-style: none; border-width: 1px; border-radius: 0px; width: 41.6667%; margin: 0px; padding: 10px; align-self: stretch;">
          <div class="tab-align-left" data-content-type="tabs" data-appearance="default" data-active-tab="" data-element="main" style="margin: 0px; padding: 0px;">
            <ul role="tablist" class="tabs-navigation" data-element="navigation" style="text-align: left;">
              <li role="tab" class="tab-header" data-element="headers" style="border-radius: 0px; border-width: 1px;"><a href="#HIAW8QO" class="tab-title"><span class="tab-title">Our first tab</span></a></li>
              <li role="tab" class="tab-header" data-element="headers" style="border-radius: 0px; border-width: 1px;"><a href="#YCOG3K9" class="tab-title"><span class="tab-title">A second tab</span></a></li>
            </ul>
            <div class="tabs-content" data-element="content" style="border-width: 1px; border-radius: 0px; min-height: 300px;">
              <div data-content-type="tab-item" data-appearance="default" data-tab-name="Our first tab" data-background-images="{&quot;desktop_image&quot;:&quot;{{media url=wysiwyg/AdobeStock_78698208.jpg}}&quot;}" data-element="main" id="HIAW8QO" style="justify-content: flex-start; display: flex; flex-direction: column; background-position: right bottom; background-size: auto; background-repeat: repeat; background-attachment: fixed; text-align: center; border-width: 1px; border-radius: 0px; min-height: 150px; margin: 0px; padding: 40px;">
                <div data-content-type="map" data-appearance="default" data-show-controls="true" data-locations="[{&quot;location_name&quot;:&quot;Homw&quot;,&quot;position&quot;:{&quot;latitude&quot;:-14,&quot;longitude&quot;:12},&quot;phone&quot;:&quot;6624235&quot;,&quot;address&quot;:&quot;123 Testing&quot;,&quot;city&quot;:&quot;Test&quot;,&quot;state&quot;:&quot;Test&quot;,&quot;zipcode&quot;:&quot;Test&quot;,&quot;comment&quot;:&quot;Testing&quot;,&quot;country&quot;:&quot;United States&quot;,&quot;record_id&quot;:0},{&quot;position&quot;:{&quot;latitude&quot;:30.09625467271396,&quot;longitude&quot;:-97.01250917968753},&quot;location_name&quot;:&quot;Somewhere else&quot;,&quot;phone&quot;:&quot;&quot;,&quot;address&quot;:&quot;&quot;,&quot;city&quot;:&quot;&quot;,&quot;state&quot;:&quot;&quot;,&quot;zipcode&quot;:&quot;&quot;,&quot;country&quot;:[],&quot;comment&quot;:&quot;&quot;,&quot;record_id&quot;:1}]" data-element="main" style="border-style: none; border-width: 1px; border-radius: 0px; margin: 0px; padding: 0px; height: 500px;"></div>
                <div data-content-type="html" data-appearance="default" data-element="main" style="border-style: none; border-width: 1px; border-radius: 0px; margin: 0px; padding: 0px;">&lt;input type="text" name="testing" /&gt;</div>
              </div>
              <div data-content-type="tab-item" data-appearance="default" data-tab-name="A second tab" data-background-images="{}" data-element="main" id="YCOG3K9" style="justify-content: center; display: flex; flex-direction: column; background-color: rgb(0, 0, 0); background-position: left top; background-size: cover; background-repeat: no-repeat; background-attachment: scroll; border-color: rgb(255, 0, 0); border-width: 1px; border-radius: 0px; min-height: 300px; margin: 0px; padding: 40px;">
                <figure data-content-type="image" data-appearance="full-width" data-element="main" style="margin: 0px; padding: 0px; border-style: none;"><img class="pagebuilder-mobile-hidden" src="{{media url=wysiwyg/Screenshot_2018-12-28_at_11.31.12.png}}" alt="" title="" data-element="desktop_image" style="border-style: none; border-width: 1px; border-radius: 0px; max-width: 100%; height: auto;"><img class="pagebuilder-mobile-only" src="{{media url=wysiwyg/Screenshot_2018-12-28_at_11.31.12.png}}" alt="" title="" data-element="mobile_image" style="border-style: none; border-width: 1px; border-radius: 0px; max-width: 100%; height: auto;"></figure>
                <div data-content-type="divider" data-appearance="default" data-element="main" style="border-style: none; border-width: 1px; border-radius: 0px; margin: 0px; padding: 10px;">
                  <hr data-element="line" style="width: 100%; border-width: 1px; border-color: rgb(206, 206, 206); display: inline-block;">
                </div>
                <h2 data-content-type="heading" data-appearance="default" data-element="main" style="border-style: none; border-width: 1px; border-radius: 0px;">An internal heading</h2>
              </div>
            </div>
          </div>
        </div>
        <div class="pagebuilder-column" data-content-type="column" data-appearance="full-height" data-background-images="{}" data-element="main" style="justify-content: flex-start; display: flex; flex-direction: column; background-position: left top; background-size: cover; background-repeat: no-repeat; background-attachment: scroll; border-style: none; border-width: 1px; border-radius: 0px; width: 58.3333%; margin: 0px; padding: 10px; align-self: stretch;">
          <div data-content-type="buttons" data-appearance="stacked" data-same-width="true" data-element="main" class="test-class" style="text-align: center; border-style: dashed; border-color: rgb(255, 0, 0); border-width: 5px; border-radius: 12px; display: flex; margin: 1px 2px 3px 4px; padding: 5px 6px 8px 9px; flex-direction: column;">
            <div data-content-type="button-item" data-appearance="default" data-element="main" style="display: inline-block;">
              <div class="pagebuilder-button-primary" data-element="empty_link" style="text-align: center;"><span data-element="link_text">Our first button</span></div>
            </div>
            <div data-content-type="button-item" data-appearance="default" data-element="main" style="display: inline-block;">
              <div class="pagebuilder-button-primary" data-element="empty_link" style="text-align: center;"><span data-element="link_text">Secondary button</span></div>
            </div>
            <div data-content-type="button-item" data-appearance="default" data-element="main" style="display: inline-block;">
              <div class="pagebuilder-button-primary" data-element="empty_link" style="text-align: center;"><span data-element="link_text">Secondary button</span></div>
            </div>
          </div>
          <div data-content-type="divider" data-appearance="default" data-element="main" style="border-style: none; border-width: 1px; border-radius: 0px; margin: 0px; padding: 10px;">
            <hr data-element="line" style="width: 100%; border-width: 1px; border-color: rgb(206, 206, 206); display: inline-block;">
          </div>
          <div data-content-type="buttons" data-appearance="inline" data-same-width="false" data-element="main" style="text-align: right; border-style: double; border-color: rgb(0, 0, 0); border-width: 1px; border-radius: 50px; display: inline-block; margin: 0px; padding: 10px 10px 0px;">
            <div data-content-type="button-item" data-appearance="default" data-element="main" style="display: inline-block;">
              <div class="pagebuilder-button-primary" data-element="empty_link" style="text-align: center;"><span data-element="link_text">Our first button</span></div>
            </div>
            <div data-content-type="button-item" data-appearance="default" data-element="main" style="display: inline-block;">
              <div class="pagebuilder-button-primary" data-element="empty_link" style="text-align: center;"><span data-element="link_text">Secondary button</span></div>
            </div>
            <div data-content-type="button-item" data-appearance="default" data-element="main" style="display: inline-block;">
              <div class="pagebuilder-button-primary" data-element="empty_link" style="text-align: center;"><span data-element="link_text">Secondary button</span></div>
            </div>
          </div>
          <div data-content-type="map" data-appearance="default" data-show-controls="true" data-locations="[{&quot;location_name&quot;:&quot;Homw&quot;,&quot;position&quot;:{&quot;latitude&quot;:-14,&quot;longitude&quot;:12},&quot;phone&quot;:&quot;6624235&quot;,&quot;address&quot;:&quot;123 Testing&quot;,&quot;city&quot;:&quot;Test&quot;,&quot;state&quot;:&quot;Test&quot;,&quot;zipcode&quot;:&quot;Test&quot;,&quot;comment&quot;:&quot;Testing&quot;,&quot;country&quot;:&quot;United States&quot;,&quot;record_id&quot;:0,&quot;initialize&quot;:true},{&quot;position&quot;:{&quot;latitude&quot;:30.09625467271396,&quot;longitude&quot;:-97.01250917968753},&quot;location_name&quot;:&quot;Somewhere else&quot;,&quot;phone&quot;:&quot;&quot;,&quot;address&quot;:&quot;&quot;,&quot;city&quot;:&quot;&quot;,&quot;state&quot;:&quot;&quot;,&quot;zipcode&quot;:&quot;&quot;,&quot;country&quot;:[],&quot;comment&quot;:&quot;&quot;,&quot;record_id&quot;:1,&quot;initialize&quot;:true}]" data-element="main" style="text-align: center; border-style: double; border-color: rgb(255, 255, 13); border-width: 15px; border-radius: 15px; margin: 1px 2px 3px 4px; padding: 5px 6px 7px 8px; height: 250px;"></div>
        </div>
      </div>
    </div>
  </div>
</div>
CONTENT;
// @codingStandardsIgnoreEnd

/** @var $page \Magento\Cms\Model\Page */
$page = \Magento\TestFramework\Helper\Bootstrap::getObjectManager()->create(\Magento\Cms\Model\Page::class);
$page->setTitle('Page Builder Analytics Test Page')
    ->setIdentifier('page-builder-analytics-test-page')
    ->setStores([0, 1])
    ->setIsActive(1)
    ->setCreatedIn(1)
    ->setContent($content)
    ->setPageLayout('cms-full-width')
    ->save();

/** @var $emptyContentPage \Magento\Cms\Model\Page */
$emptyContentPage = \Magento\TestFramework\Helper\Bootstrap::getObjectManager()->create(\Magento\Cms\Model\Page::class);
$emptyContentPage->setTitle('Page Builder Analytics Test Page - Empty Content')
    ->setIdentifier('page-builder-analytics-test-page-empty')
    ->setStores([0, 1])
    ->setIsActive(1)
    ->setCreatedIn(1)
    ->setContent('')
    ->setPageLayout('cms-full-width')
    ->save();

/** @var $nullContentPage \Magento\Cms\Model\Page */
$nullContentPage = \Magento\TestFramework\Helper\Bootstrap::getObjectManager()->create(\Magento\Cms\Model\Page::class);
$nullContentPage->setTitle('Page Builder Analytics Test Page - Null Content')
    ->setIdentifier('page-builder-analytics-test-page-null')
    ->setStores([0, 1])
    ->setIsActive(1)
    ->setCreatedIn(1)
    ->setContent(null)
    ->setPageLayout('cms-full-width')
    ->save();
