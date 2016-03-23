'use strict';

RouteCtrls.TasksEdit = RouteCtrls.Basic.extend({
    headerView: 'tasksEditHeader',
    subscriptions: function () {
        return [
            Meteor.subscribe('singleTask', this.params._id, {}),
            Meteor.subscribe('course', this.params.courseId)
        ];
    },
    data: function () {
        return {
            task: Colls.Tasks.findOne({_id: this.params._id})
        };
    }
});
