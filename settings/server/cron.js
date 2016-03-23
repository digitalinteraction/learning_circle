'use strict';

SyncedCron.add({
    name: 'Check if tasks exceeded its deadlines',
    schedule: function (parser) {
        // parser is a later.parse object
        return parser.text('every 1 day');
    },
    job: function () {
        Meteor.call('checkTasksDeadlines');
    }
});

Meteor.startup(function () {
    SyncedCron.start();
});
