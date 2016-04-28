function addNewTaxonomyTerm(taxonomyId, url) {

    try {
        var request = new Ajax.Request(
            url,
            {
                method: 'post',
                parameters: {taxonomy: taxonomyId},
                dataType: 'json',
                onComplete: function () {
                },
                onSuccess: function (transport) {
                    try {
                        response = eval('(' + transport.responseText + ')');

                        if (response.error_alert) {
                            alert(response.error_alert);
                        }

                        if (response.modal) {
                            openEntityModal(response.modal);
                        }

                        if (response.update) {
                            try {
                                updateSections = $H(response.update);
                                updateSections.each(function (item) {
                                    $(item.key).update(item.value);
                                });
                            } catch (err) {
                            }
                        }

                        if (response.updateArea) {
                            updateAreas = $H(response.updateArea);
                            updateAreas.each(function (item) {
                                updateArea(item.value);
                            });
                        }

                        if (response.showhide) {
                            try {
                                updateSections = $H(response.showhide);
                                updateSections.each(function (item) {
                                    if (item.value == 'show' || item.value === true) {
                                        $(item.key).show();
                                    } else if (item.value == 'hide' || item.value === false) {
                                        $(item.key).hide();
                                    }
                                });
                            } catch (err) {
                            }
                        }

                    } catch (e) {
                    }

                },
                onFailure: function () {
                }
            });
    } catch (err) {
        alert('Exception (JS): ' + err.message);
    }

}


function quickAddTerm(formId) {

    var form = $(formId);

    validator = new Validation(formId, {
        onElementValidate: function (result, elm) {
            if (!result)
                elm.setHasError(true, this);
            else
                elm.setHasError(false, this);
        }
    });

    if (validator && validator.validate()) {

    } else {
        alert('Please review form and fix any highlighted errors');
        return false;
    }

    url = form.action;

    try {
        var request = new Ajax.Request(
            url,
            {
                method: 'post',
                parameters: form.serialize(),
                dataType: 'json',
                onSuccess: function (transport) {
                    try {
                        response = eval('(' + transport.responseText + ')');

                        if (response.error_alert) {
                            alert(response.error_alert);
                        }

                        if (response.modal) {
                            if (response.modal.update) {
                                openEntityModal(response.modal.update);
                            }

                            if (response.modal.close) {
                                closeEntityModal();
                            }
                        }

                        if (response.update) {
                            try {
                                updateSections = $H(response.update);
                                updateSections.each(function (item) {
                                    $(item.key).update(item.value);
                                });
                            } catch (err) {

                            }

                            closeEntityModal();
                        }

                        if (response.showhide) {
                            try {
                                updateSections = $H(response.showhide);
                                updateSections.each(function (item) {
                                    if (item.value == 'show' || item.value === true) {
                                        $(item.key).show();
                                    } else if (item.value == 'hide' || item.value === false) {
                                        $(item.key).hide();
                                    }
                                });


                            } catch (err) {
                            }
                        }

                    } catch (e) {
                        alert('general error:' + e.message);
                    }

                },
                onFailure: function () {
                }
            });
    } catch (err) {
        alert('Exception (JS): ' + err.message);
    }

}


function openEntityModal(content) {

    if ($('entity_modal') && typeof(Windows) != 'undefined') {
        Windows.focus('entity_modal');
        return;
    }
    var dialogWindow = Dialog.info(null, {
        closable: true,
        resizable: false,
        draggable: true,
        className: 'magento',
        windowClassName: 'popup-window',
        title: 'Quick Add',
        top: 50,
        width: 800,
        height: 600,
        zIndex: 1000,
        recenterAuto: false,
        hideEffect: Element.hide,
        showEffect: Element.show,
        id: 'entity_modal',
        //url:url,
        onClose: function (param, el) {

        }
    });

    dialogWindow.setHTMLContent(content);

    var quickterm = new Quickterm('term_quick_add');

}

function updateArea(updateUrl) {
    try {
        var request = new Ajax.Request(
            url,
            {
                method: 'post',
                parameters: form.serialize(),
                dataType: 'json',
                onSuccess: function (transport) {
                    try {
                        response = eval('(' + transport.responseText + ')');

                        if (response.error_alert) {
                            alert(response.error_alert);
                        }

                        if (response.update) {
                            try {
                                updateSections = $H(response.update);
                                updateSections.each(function (item) {
                                    $(item.key).update(item.value);
                                });
                            } catch (err) {
                            }
                        }

                    } catch (e) {
                    }

                },
                onFailure: function () {
                }
            });
    } catch (err) {
        alert('Exception (JS): ' + err.message);
    }
}

function closeEntityModal() {
    Windows.close('entity_modal');
}

Quickterm = Class.create();
Quickterm.prototype = {
    initialize: function (element) {
        var that = this;
        this.element = element;
        var firstFieldset = true;
        $(this.element).select('.entry-edit-head').each(function (el) {
            if ($(el).select('.modulecreator-toggle').length == 0) {
                $(el).insert({top: '<div class="collapseable"><a href="#" class="left quickterm-toggle open">&nbsp;</a></div>'});
                Event.observe($(el).select('a.quickterm-toggle')[0], 'click', function (e) {
                    $(this).up(1).next().toggle();
                    $(this).toggleClassName('open');
                    $(this).toggleClassName('closed');
                    Event.stop(e);
                    return false;
                });
                if (!firstFieldset) {
                    $(el).select('a.quickterm-toggle')[0].click();
                }
                firstFieldset = false;
            }
        });
    }
}

function displayLoadingMask() {
    var loaderArea = $$('#html-body .wrapper')[0]; // Blocks all page
    Position.clone($(loaderArea), $('loading-mask'), {offsetLeft: -2});
    toggleSelectsUnderBlock($('loading-mask'), false);
    Element.show('loading-mask');
}

function hideLoadingMask() {
    Element.hide('loading-mask');
}