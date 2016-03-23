'use strict';

RouteCtrls.StaticPage = RouteCtrls.Basic.extend({
    headerView: true,
    action: function () {
        this.super('action');

        if (this.params.slug) {
            this.render('static.' + this.params.slug);
        }
    }
});
