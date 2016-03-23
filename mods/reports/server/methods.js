'use strict';

Meteor.methods({
    setReportStatus: function (id, status, docId) {
        id = id || '';
        check(id, String);
        check(status, String);

        if (this.userId && Roles.userIsInRole(this.userId, 'global_admin')) {
            if (status === 'accepted') {
                Colls.Reports.update(
                    {docId: docId},
                    {$set: {status: status}},
                    {multi: 1});
            } else {
                Colls.Reports.update(
                    {_id: id},
                    {$set: {
                        status: status
                    }
                });
            }
        }
    }
});
