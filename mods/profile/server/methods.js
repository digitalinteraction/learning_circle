'use strict';

Meteor.methods({
    adminUpdateRoles: function (targetUserId, roles, group) {
        var loggedInUser = Meteor.user();
        if (!loggedInUser || !Roles.userIsInRole(loggedInUser, ['global_admin'])) {
            throw new Meteor.Error(403, 'Access denied');
        }
        Roles.addUsersToRoles(targetUserId, roles, group);
    },
    adminRemoveRoles: function (targetUserId, roles, group) {
        var loggedInUser = Meteor.user();
        if (!loggedInUser || !Roles.userIsInRole(loggedInUser, ['global_admin'])) {
            throw new Meteor.Error(403, 'Access denied');
        }
        Roles.removeUsersFromRoles(targetUserId, roles, group);
    },
    grantStudentChairRole: function (targetUserId, group) {
        var loggedInUser = Meteor.user();
        if (!loggedInUser || !Roles.userIsInRole(loggedInUser, ['global_mentor', 'global_admin'])) {
            throw new Meteor.Error(403, 'Access denied');
        }
        Roles.addUsersToRoles(targetUserId, 'course_student-chair', group);
        Roles.addUsersToRoles(targetUserId, 'global_student-chair', Roles.GLOBAL_GROUP);
    },
    cancelStudentChairRole: function (targetUserId, group) {
        var loggedInUser = Meteor.user();
        if (!loggedInUser || !Roles.userIsInRole(loggedInUser, ['global_mentor', 'global_admin'])) {
            throw new Meteor.Error(403, 'Access denied');
        }
        Roles.removeUsersFromRoles(targetUserId, 'course_student-chair', group);
    },
    updateProfileField: function (field, value) {
        check(value, String);
        check(field, String);
        var obj = {};
        obj[field] = value;
        if (this.userId) {
            Meteor.users.update({_id: this.userId}, {$set: obj});
        }
    },
    saveProfileAvatar: function(data){
        var base64image = data.base64image;
        var userId = data.userId;
        check(this.userId, String);
        check(userId, String);
        var userSetUpdate = {
            base64Avatar: base64image.md
        };
        if(userId === this.userId){
            UniUsers.update({_id: userId},{$set: userSetUpdate});
        }
    },
    removeProfileAvatar: function(data){
        var userId = data.userId;
        check(this.userId, String);
        check(userId, String);
        var userUnsetUpdate = {
            base64Avatar: ''
        };
        if(userId === this.userId){
            UniUsers.update({_id: userId},{$unset: userUnsetUpdate});
        }
    }
});
