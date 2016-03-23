'use strict';

var schema = new SimpleSchema({
    title: {
        type: String,
        optional: true
    },
    users: { // id
        type: [String]
    },
    section: { // id
        type: String,
        optional: true // for now
    },
    sessionId: {
        type: String
    },
    sessionDay: {
        type: String
    },
    sessionHour: {
        type: String
    },
    sessionTimezone: {
        type: String
    },
    course: { // id
        type: String
    },
    // we need this to mark group with unassigned users
    // users which goes trough all group forming phases and don't belong to any group of their session time choice
    unassignedUsers: {
        type: Boolean,
        optional: true,
        defaultValue: false
    }
});

Colls.Groups = new UniCollection('Groups');
Colls.Groups.Schema = schema;
Colls.Groups.attachSchema(schema);

if (Meteor.isServer) {
    Colls.Groups.allow({
        insert: function (userId) {
            return userId && Roles.userIsInRole(userId, ['global_admin']);
        },
        update: function (userId) {
            return userId && Roles.userIsInRole(userId, ['global_admin']);
        },
        remove: function (userId) {
            return userId && Roles.userIsInRole(userId, ['global_admin']);
        }
    });
}
