'use strict';

var schema = new SimpleSchema({
    ownerId: {
        type: String
    },
    taskId: {
        type: String
    },
    courseId: {
        type: String
    }
});

Colls.Reading = new Mongo.Collection('Readings');
Colls.Reading.Schema = schema;
Colls.Reading.attachSchema(schema);

Colls.Reading.allow({
    insert: function (userId) {
        return !!userId;
    },
    update: function (userId) {
        return Roles.userIsInRole(userId, ['global_mentor', 'global_admin']);
    },
    remove: function (userId) {
        return Roles.userIsInRole(userId, ['global_mentor', 'global_admin']);
    }
});
