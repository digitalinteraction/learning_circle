'use strict';

RouteCtrls.ApplyView = RouteCtrls.Basic.extend({
    subscriptions: function () {
        return [
            Meteor.subscribe('course', this.params.courseId)
        ];
    }
});
