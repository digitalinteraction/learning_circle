'use strict';

var _toggleSearch = function () {
    $('.search-form').slideToggle();
};

Template.headerWithSearch.events({
    'click .js-search-toggle': function () {
        _toggleSearch();
    }
});

Template.headerWithSearch2.events({
    'click .js-search-toggle': function () {
        _toggleSearch();
    }
});
