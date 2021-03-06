/* global define*/

define([
    "jquery",
    "fx-cat-br/widgets/Fx-widgets-commons",
    "jstree",
    "amplify"
], function ($, W_Commons) {

    'use strict';

    var o = {
        lang: 'EN',
        events: {
            READY: "fx.catalog.module.ready",
            DESELECT: 'fx.catalog.module.deselect.'
        }
    }, w_commons;

    function Fx_ui_w_geographicExtent() {
        w_commons = new W_Commons();
    }

    Fx_ui_w_geographicExtent.prototype.validate = function (e) {

        if (!e.hasOwnProperty("source")) {
            throw new Error("ELEM_NOT_SOURCE");
        } else {
            if (!e.source.hasOwnProperty("datafields")) {
                throw new Error("ELEM_NOT_DATAFIELDS");
            }
        }

        return true;
    };

    Fx_ui_w_geographicExtent.prototype.processData = function (data) {

        var r = [];

        $(data).each(function (index, item) {

            r.push({"text": item.title.EN, "id": item.code, "children": true});
        });

        return r;
    };

    Fx_ui_w_geographicExtent.prototype.getFirstCall = function (o, cb) {

        var self = this,
            body = {
                uid: o.component.source.uid,
                level: 1,
                levels: 1
            };

        if (o.component.source.version) {
            body.version= o.component.source.version;
        }

        $.ajax({
            type: "POST",
            contentType: "application/json",
            url: o.component.source.url,
            data: JSON.stringify(body),
            dataType: "json",
            success: function (data) {
                if (data){
                    cb(self.processData(data));
                }
            },
            error: function () {
                alert("Fx_ui_w_geographicExtent error: impossible to load codelist");
            }
        });
    };

    Fx_ui_w_geographicExtent.prototype.getChildren = function (o, node, cb) {

        var self = this,
            body = {
                uid: o.component.source.uid,
                level: 1,
                levels: 2,
                codes: [node.id]
            };

        if (o.component.source.version) {
            body['version'] = o.component.source.version;
        }

        $.ajax({
            type: "POST",
            contentType: "application/json",
            url: o.component.source.url,
            data: JSON.stringify(body),
            dataType: "json",
            success: function (data) {
                if (data){
                    cb(self.processData(data[0].children|| []));
                } else {
                    cb([]);
                }

            },
            error: function () {
                alert("Fx_ui_w_geographicExtent error: impossible to load codelist");
            }
        });
    };

    Fx_ui_w_geographicExtent.prototype.render = function (e, container) {

        var self = this;

        o.container = container;
        o.module = e;

        this.$treeContainer = $('<div class="jstree-holder"></div>');
        //this.$searchForm = $('<form id="s"><input type="search" id="q" /><input class="sel_all" type="button" value="sel all"><input class="desel_all" type="button" value="desel all"></form>');
        this.$searchForm = $('<form id="s"><input type="search" id="q" class="form-control" /></form>');

        this.$container = $(container);
        this.$container.append(this.$searchForm);
        this.$container.append(this.$treeContainer);

        this.$treeContainer.jstree({

            'core': {
                'data': function (node, cb) {
                    if (node.id === "#") {
                        self.getFirstCall(e, cb);
                    }
                    else {
                        self.getChildren(e, node, cb);
                    }
                },
                "multiple": false,
                "animation": 0,
                "themes": {"stripes": true}
            },
           /* themes: {
                icons: false
            },*/
        "plugins": ["checkbox", "wholerow", "search"],
            "search": {
                show_only_matches: true
            }
        });

        var to = false;
        this.$searchForm.find('#q').keyup(function () {
            if (to) {
                clearTimeout(to);
            }
            to = setTimeout(function () {
                var v = self.$searchForm.find('#q').val();
                self.$treeContainer.jstree(true).search(v);
            }, 250);
        });

        this.$treeContainer.on("changed.jstree", function (e, data) {

            var i, j, r = [];
            for (i = 0, j = data.selected.length; i < j; i++) {
                r.push({label: data.instance.get_node(data.selected[i]).text, value: data.instance.get_node(data.selected[i])});
            }

            amplify.publish( o.events.READY,
                { value: r,
                    module: o.module.type });


           /* w_commons.raiseCustomEvent(
                o.container,
                o.events.READY,
                { value: r,
                    module: o.module.type }
            );*/
        });

        this.$searchForm.find('.sel_all').on('click', function () {
            self.$treeContainer.jstree(true).select_all();
        });

        this.$searchForm.find('.desel_all').on('click', function () {
            self.$treeContainer.jstree(true).deselect_all();
        });

        this.bindEventListeners();

    };

    Fx_ui_w_geographicExtent.prototype.bindEventListeners = function () {

        var that = this;

        amplify.subscribe(o.events.DESELECT + o.module.type,function (e) {
            that.deselectValue(e);
        } );


       /* document.body.addEventListener(o.events.DESELECT + o.module.type, function (e) {
            that.deselectValue(e.detail);
        }, false);*/
    };

    Fx_ui_w_geographicExtent.prototype.deselectValue = function (obj) {
        this.$treeContainer.jstree('deselect_node', [ obj.value]);
        this.$treeContainer.jstree(true).deselect_node([ obj.value]);


    };

    Fx_ui_w_geographicExtent.prototype.getValue = function (e) {

        var codes = $("#" + e.id).find('.jstree-holder').jstree(true).get_selected(),
            uid = e.details.cl.uid,
            version = e.details.cl.version;

        return {
            codes: [
                {
                    uid: uid,
                    version: version,
                    codes: codes
                }
            ]
        };
    };

    return Fx_ui_w_geographicExtent;
});