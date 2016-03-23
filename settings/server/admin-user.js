'use strict';

Meteor.startup(function () {
    var adminUser;
    var newAdminUserId;
    if (typeof Meteor.settings !== 'undefined' && !_.isEmpty(Meteor.settings)) {
        adminUser = Meteor.roles.find({name: 'global_admin'});
        if (adminUser.count() === 0) {
            newAdminUserId = Accounts.createUser({
                email: Meteor.settings.mainAdminEmail,
                password: Meteor.settings.mainAdminPassword
            });
            if (newAdminUserId) {
                UniUsers.update({_id: newAdminUserId}, {$set: {
                    'name': Meteor.settings.mainAdminName,
                    'surname': Meteor.settings.mainAdminSurname,
                    'participate': true,
                    'lastSeenCourse': null
                }});
                Roles.addUsersToRoles(newAdminUserId, ['global_admin'], Roles.GLOBAL_GROUP);
            }
            console.log('Admin user created!');
            console.log('===========================================');
            console.log('Now restart Meteor without --settings flag');
            console.log('===========================================');
        }
    }
});

Meteor.methods({
    makeUserSpecialAdmin: function (targetUserId) {
        check(targetUserId, String);
        var loggedInUser = Meteor.user();
        if (!loggedInUser || !Roles.userIsInRole(loggedInUser, ['global_admin'])) {
            throw new Meteor.Error(403, 'Access denied');
        }
        UniUsers.update({_id: targetUserId}, {$set: {
            canCreateHangouts: true,
            'participate': true,
            'lastSeenCourse': null
        }});
        Roles.addUsersToRoles(targetUserId, 'global_admin', Roles.GLOBAL_GROUP);
    }
});
