/*global define, amplify */

define([
    'jquery',
    "fx-cat-br/config/events",
    "fx-cat-br/plugins/Fx-catalog-bridge-filter-plugin"
], function ($, E, Plugin) {

    'use strict';

    var o = {
        name: 'fx-catalog-filter'
    };

    var s = {
        CONTAINER: ".fx-catalog-modular-filter-container",
        TOGGLE_BTN: ".fx-catalog-header-btn-close"
    };

    function FilterController() {

        this.publishFxCatalogBridgePlugin();
    }

    FilterController.prototype.publishFxCatalogBridgePlugin = function () {

        //FENIX Catalog Plugin Registration
        if (!window.Fx_catalog_bridge_plugins) {

            window.Fx_catalog_bridge_plugins = {};
        }

        window.Fx_catalog_bridge_plugins[o.name] = new Plugin();

    };

    //(injected)
    FilterController.prototype.menu = undefined;

    //(injected)
    FilterController.prototype.form = undefined;

    //(injected)
    FilterController.prototype.resume = undefined;

    //(injected)
    FilterController.prototype.submit = undefined;

    /* API */
    FilterController.prototype.render = function () {

        this.preValidation();

        this.initVariables();

        this.bindEventListeners();

        this.renderComponents();
    };

    FilterController.prototype.preValidation = function () {

        if (!this.menu) {
            throw new Error("FilterController: INVALID MENU ITEM.");
        }

        if (!this.form) {
            throw new Error("FilterController: INVALID FORM ITEM.");
        }

        if (!this.submit) {
            throw new Error("FilterController: INVALID SUBMIT ITEM.");
        }

    };

    FilterController.prototype.initVariables = function () {

        this.$toggleBtn = $(s.TOGGLE_BTN);

        this.$submit = $(this.submit);

        this.$container = $(s.CONTAINER);
    };

    FilterController.prototype.bindEventListeners = function () {

        amplify.subscribe(E.MODULE_SELECT, this, this.onItemSelect);

        amplify.subscribe(E.MODULE_REMOVE, this, this.onItemRemove);

        this.$toggleBtn.on('click', this.onToggleCatalog);

        this.$submit.on("click", this.onSubmit);
    };

    FilterController.prototype.unbindEventListeners = function () {

        amplify.unsubscribe(E.MODULE_SELECT, this.onItemSelect);

        amplify.unsubscribe(E.MODULE_REMOVE, this.onItemRemove);

        this.$toggleBtn.off();

        this.$submit.off('click', this.onSubmit);
    };

    FilterController.prototype.getD3PFilter = function () {

        return {
            hi: "I am the filter"
        };
    };

    /* event callback */

    FilterController.prototype.onItemSelect = function (e) {

        if (this.form.getElementsCounts() === 0) {

            this.form.hideCourtesyMessage();

            this.resume.hideCourtesyMessage();

            this.$submit.removeClass('disabled');
        }

        this.form.addItem(e);

    };

    FilterController.prototype.onItemRemove = function (e) {

        this.form.removeItem(e.module);

        this.menu.activate(e.type);

        if (this.form.getElementsCounts() === 0) {

            this.form.showCourtesyMessage();

            this.resume.showCourtesyMessage();

            this.$submit.addClass('disabled');
        }
    };

    FilterController.prototype.onToggleCatalog = function () {

        if (this.$container.is(":visible")) {

            this.$container.hide();

        } else {

            this.$container.show();
        }

    };

    FilterController.prototype.onSubmit = function () {

        amplify.publish(E.SEARCH_SUBMIT);
    };

    /* end event callback */

    FilterController.prototype.renderComponents = function () {

        this.menu.render();

        this.form.render();

        this.resume.render();
    };

    FilterController.prototype.getValues = function (boolean) {

        return this.form.getValues(boolean);
    };

    FilterController.prototype.getName = function () {

        return o.name;
    };

    FilterController.prototype.destroy = function () {

        this.menu.destroy();

        this.form.destroy();

        this.resume.destroy();

        this.unbindEventListeners();
    };

    return FilterController;

});