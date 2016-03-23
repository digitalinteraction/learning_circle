'use strict';

Template.resourcesListing.created = function () {
    Iron.controller().state.set('count', 2);
};

Template.resourcesListing.helpers({
    count: function () {
        return Iron.controller().state.get('count') || 2;
    }
});

Template.resourcesListing.events({
    'click .js-load-more': function () {
        var state = Iron.controller().state;
        var count = state.get('count');
        state.set('count', count + 2);
    }
});
