'use strict';

/************************************************************
 * basic controller for lc,
 * All controller on this site should inherit from this one
 ************************************************************/

if (!window.RouteCtrls) {
    window.RouteCtrls = {};
}

RouteCtrls.Basic = RouteController.extend({
    super: function (method) {
        return this.constructor.__super__[method].call(this);
    },
    headerView: null,
    headerShellView: 'defaultSubHeader',
    subscriptions: function () {
        return [];
    },
    action: function () {
        if (this.headerView) {
            this.render(this.headerShellView, {
                to: 'headerShell'
            });
            this.render(this.headerView, {
                to: 'header',
                data: this.data
            });
        }
        this.render();
    }
});

UniCMS.Controller = RouteCtrls.Basic.extend();
