'use strict';

RouteCtrls.ApplyMentorView = RouteCtrls.Basic.extend({
    subscriptions: function () {
        return [
            Meteor.subscribe('course', this.params.courseId)
        ];
    }
});
