define([
    "jquery",
    "fx-cat-br/widgets/Fx-widgets-commons",
    "jqwidgets",
    "amplify"
], function ($, W_Commons) {

    var o = {
        lang: 'EN',
        events: {
            READY: "fx.catalog.module.ready",
            DESELECT: 'fx.catalog.module.deselect.'
        }
    }, w_commons;

    function Fx_ui_w_referencePeriod() {
        w_commons = new W_Commons();
    }

    Fx_ui_w_referencePeriod.prototype.validate = function (e) {

        if (!e.hasOwnProperty("source")) {
            throw new Error("ELEM_NOT_SOURCE");
        }

        return true;
    };

    Fx_ui_w_referencePeriod.prototype.bindEventListeners = function () {

        var that = this;

/*        document.body.addEventListener(o.events.DESELECT + o.module.type, function (e) {
            that.deselectValue(e.detail);
        }, false);*/

        amplify.subscribe(o.events.DESELECT + o.module.type,function (e) {
            that.deselectValue(e);
        } );
    };

    Fx_ui_w_referencePeriod.prototype.render = function (e, container) {

        o.container = container;
        o.module = e;

        this.bindEventListeners();
        this.getCodelist();

    };

    Fx_ui_w_referencePeriod.prototype.getCodelist = function () {

        var body = {
            uid: o.module.component.source.uid
        };

        if (o.module.component.source.version) {
            body['version'] = o.module.component.source.version;
        }

        $.ajax({
            type: "POST",
            contentType: "application/json",
            url: o.module.component.source.url,
            data: JSON.stringify(body),
            dataType: "json",
            success: $.proxy(this.printList, this),
            error: function () {
                alert("Fx_ui_w_referencePeriod error: impossible to load codelist");
            }
        });

    };

    Fx_ui_w_referencePeriod.prototype.printList = function (data) {

        var source = $.extend({datatype: "json", localdata: data}, o.module.component.source);
        var dataAdapter = new $.jqx.dataAdapter(source);

        $(o.container).jqxListBox($.extend({ source: dataAdapter}, o.module.component.rendering))
            .on('change', {container: o.container }, function (event) {
                var selected = $(event.data.container).jqxListBox("getSelectedItems"),
                    payload = [];

                for (var i = 0; i < selected.length; i++) {
                    payload.push({label: selected[i].label, value: selected[i].value })
                }

                amplify.publish( o.events.READY,
                    { value: payload,
                        module: o.module.type });

              /*  w_commons.raiseCustomEvent(
                    o.container,
                    o.events.READY,
                    { value: payload,
                        module: o.module.type }
                );*/
            });

    };

    Fx_ui_w_referencePeriod.prototype.deselectValue = function (obj) {
        var item = $(o.container).jqxListBox('getItemByValue', obj.value);
        $(o.container).jqxListBox('unselectItem', item);
    };

    Fx_ui_w_referencePeriod.prototype.getValue = function (e) {

        var codes = $("#" + e.id).jqxListBox('val').split(','),
            uid = e.details.cl.uid,
            version = e.details.cl.version;

        return {
            codes: [{
                uid: uid,
                version: version,
                codes: codes
            }]
        };
    };

    return Fx_ui_w_referencePeriod;
});