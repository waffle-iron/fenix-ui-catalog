/*global define*/

/*
 * TODO:
 * Set lang dynamically
 *
 * Review the validation method. Every ComponentType should have an array of validation fns in order
 * to do not duplicate the same validation fns
 * */

define([
    "require",
    "jquery",
    'fx-cat-br/config/config',
    'fx-cat-br/config/config-default'
], function (require, $, C,DC) {

    'use strict';

    var errors = {
            UNKNOWN_TYPE: {EN: "FENIX UI Creator: Unknown widget type"},
            CONTAINER_NOT_FOUND: {EN: "FENIX UI Creator: Impossible to find container"},
            ELEMENTS_NOT_JSON: {EN: "FENIX UI Creator: Elements JSON file not valid"},
            ELEMENTS_NOT_ARRAY: {EN: "FENIX UI Creator: Elements JSON file not an array"},
            ELEM_NOT_ID: {EN: "FENIX UI Creator: Specify Id for each UI element"},
            ELEM_NOT_COMP: {EN: "FENIX UI Creator: Specify Component for each UI element"},
            ELEM_COMP_TYPE: {EN: "FENIX UI Creator: Component Type not valid"},
            ELEM_NOT_SOURCE: {EN: "FENIX UI Creator: Specify source for each Component"},
            ELEM_NOT_DATAFIELDS: {EN: "FENIX UI Creator: Specify Datafields for each Component"},
            VALUES_NOT_READY: {EN: "FENIX UI Creator: Values Not Ready"},
            VALIDATORS_NOT_VALID: {EN: "FENIX UI Creator: Validators not valid"},
            DATE_FORMAT_ERROR: {EN: "FENIX UI Creator: Date format not valid"},
            CONNECTION_FAIL: {EN: "FENIX UI Creator: Connection problems"}
        },
        lang = 'EN',
        valid;
    /*
     langs: allowed languages for rendering
     o: component internal options
     v: used to get validation result
     */
    var langs = ["EN", "FR", "ES"], elems, v;

    //helper functions
    function handleError(e) {
        valid = false;
        throw new Error(errors[e][lang]);
    }

    //Validation fns
    function inputValidation(o) {

        //Existing container
        if (!document.querySelector(o.container)) {
            handleError("CONTAINER_NOT_FOUND");
            return;
        }

        //valid JSON Source
        try {
            JSON.parse(o.elements);
        } catch (e) {
            handleError("ELEMENTS_NOT_JSON");
            return;
        }

        //Source as Array
        if (JSON.parse(o.elements).length === undefined) {
            handleError("ELEMENTS_NOT_ARRAY");
            return;
        }

        //UI valid lang
        if (o.lang && langs.indexOf(o.lang.toUpperCase()) > 0) {
            lang = o.lang.toUpperCase();
        }

        return valid;
    }

    function validateElement(e, widget) {

        //Valid component
        if (!e.hasOwnProperty("id")) {
            handleError("ELEM_NOT_ID");
        }

        //Valid component
        if (!e.hasOwnProperty("component")) {
            handleError("ELEM_NOT_COMP");
        }
        //Component Type
        if (widget.validate) {
            valid = widget.validate(e.component);
        }

        return valid;
    }

    //Rendering fns
    function createElement(o, e, container, widget) {

        var div, label, c;

        c = document.getElementById(e.container);

        if (!c) {

            c = document.createElement("DIV");
            c.setAttribute("id", e.container);
            if (e.cssclass) {
                c.setAttribute("class", e.cssclass);
            }

        }

        if (e.label[lang] && o.labels) {

            label = document.createElement("label");
            label.setAttribute("for", e.id);
            label.innerHTML = e.label[lang];
            c.appendChild(label);

            div = document.createElement("DIV");
            div.setAttribute("id", e.id);
            c.appendChild(div);

            document.querySelector(container).appendChild(c);

        } else {

            div = document.createElement("DIV");
            if (e.cssclass) {

                div.setAttribute("id", e.id);
                div.setAttribute("class", e.cssclass);
            }

            document.querySelector(container).appendChild(div);
        }

        widget.render(e, div, o);

    }

    //Public Component
    function Fenix_ui_creator(o) {
        this.o = {};
        $.extend(this.o, o);
    }

    Fenix_ui_creator.prototype.getValidation = function (o, values) {

        var result = {}, propertyErrors, property, validatorName, e;

        if (o.validators && typeof o.validators !== "object") {

            handleError("VALIDATORS_NOT_VALID");

        } else {

            //Loop over validations
            for (property in o.validators) {

                propertyErrors = {errors: {}};

                if (o.validators.hasOwnProperty(property)) {

                    for (validatorName in o.validators[property]) {

                        if (o.validators[property].hasOwnProperty(validatorName)) {

                            e = o.validators[property][validatorName](values[property]);

                            if (e !== true) {
                                propertyErrors.errors[validatorName] = e;
                            }

                        }
                    }
                }

                if (Object.keys(propertyErrors.errors).length > 0) {

                    propertyErrors.value = values[property];
                    result[property] = propertyErrors;
                }
            }
        }


        return Object.keys(result).length === 0 ? null : result;
    };

    //Get Values
    Fenix_ui_creator.prototype.getValues = function (validate, externalElements) {

        var result = {},
            self = this;

        if (externalElements) {

            $(externalElements).each(function (index, element) {

                //Synch call of require
                try {
                    var plugin_folder = C.PLUGIN_FOLDER_PATH || DC.PLUGIN_FOLDER_PATH
                    var plugin_name = element.type;

                    var widgetSource = plugin_folder + "Fx-ui-w-" + plugin_name;
                    var Module = require(widgetSource),
                        widget = new Module();

                    result[element[self.o.result_key]] = widget.getValue(element);

                } catch (e) {
                    console.error(e);
                }
            });

        } else {
            //Looping on initial elements
            if (elems === undefined) {
                handleError("VALUES_NOT_READY");
            }


            $(elems).each(function (index, element) {

                //Synch call of require
                try {
                    var plugin_folder = C.PLUGIN_FOLDER_PATH || DC.PLUGIN_FOLDER_PATH
                    var plugin_name = (C.PLUGIN_FOLDER_PATH)? element.id: element.type;

                    var widgetSource = plugin_folder + "Fx-ui-w-" + plugin_name;
                    var Module = require(widgetSource),
                        widget = new Module();

                    result[element.semantic] = widget.getValue(element);
                } catch (e) {

                    console.error(e);
                }

            });
        }

        v = validate === undefined || validate === false ? null : self.getValidation({}, result);
        if (v) {
            throw new Error(v);
        }

        return result;
    };

    Fenix_ui_creator.prototype.validate = function () {
        return this.getValidation(this.getValues());
    };

    Fenix_ui_creator.prototype.render = function (o) {

        var self = this;

        valid = true;

        if (inputValidation(o)) {

            elems = JSON.parse(o.elements);

            $(elems).each(function (index, element) {

                var plugin_folder = C.PLUGIN_FOLDER_PATH || DC.PLUGIN_FOLDER_PATH
                var plugin_name = element.type;

                var widgetSource = plugin_folder + "Fx-ui-w-" + plugin_name;

                require([widgetSource], function (Widget) {
                    valid = true;
                    var widget = new Widget();

                    if (validateElement(element, widget)) {
                        createElement(o, element, o.container, widget);
                    }

                }, function (err) {
                    handleError("UNKNOWN_TYPE");
                });

            });
        }
    };

    Fenix_ui_creator.prototype.init = function (o) {
        $.extend(this.o, o);
    };

    //Public API
    return Fenix_ui_creator;

});