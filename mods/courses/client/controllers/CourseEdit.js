'use strict';

RouteCtrls.CourseEdit = RouteCtrls.Basic.extend({
    subscriptions: function () {
        return Meteor.subscribe('course', this.params.courseId);
    },
    data: function () {
        return {
            course: Colls.Courses.findOne({_id: this.params.courseId})
        };
    }
});
