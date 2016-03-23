'use strict';

var startingLimit = 6;
var loadMoreLimit = 6;

Template.projectListing.onCreated(function () {
    var limit = this.limit = new ReactiveVar(startingLimit);

    // reset search
    Project.Search.search(null, {
        activeFilter: circleConcept.getFilter(),
        activeCourseId: circleConcept.getActiveCourse(),
        limit: limit.get()
    });
    this.autorun(function () {
        var activeCourseId = circleConcept.getActiveCourse();
        var activeFilter = circleConcept.getFilter();
        var activeLimit = limit.get();
        Tracker.nonreactive(function () {
            Project.Search.search(Project.Search.getCurrentQuery() || null, {
                activeFilter: activeFilter,
                activeCourseId: activeCourseId,
                limit: activeLimit
            });
        });
    });
});

Template.projectListing.events({
    'keyup .js-search-source': _.debounce(function (e, t) {
        var text = e.target.value.trim();
        t.limit.set(startingLimit); // reset limit after each search

        Project.Search.search(text, {
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

Template.projectListing.helpers({
    searchStatus: function () {
        return Project.Search.getStatus();
    },
    items: function () {
        return Project.Search.getData({
            docTransform: Project.getCollection()._transform
        });
    },
    showMore: function () {
        try {
            return Project.Search.getMetadata().showMore;
        } catch (e) {
            return false;
        }
    }
});

Template.projectListingItem.onRendered(function () {
    this.$('.js-ellipsis-title').dotdotdot({
        height: 28,
        wrap: 'letter'
    });
    this.$('.js-ellipsis-brief').dotdotdot({
        height: 180
    });
    this.$('.js-ellipsis-content').dotdotdot({
        height: 150
    });
});

Template.projectListingItem.helpers({
    purifiedContent: function () {
        return UniHTML.purify(this.doc.content, {withoutTags: ['p', 'span', 'a', 'em', 'table', 'tbody', 'tr', 'th', 'td', 'br/', 'br', 'b', 'i', 'u', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'h7']});
    }
});
