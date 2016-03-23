'use strict';

var checkUserRole = function (user, roles) {
    var currentCourseId = Session.get('activeCourseId');
    if (user && _.isArray(roles) && currentCourseId) {
        return Roles.userIsInRole(user, roles, currentCourseId);
    }
};

Template.consoleViewMentorsTab.helpers({
    getAllMentorsInCourse: function () {
        var currentCourseContextId = Session.get('activeCourseId');
        var mentors = [];
        var userMentorCourses;
        if (currentCourseContextId && Roles.userIsInRole(UniUsers.getLoggedIn(), 'global_admin')) {
            UniUsers.find().forEach(function (user) {
                userMentorCourses = UniUtils.get(user, 'mentorshipCourses');
                if (_.isArray(userMentorCourses) && userMentorCourses.indexOf(currentCourseContextId) !== -1) {
                    mentors.push(user);
                }
            });
        }
        return mentors;
    },
    getAllstudentChairsInCourse: function () {
        var currentCourseContextId = Session.get('activeCourseId');
        var studentChairs = [];
        var studentChairCourses;
        if (currentCourseContextId && Roles.userIsInRole(UniUsers.getLoggedIn(), 'global_admin')) {
            UniUsers.find().forEach(function (user) {
                studentChairCourses = UniUtils.get(user, 'courses');
                if (_.isArray(studentChairCourses)
                    && Roles.userIsInRole(user, 'course_student-chair', currentCourseContextId)
                    && studentChairCourses.indexOf(currentCourseContextId) !== -1) {
                    studentChairs.push(user);
                }
            });
        }
        return studentChairs;
    },
    isPendingMentor: function () {
        return !checkUserRole(this, ['course_mentor']);
    }
});

Template.consoleViewMentorsTab.events({
    'click .js-approve-mentor': function (e) {
        e.preventDefault();
        var targetUserId = this._id;
        var currentCourseId = Session.get('activeCourseId');
        if (_.isString(targetUserId) && _.isString(currentCourseId)) {
            Meteor.call('adminUpdateRoles', targetUserId, 'course_mentor', currentCourseId);
            Meteor.call('adminUpdateRoles', targetUserId, 'global_mentor', Roles.GLOBAL_GROUP);
        }
    }
});
