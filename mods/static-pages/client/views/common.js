'use strict';

Template.staticAboutSidebar.helpers({
    isActive: function (str) {
        return this.active === str ? 'active' : '';
    }
});

Template.registerHelper('repeat', function (count) {
    return _.range(count);
});
