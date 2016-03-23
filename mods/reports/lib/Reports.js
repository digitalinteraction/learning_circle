'use strict';

var allowedStatuses = [
    'reported',
    'accepted',
    'resolved'
];

var schema = new SimpleSchema({
    userId: {
        type: String
    },
    docId: {
        type: String
    },
    docOriginalStatus: {
        type: String
    },
    docType: {
        type: String
    },
    message: {
        type: String
    },
    status: {
        type: String,
        allowedValues: allowedStatuses
    }
});

Colls.Reports = new UniCollection('Reports');
Colls.Reports.Schema = schema;
Colls.Reports.attachSchema(schema);

Colls.Reports.allow({
    publish: function () {
        return true;
    },
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
