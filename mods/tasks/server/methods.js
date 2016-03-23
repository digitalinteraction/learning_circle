'use strict';

Meteor.methods({
    taskApproval: function (taskId, userId, operation) {
        check(taskId, String);
        check(userId, String);
        check(operation, String);
        var loggedInUser = Meteor.user();
        if (!loggedInUser || !Roles.userIsInRole(loggedInUser, ['global_mentor', 'global_admin'])) {
            throw new Meteor.Error(403, 'Access denied');
        }
        if (operation === 'approve') {
            Blog.getCollection().update({taskId: taskId, ownerId: userId}, {$set: {status: 'published'}});
            Meteor.users.update({_id: userId}, {$addToSet: {tasksApproved: taskId}, $pull: {tasksRejected: taskId}});
        }
        if (operation === 'reject') {
            Blog.getCollection().update({taskId: taskId, ownerId: userId}, {$set: {status: 'draft-unpublished'}});
            Meteor.users.update({_id: userId}, {$addToSet: {tasksRejected: taskId}, $pull: {tasksApproved: taskId}});
        }
    },
    taskApprovalClear: function (taskId) {
        check(taskId, String);
        Meteor.users.update({_id: Meteor.userId()}, {$pull: {tasksRejected: taskId, tasksApproved: taskId}});
    },
    checkTasksDeadlines: function () {
        Colls.Tasks.find({}).forEach(function (task) {
            if (moment(task.deadline).isBefore(new Date()) && !UniRiver.Activities.findOne({'o._id': task._id})) {
                UniRiver.addActivity('taskDeadline', {
                    _id: task._id,
                    title: task.title,
                    type: task.type,
                    description: task.description,
                    deadline: task.deadline,
                    courseId: task.course
                }, {_id: null, name: null});
            }
        });
    },
    deleteTask: function (taskId) {
        check(taskId, String);
        var task = Colls.Tasks.findOne(taskId),
            course;
        if (task) {
            course = Colls.Courses.findOne(task.course);
            if (this.userId && Roles.userIsInRole(this.userId, 'community_admin', course.community_id)) {
                Colls.Tasks.remove({_id: taskId});
            }
        }
        this.ready;
    }
});
