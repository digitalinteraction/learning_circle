'use strict';

Meteor.methods({
    markAsRead: function (taskId, courseId) {
        var userId, count;
        check(taskId, String);
        check(courseId, String);
        userId = Meteor.userId();
        count = Colls.Reading.find({
            ownerId: userId,
            taskId: taskId,
            courseId: courseId
        }).count();
        if (!count) {
            count = Colls.Reading.insert({
                ownerId: userId,
                taskId: taskId,
                courseId: courseId
            });
            return true;
        }
    }
});
