'use strict';

var schema = new SimpleSchema({
    title: {
        type: String,
        label: i18n('schedules.titleLabel'),
        optional: true // TODO don't know how it should work
    },
    description: {
        type: String,
        optional: true,
        autoform: {
            type: 'textarea'
        }
    },
    date: {
        type: Date,
        optional: true
    },
    time: {
        type: String,
        optional: true
    },
    groupId: {
        type: String,
        optional: true
    },
    courseId: {
        type: String
    },
    sessionDay: {
        type: String,
        optional: true
    },
    sessionHour: {
        type: String,
        optional: true
    },
    sessionTimezone: {
        type: String,
        optional: true
    },
    present: {
        type: [String],
        optional: true
    },
    hangoutLink: {
        type: String,
        optional: true
    },
    lectureType: {
        type: Boolean,
        optional: true
    },
    attendences: { // dont know how it is supposed to work
        type: [Object],
        optional: true,
        blackbox: true // for now
    }
});

Colls.Schedules = new UniCollection('Schedules');
Colls.Schedules.Schema = schema;
Colls.Schedules.attachSchema(schema);

Colls.Schedules.allow({
    insert: function (userId) {
        return Roles.userIsInRole(userId, ['global_admin']);
    },
    update: function (userId) {
        return Roles.userIsInRole(userId, ['global_admin']);
    }
});
