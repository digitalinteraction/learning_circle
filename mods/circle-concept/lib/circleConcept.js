'use strict';
(Meteor.isClient ? window : global).circleConcept = {
    collectionQueries: {},
    getQuery: function (query, collectionName, params) {
        var collectionQuery = this.collectionQueries[collectionName];
        var activeQuery;
        params = params || {};

        _(params).defaults({
            activeFilter: this.getFilter(),
            activeCourseId: this.getActiveCourse()
        });

        if (!collectionQuery) {
            console.warn('Collection ' + collectionName + ' is not registered in circleConcept');
            return query;
        }

        activeQuery = collectionQuery[params.activeFilter].getQuery(params);
        collectionQuery[params.activeFilter].filterBy.forEach(function (filter) {
            if (filter) {
                query[filter] = activeQuery[filter];
            }
        });
        return query;
    },
    getFilter: function () {
        var defaultFilter = Meteor.userId() && UniUtils.get(Meteor.user(), 'participate') ? 'course' : 'public';
        if (Meteor.isClient) {
            return Session.get('activeCircleConcept') || defaultFilter;
        }
        return defaultFilter;
    },
    setFilter: function (type) {
        if (typeof type === 'string') {
            if (Meteor.isClient) {
                Session.set('activeCircleConcept', type);
            }
        }
    },
    setActiveCourse: function (activeCourseId) {
        if (Meteor.isClient) {
            Session.set('activeCourseId', activeCourseId);
        }
    },
    getActiveCourse: function () {
        if (Meteor.isClient) {
            return Session.get('activeCourseId');
        }
        return null;
    },
    registerCollectionQuery: function (collectionName, queryAttributes) {
        this.collectionQueries[collectionName] = queryAttributes;
    },
    switchNext: function () {
        var filters = ['profile', 'group', 'course', 'public'];
        circleConcept.setFilter(filters[(filters.indexOf(circleConcept.getFilter()) + 1) % filters.length]);
    },
    cleanQuery: function (query, collectionName) {
        var collectionQuery = this.collectionQueries[collectionName];
        var filters = [];
        var results = {};
        if (!collectionQuery) {
            console.warn('Collection ' + collectionName + ' is not registered in circleConcept');
            return query;
        }

        _.map(collectionQuery, function (val, key) {
            filters = _.union(filters, val.filterBy);
        });

        _.map(query, function (val, key) {
            if (!_.contains(filters, key)) {
                results[key] = query[key];
            }
        });
        return results;
    }
};

circleConcept.registerCollectionQuery('Project', {
    profile: {
        filterBy: ['ownerId'],
        getQuery: function () {
            var userId = Meteor.userId();
            return {ownerId: userId};
        }
    },
    group: {
        filterBy: ['ownerId', 'courseId'],
        getQuery: function (params) {
            var courseId = params.activeCourseId;
            var userId = Meteor.userId();
            var group = Colls.Groups.findOne({course: courseId, users: userId}, {fields: {course: 1, users: 1}});
            var users = UniUtils.get(group, 'users') || [userId];
            return {ownerId: {$in: users}, courseId: courseId};
        }
    },
    course: {
        filterBy: ['courseId'],
        getQuery: function (params) {
            var courseId = params.activeCourseId;
            return {courseId: courseId};
        }
    },
    public: {
        filterBy: ['public'],
        getQuery: function () {
            return {public: true};
        }
    }
});


circleConcept.registerCollectionQuery('Blog', {
    profile: {
        filterBy: ['ownerId'],
        getQuery: function () {
            var userId = Meteor.userId();
            return {ownerId: userId};
        }
    },
    group: {
        filterBy: ['ownerId', 'courseId'],
        getQuery: function (params) {
            var courseId = params.activeCourseId;
            var userId = Meteor.userId();
            var group = Colls.Groups.findOne({course: courseId, users: userId}, {fields: {course: 1, users: 1}});
            var users = UniUtils.get(group, 'users') || [userId];
            return {ownerId: {$in: users}, courseId: courseId};
        }
    },
    course: {
        filterBy: ['courseId'],
        getQuery: function (params) {
            var courseId = params.activeCourseId;
            return {courseId: courseId};
        }
    },
    public: {
        filterBy: ['public'],
        getQuery: function () {
            return {public: true};
        }
    }
});


circleConcept.registerCollectionQuery('Activities', {
    profile: {
        filterBy: ['actor._id', 'o.courseId'],
        getQuery: function (params) {
            var userId = Meteor.userId();
            var courseId = params.activeCourseId
            return {'actor._id': userId, 'o.courseId': courseId};
        }
    },
    group: {
        filterBy: ['actor._id', 'o.courseId'],
        getQuery: function (params) {
            var courseId = params.activeCourseId;
            var userId = Meteor.userId();
            var group = Colls.Groups.findOne({course: courseId, users: userId}, {fields: {course: 1, users: 1}});
            var users = UniUtils.get(group, 'users') || [userId];
            return {'actor._id': {$in: users}, 'o.courseId': courseId};
        }
    },
    course: {
        filterBy: ['o.courseId'],
        getQuery: function (params) {
            var courseId = params.activeCourseId;
            return {'o.courseId': courseId};
        }
    },
    public: {
        filterBy: ['o.public'],
        getQuery: function () {
            return {'o.public': true};
        }
    }
});
