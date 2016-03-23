'use strict';

Template.layoutFooter.events({
    'click .js-search-toggle': function () {
        $('.search-form').toggle();
    }
});
