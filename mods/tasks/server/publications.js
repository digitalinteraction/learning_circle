'use strict';

Meteor.publish('tasksList', function (courseId) {
    check(courseId, String);
    if (this.userId && Roles.userIsInRole(this.userId, ['course_student', 'course_mentor', 'global_admin'], courseId)) {
        return Colls.Tasks.find({course: courseId});
    }
    return this.ready();
});

Meteor.publish('tasksListWithBlogsAndProjects', function (courseId) {
    check(courseId, String);
    var tasks = Colls.Tasks.find({course: courseId});
    var taskIds = tasks.map(function (task) {
        return task._id;
    });
    if (this.userId && Roles.userIsInRole(this.userId, ['course_student', 'course_mentor', 'global_admin'], courseId)) {
        return [
            tasks,
            Blog.find({taskId: {$in: taskIds}}, {
                fields: {
                    title: 1,
                    ownerId: 1,
                    status: 1,
                    disabled: 1,
                    taskId: 1
                }
            }),
            Project.find({taskId: {$in: taskIds}}, {
                fields: {
                    title: 1,
                    ownerId: 1,
                    status: 1,
                    disabled: 1,
                    taskId: 1
                }
            }),
            Colls.Reading.find({taskId: taskIds})
        ];
    }
    return this.ready();
});

Meteor.publish('singleTask', function (id, fields) {
    check(id, String);
    return Colls.Tasks.find({_id: id}, {
        limit: 1,
        fields: fields || {title: 1, description: 1}
    });
});
