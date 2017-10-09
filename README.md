# BlueFoot Magento 2 module
The BlueFoot module provides drag & drop content building functionality to Magento 2. Originally produced by Gene Commerce and acquired at the start of 2017 by Magento.

### Development Installation

1. Install all composer dependencies
    ```bash
    composer install
    yarn install
    ```
        

2. Configure robo (docker or local mysql):

    **Docker mysql** (make sure container has either port or ip address accessible to host)
    ```bash
    composer robo build:configuration-from-docker-container [name of mysql container[
    ```
    
    ***Local mysql***
    ```bash
    composer robo build:configuration [mysql host] [mysql username] [mysql password]
    ```
    
3. Create development build

    ```bash
    composer robo build:create dev [your prefered url]
    ``
