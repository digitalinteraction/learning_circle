'use strict';

UniCollection.publish('reports', function (docType) {
    check(docType, String);

    if (docType === 'post') {
        this.setMappings(Colls.Reports, {
            key: 'docId',
            collection: Blog,
            options: {fields: {title: 1}}
        });
    } else if (docType === 'project') {
        this.setMappings(Colls.Reports, {
            key: 'docId',
            collection: Project,
            options: {fields: {title: 1}}
        });
    }

    if (this.userId && Roles.userIsInRole(this.userId, 'global_admin')) {
        return Colls.Reports.find({
            docType: docType,
            status: 'reported'
        });
    }
    this.ready();
});

Meteor.publish('reportInformation', function (docId) {
    check(docId, String);
    return Colls.Reports.find({
        docId: docId
    });
});
