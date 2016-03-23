'use strict';

var checkUserRole = function (user, roles) {
    var currentCourseId = Session.get('activeCourseId');
    if (user && _.isArray(roles) && currentCourseId) {
        return Roles.userIsInRole(user, roles, currentCourseId);
    }
};

Template.registerHelper('getChoosenGroupLabel', function () {
    return Session.get('activeGroupLabel');
});

Template.registerHelper('getAllUsersInGroup', function () {
    var groupId = Session.get('activeGroupId');
    var courseId = Session.get('activeCourseId');
    var group = groupId && Colls.Groups.findOne({_id: groupId});
    var groupUsers = group && group.users;
    if (_.isArray(groupUsers)) {
        return {
            students: Meteor.users.find({_id: {$in: groupUsers}, courses: courseId}),
            mentors: Meteor.users.find({_id: {$in: groupUsers}, mentorshipCourses: courseId})
        };
    }
});

// TODO: refactor
Template.consoleViewGroupsTab.onRendered(function () {
    var groupId;
    var groupLabel;
    this.autorun(function () {
        if (Session.get('activeCourseId')) {
            Meteor.defer(function () {
                groupId = this.$('.js-choose-group').val();
                groupLabel = this.$('.js-choose-group').find('option[value="' + groupId + '"]').text();
                if (groupId && groupLabel) {
                    Session.set('activeGroupId', groupId);
                    Session.set('activeGroupLabel', groupLabel);
                }
            }.bind(this));
        }
    }.bind(this));
});

Template.consoleViewGroupsTab.helpers({
    isStudentChair: function () {
        return checkUserRole(this, ['course_student-chair']);
    },
    waitingForApproval: function () {
        return !checkUserRole(UniUsers.getLoggedIn(), ['course_student', 'course_mentor', 'course_student-chair', 'global_admin']);
    },
    canGrantStudentChair: function () {
        return checkUserRole(UniUsers.getLoggedIn(), ['course_student-chair', 'course_mentor', 'global_admin']);
    }
});

Template.consoleViewGroupsTabUsers.helpers({
    isStudentChair: function () {
        return checkUserRole(this, ['course_student-chair']);
    },
    waitingForApproval: function () {
        return !checkUserRole(UniUsers.getLoggedIn(), ['course_student', 'course_mentor', 'course_student-chair', 'global_admin']);
    },
    canGrantStudentChair: function () {
        return checkUserRole(UniUsers.getLoggedIn(), ['course_student-chair', 'course_mentor', 'global_admin']);
    }
});

Template.consoleViewGroupsTabUsers.events({
    'click .js-grant-student-chair-role': function (e) {
        e.preventDefault();
        var targetUserId = this._id;
        var currentCourseId = Session.get('activeCourseId');
        if (_.isString(targetUserId) && _.isString(currentCourseId)) {
            Meteor.call('grantStudentChairRole', targetUserId, currentCourseId);
        }
    },
    'click .js-cancel-student-chair-role': function (e) {
        e.preventDefault();
        var targetUserId = this._id;
        var currentCourseId = Session.get('activeCourseId');
        if (_.isString(targetUserId) && _.isString(currentCourseId)) {
            Meteor.call('cancelStudentChairRole', targetUserId, currentCourseId);
        }
    }
});

Template.consoleViewGroupsTab.events({
    'change .js-choose-group': function (e) {
        e.preventDefault();
        var groupId = $(e.target).val();
        var groupLabel = $(e.target).find('option[value="' + groupId + '"]').text();
        if (groupId && groupLabel) {
            Session.set('activeGroupId', groupId);
            Session.set('activeGroupLabel', groupLabel);
        }
    },
    'click .js-create-groups': function (e) {
        e.preventDefault();
        var courseId = Session.get('activeCourseId');
        if (courseId) {
            // for live testing (was 'formStudentsGroups')
            // Meteor.call('createOneGroupForLiveVersionTesting', courseId);
            Meteor.call('formStudentsGroups', courseId);
        }
    }
});

