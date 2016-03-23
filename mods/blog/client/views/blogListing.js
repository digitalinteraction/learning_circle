'use strict';

var startingLimit = 6;
var loadMoreLimit = 6;

Template.blogListing.onCreated(function () {
    var limit = this.limit = new ReactiveVar(startingLimit);

    // initiate the search to show standard results
    Blog.Search.search(null, {
        activeFilter: circleConcept.getFilter(),
        activeCourseId: circleConcept.getActiveCourse(),
        limit: limit.get()
    });

    this.autorun(function () {
        var activeCourseId = circleConcept.getActiveCourse();
        var activeFilter = circleConcept.getFilter();
        var activeLimit = limit.get();
        Tracker.nonreactive(function () {
            Blog.Search.search(Blog.Search.getCurrentQuery() || null, {
                activeFilter: activeFilter,
                activeCourseId: activeCourseId,
                limit: activeLimit
            });
        });
    });
});

Template.blogListing.events({
    'keyup .js-search-source': _.debounce(function (e, t) {
        var text = e.target.value.trim();
        t.limit.set(startingLimit); // reset limit after each search

        Blog.Search.search(text, {
            activeFilter: circleConcept.getFilter(),
            activeCourseId: circleConcept.getActiveCourse(),
            limit: t.limit.get()
        });
    }, 200),
    'click .js-load-more': function (e, t) {
        // very dirty hack :(
        var container = t.$('.js-keep-height');
        container.css({
            'min-height': container.height()
        });

        t.limit.set(t.limit.get() + loadMoreLimit);
    }
});

Template.blogListing.helpers({
    searchStatus: function () {
        return Blog.Search.getStatus();
    },
    items: function () {
        return Blog.Search.getData({
            docTransform: Blog.getCollection()._transform
        });
    },
    showMore: function () {
        try {
            return Blog.Search.getMetadata().showMore;
        } catch (e) {
            return false;
        }
    }
});

Template.blogListingItem.onRendered(function () {
    this.$('.js-ellipsis-title').dotdotdot({
        height: 28,
        wrap: 'letter'
    });
    this.$('.js-ellipsis-brief').dotdotdot({
        height: 150
    });
});
