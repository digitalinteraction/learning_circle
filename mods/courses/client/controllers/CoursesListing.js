'use strict';

RouteCtrls.CoursesListing = RouteCtrls.Basic.extend({
    headerView: 'coursesListingHeader',
    subscriptions: function () {
        return [
            Meteor.subscribe('courses')
        ];
    },
    data: function () {
        return {
            courses: Colls.Courses.find({}, {fields: {
                title: 1,
                description: 1,
                startDate: 1,
                endDate: 1,
                image: 1
            }})
        };
    }
});
