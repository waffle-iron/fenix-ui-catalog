/*global define, amplify*/
define([
    'jquery',
    'underscore',
    'loglevel',
    'fx-catalog/config/errors',
    'fx-catalog/config/events',
    'fx-catalog/config/config',
    'fx-catalog/config/config-default',
    'fx-catalog/config/menu-config',
    'fx-catalog/config/selectors-registry',
    'text!fx-catalog/html/catalog.hbs',
    'i18n!fx-catalog/nls/catalog',
    'fx-filter/start',
    'q',
    'handlebars',
    'jquery.bootpage',
    'amplify',
    'bootstrap'
], function ($, _, log, ERR, EVT, C, CD, MenuConfig, SelectorsRegistry, Templates, i18nLabels, Filter, Q, Handlebars) {

    'use strict';

    var s = {
        CATALOG: "[data-role='catalog']",
        MENU: "[data-role='menu']",
        MENU_GROUPS: "[data-role='menu-group']",
        MENU_ITEMS: "[data-role='menu-item']",
        FILTER: "[data-role='filter']",
        SUMMARY: "[data-role='summary']",
        SUBMIT_BUTTON: "[data-role='submit']",
        RESET_BUTTON: "[data-role='reset']",
        BOTTOM: "[data-role='bottom']",
        RESULTS_CONTAINER: "[data-role='results-container']",
        RESULTS: "[data-role='results']",
        RESULT: "[data-role='result']",
        PAGINATION: "[data-role='pagination']",
        ERROR_CONTAINER: "[data-role='error-container']"
    };

    function Catalog(o) {
        log.info("FENIX catalog");
        log.info(o);

        $.extend(true, this, {initial: o}, CD, C);

        this._registerHandlebarsHelpers();

        this._parseInput();

        var valid = this._validateInput();

        log.info("Catalog has valid input? " + JSON.stringify(valid));

        if (valid === true) {

            this._attach();

            this._hideError();

            this._setBottomStatus('intro');

            this._initVariables();

            this._initFilter();

            this._bindEventListeners();

            return this;

        } else {
            log.error("Impossible to create Catalog");
            log.error(valid)
        }
    }

    /**
     * Reset the view content
     * @return {null}
     */
    Catalog.prototype.reset = function () {

        this._resetResults();

        this._hideError();

        if (this.filter && !$.isFunction(this.filter.clear)) {
            log.error("Filter.clear is not a fn()");

            return;
        }

        this.filter.clear();

        log.info("Catalog reset");
    };


    /**
     * pub/sub
     * @return {Object} catalog instance
     */
    Catalog.prototype.on = function (channel, fn) {
        if (!this.channels[channel]) {
            this.channels[channel] = [];
        }
        this.channels[channel].push({context: this, callback: fn});
        return this;
    };

    /**
     * Dispose
     * @return {null}
     */
    Catalog.prototype.dispose = function () {

        //unbind event listeners
        this._unbindEventListeners();

        log.info("Catalog disposed successfully");

    };

    // end API

    Catalog.prototype._trigger = function (channel) {

        if (!this.channels[channel]) {
            return false;
        }
        var args = Array.prototype.slice.call(arguments, 1);
        for (var i = 0, l = this.channels[channel].length; i < l; i++) {
            var subscription = this.channels[channel][i];
            subscription.callback.apply(subscription.context, args);
        }

        return this;
    };

    Catalog.prototype._parseInput = function () {

        this.id = this.initial.id;
        this.$el = this.initial.$el;
        this.defaultSelectors = this.initial.defaultSelectors || [];
        this.actions = this.initial.actions || C.RESULT_ACTIONS || CD.RESULT_ACTIONS;
        this.baseFilter = this.initial.baseFilter || {};

    };

    Catalog.prototype._validateInput = function () {

        var valid = true,
            errors = [];

        //set filter id
        if (!this.id) {

            window.fx_catalog_id >= 0 ? window.fx_catalog_id++ : window.fx_catalog_id = 0;

            this.id = "fx-catalog-" + String(window.fx_catalog_id);

            log.warn("Impossible to find catalog id. Set auto id to: " + this.id);
        }


        if (!this.$el) {
            errors.push({code: ERR.MISSING_CONTAINER});

            log.warn("Impossible to find filter container");
        }

        this.$el = $(this.$el);

        //Check if $el exist
        if (this.$el.length === 0) {

            errors.push({code: ERR.MISSING_CONTAINER});

            log.warn("Impossible to find box container");

        }

        return errors.length > 0 ? errors : valid;
    };

    Catalog.prototype._attach = function () {

        var template = Handlebars.compile($(Templates).find(s.CATALOG)[0].outerHTML),
            $html = $(template($.extend(true, {}, i18nLabels, this._createMenuConfiguration())));

        this.$el.html($html);

        log.info("template attached successfully");

    };

    Catalog.prototype._createMenuConfiguration = function () {

        var groups = _.map(MenuConfig, _.bind(function (group) {

            window.fx_catalog_menu_groups >= 0 ? window.fx_catalog_menu_groups++ : window.fx_catalog_menu_groups = 0;

            //Add menu id
            group.menuId = this.id;
            group.label = i18nLabels[group.id] || "Missing group title " + String(window.fx_catalog_menu_groups);

            //Add dynamic group id
            group.id = this.id + "-group-" + String(window.fx_catalog_menu_groups);
            group.opened = !!group.opened;

            //Iterate over group's items
            _.map(group.items, _.bind(function (item) {

                //Add dynamic item id
                window.fx_catalog_menu_items >= 0 ? window.fx_catalog_menu_items++ : window.fx_catalog_menu_items = 0;
                item.id = this.id + "-item-" + String(window.fx_catalog_menu_items);
                item.disabled = !!item.disabled;

                item.label = i18nLabels[item.selector] || "Missing item title: " + item.selector;

            }, this));

            return group;

        }, this));

        return {menuId: this.id, groups: groups};
    };

    Catalog.prototype._initVariables = function () {

        //pub/sub
        this.channels = {};

        //menu
        this.$menu = this.$el.find(s.MENU);
        this.$items = this.$menu.find(s.MENU_ITEMS);

        this.$submit = this.$el.find(s.SUBMIT_BUTTON);
        this.$reset = this.$el.find(s.RESET_BUTTON);

        this.current = {};
        this.current.perPage = C.PER_PAGE || CD.PER_PAGE;
        this.current.page = 0;

        this.actions = this.actions.map(_.bind(function (value) {

            return {
                label: i18nLabels['action_' + value] || "Missing action label [" + value + "]",
                action: value
            }

        }, this));

    };

    Catalog.prototype._enableMenuItem = function (selector) {

        this._getMenuItemBySelector(selector).attr("disabled", false);
    };

    Catalog.prototype._disableMenuItem = function (selector) {

        this._getMenuItemBySelector(selector).attr("disabled", true);
    };

    Catalog.prototype._getMenuItemBySelector = function (selector) {

        return this.$items.filter("[data-selector='" + selector + "']");
    };

    Catalog.prototype._bindEventListeners = function () {

        var self = this;

        this.$items.on("click", function (e) {
            e.preventDefault();

            var selector = $(e.target).data("selector");

            log.info("Select selector: " + selector);

            self.selectSelector(selector);

            self._hideError();

        });

        this.$submit.on("click", _.bind(this._onSubmitClick, this));

        this.$reset.on("click", _.bind(this._onResetClick, this));

        this.filter.on('ready', _.bind(function () {

            log.info("Filter is ready");

            this._unlock();

        }, this));

        this.filter.on('remove', _.bind(function (item) {

            log.info("Remove from filter: " + item.id);

            this._enableMenuItem(item.id);
        }, this));

        this.filter.on('change', _.bind(function () {
            log.info("Change from filter");

            this._hideError();
        }, this));

        amplify.subscribe(this._getEventName("select"), this, this._onSelectResult);
        amplify.subscribe(this._getEventName("download"), this, this._onDownloadResult);
        amplify.subscribe(this._getEventName("view"), this, this._onViewResult);
    };

    Catalog.prototype.selectSelector = function (selector) {

        this._disableMenuItem(selector);

        this._addSelector(selector);

    };

    Catalog.prototype._unlock = function () {
        this.$submit.attr("disabled", false);
        this.$reset.attr("disabled", false);
    };

    Catalog.prototype._lock = function () {
        this.$submit.attr("disabled", true);
        this.$reset.attr("disabled", true);
    };

    Catalog.prototype._addSelector = function (selector) {

        var config = this._getSelectorConfiguration(selector);

        this.filter.add(config);
    };

    Catalog.prototype._getSelectorConfiguration = function (selector) {

        if (!SelectorsRegistry.hasOwnProperty(selector)) {
            log.error("Impossible to find selector in registry: " + selector);
            return;
        }

        var config = {};
        config[selector] = $.extend(true, {}, SelectorsRegistry[selector]);

        if (!config[selector].template) {
            config[selector].template = {};
        }

        config[selector].template.title = i18nLabels[selector] || "Missing title";

        return $.extend(true, {}, config);

    };

    Catalog.prototype._onSubmitClick = function () {

        this._hideError();

        if (this.filter && !$.isFunction(this.filter.getValues)) {
            log.error("Filter.getValues is not a fn()");
            return;
        }

        this.current.values = this.filter.getValues("catalog");

        var valid = this._validateQuery();

        if (valid === true) {
            this._search();
        } else {
            this._showError(valid);
        }

    };

    Catalog.prototype._validateQuery = function () {

        var valid = true,
            errors = [];

        if ($.isEmptyObject(this.current.values)) {
            errors.push(ERR.empty_values);
            log.error(ERR.empty_values);
        }

        return errors.length > 0 ? errors : valid;
    };

    Catalog.prototype._onResetClick = function () {

        this.reset();
    };

    Catalog.prototype._initFilter = function () {

        log.info("Filter instantiation");

        this.filter = new Filter({
            $el: s.FILTER,
            items: this._getDefaultSelectors(),
            summary$el: s.SUMMARY,
            //summaryRender : function (item ){ return " -> " + item.code; },
            common: {
                template: {
                    hideHeader: false,
                    hideRemoveButton: false
                },
                selector: {
                    hideFooter: true
                },
                className: "col-xs-6"
            }
        });


    };

    Catalog.prototype._getDefaultSelectors = function () {

        var self = this,
            items = {};

        _.each(this.defaultSelectors, function (selector) {
            items = $.extend(true, {}, items, self._getSelectorConfiguration(selector));
        });

        log.info("Default items: " + JSON.stringify(items));

        return items;

    };

    Catalog.prototype._resetResults = function () {

        this._setBottomStatus('intro');

        this._unbindResultsEventListeners();

    };

    //Request

    Catalog.prototype._search = function () {

        var self = this,
            body = this.current.values;

        this._setBottomStatus("loading");

        this._lock();

        this._getPromise(body).then(
            _.bind(this._renderResults, this),
            function (e) {
                self._setBottomStatus("error");
                log.error(e);
                self._unlock();
                self._showError(ERR.request);
            });

    };

    Catalog.prototype._setBottomStatus = function (status) {

        log.info("Set status to: " + status);

        this.$el.find(s.BOTTOM).attr('data-status', status);

    };

    Catalog.prototype._getPromise = function (body) {

        var serviceProvider = C.SERVICE_PROVIDER || CD.SERVICE_PROVIDER,
            filterService = C.FILTER_SERVICE || CD.FILTER_SERVICE;

        return Q($.ajax({
            url: serviceProvider + filterService + queryParams(body),
            type: "POST",
            contentType: "application/json",
            data: JSON.stringify($.extend(true, {}, this.baseFilter, body)),
            dataType: 'json'
        }));

        function queryParams(body) {

            //return '?full=true&page=' + body.page + '&perPage=' + body.perPage;
            return '?full=true';

        }
    };

    Catalog.prototype._renderResults = function (data) {

        this.current.data = data;

        this._setBottomStatus('ready');

        this._unlock();

        this._updatePagination();

        this._renderPerPage();

    };

    Catalog.prototype._updatePagination = function () {

        var self = this;

        this.$el.find(s.PAGINATION).bootpag({
            total: Math.ceil(this.current.data.length / this.current.perPage),
            maxVisible: 5
        }).on("page", function (event, num) {

            self.current.page = num - 1;

            self._renderPerPage();
        });
    };

    Catalog.prototype._renderPerPage = function () {

        var from = this.current.page * this.current.perPage,
            to = ( this.current.page * this.current.perPage ) + this.current.perPage,
            result = this.current.data.slice(from, to);

        //unbind events listeners
        this._unbindResultsEventListeners();

        //render template
        var template = Handlebars.compile($(Templates).find(s.RESULTS)[0].outerHTML),
            model = $.extend(true, {}, i18nLabels, {results: result, actions: this.actions}),
            $html = $(template(model));

        //bind events listeners
        this._bindResultsEventListeners($html);

        this.$el.find(s.RESULTS_CONTAINER).html($html);

    };

    Catalog.prototype._unbindResultsEventListeners = function () {
        this.$el.find(s.RESULT).find("[data-action]").off();
    };

    Catalog.prototype._bindResultsEventListeners = function ($html) {

        var self = this;

        $html.find("[data-action]").each(function () {

            var $this = $(this),
                action = $this.data("action"),
                event = self._getEventName(action),
                rid = $this.data("rid");

            $this.on("click", {event: event, catalog: self, rid: rid}, function (e) {
                e.preventDefault();

                log.info("Result raise event: " + e.data.event);

                var model = _.findWhere(self.current.data, {rid: rid});

                amplify.publish(event, {target: this, catalog: e.data.catalog, rid: rid, model: model});

            });
        });
    };

    // Handlers

    Catalog.prototype._onSelectResult = function (payload) {

        log.info("Select result: " + JSON.stringify(payload));

        this._trigger('select', payload);

    };

    Catalog.prototype._onDownloadResult = function (payload) {

        log.info("Download result: " + JSON.stringify(payload));

        this._trigger('download', payload);

    };

    Catalog.prototype._onViewResult = function (payload) {

        log.info("View result: " + JSON.stringify(payload));

        this._trigger('view', payload);
    };

    Catalog.prototype._getEventName = function (evt, excludeId) {

        var baseEvent = EVT[evt] ? EVT[evt] : evt;

        return excludeId === true ? baseEvent : baseEvent + "." + this.id;
    };

    //disposition

    Catalog.prototype._unbindEventListeners = function () {

        this.$items.off();

        this.$submit.off();

        this.$reset.off();

        amplify.unsubscribe(this._getEventName("select"), this._onSelectResult);
        amplify.unsubscribe(this._getEventName("download"), this._onDownloadResult);
        amplify.unsubscribe(this._getEventName("view"), this._onViewResult);

    };

    Catalog.prototype._registerHandlebarsHelpers = function () {

        Handlebars.registerHelper('isOpened', function (opened) {
            return opened === true ? 'in' : '';
        });

    };

    Catalog.prototype._showError = function (err) {

        _.each(err, _.bind(function ( e ) {

            var $li = $("<li>"+i18nLabels[e]+"</li>");

            this.$el.find(s.ERROR_CONTAINER).show().append($li);

        }, this));
    };

    Catalog.prototype._hideError = function () {

        this.$el.find(s.ERROR_CONTAINER).hide();
    };

    return Catalog;
});