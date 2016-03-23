'use strict';

Meteor.methods({
    getCourseParticipantsCount: function (courseId) {
        check(courseId, String);
        return UniUsers.find({'courses': courseId}).count();
    }
});
