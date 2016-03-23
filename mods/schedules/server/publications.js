'use strict';
Meteor.publish('courseSchedules', function (courseId) {
    if (this.userId && Roles.userIsInRole(this.userId, ['course_student', 'course_mentor', 'global_admin'], courseId)) {
        return Colls.Schedules.find({courseId: courseId});
    }
    return [];
});
