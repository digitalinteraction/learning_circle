'use strict';
Meteor.startup(function () {
    UniComments.Comments.after.insert(function (userId, doc) {
        var activity;
        if (UniUtils.get(doc, 'moreInfo.collectionName')) {

            if (doc.moreInfo.collectionName === 'Blog') {
                uniNotifications.create('commentBlog', userId, doc.containerId);
            }

            if (doc.moreInfo.collectionName === 'Project') {
                uniNotifications.create('commentProject', userId, doc.containerId);
            }

            if (doc.moreInfo.collectionName === 'Project' || doc.moreInfo.collectionName === 'Blog') {
                activity = UniRiver.Activities.findOne({'o._id': doc.containerId});
                if (activity) {
                    activity.update({$set: {'o.what': 'comment', 'o.lastAction': new Date()}});
                }
            }

            if (doc.moreInfo.collectionName === 'Activities') {
                uniNotifications.create('commentPost', userId, doc.containerId);
            }

            uniNotifications.create('mentionsInComment', userId, doc._id);
        }
    });

    Project.getCollection().after.update(function (userId, doc, fields) {
        if (doc) {
            if (fields.indexOf('status') > -1 && doc.status === 'archived') {
                uniNotifications.create('archivedProject', userId, doc._id);
            }
            if (fields.indexOf('content') > -1) {
                uniNotifications.create('mentionsInProject', userId, doc._id);
            }
        }
    });

    Project.getCollection().after.insert(function (userId, doc) {
        if (doc) {
            uniNotifications.create('mentionsInProject', userId, doc._id);
        }
    });

    Blog.getCollection().after.update(function (userId, doc, fields) {
        if (doc) {
            if (fields.indexOf('status') > -1 && doc.status === 'archived') {
                uniNotifications.create('archivedBlog', userId, doc._id);
            }
            if (fields.indexOf('content') > -1) {
                uniNotifications.create('mentionsInBlog', userId, doc._id);
            }
        }
    });

    Blog.getCollection().after.insert(function (userId, doc) {
        if (doc) {
            uniNotifications.create('mentionsInBlog', userId, doc._id);
        }
    });

    UniRiver.Activities.after.insert(function (userId, doc) {
        if (doc) {
            uniNotifications.create('mentionsInPost', userId, doc._id);
        }
    });

    Colls.Reports.after.insert(function (userId, doc) {
        if (doc) {
            if (doc.docType === 'post') {
                uniNotifications.create('reportedBlog', userId, doc.docId);
            }
            if (doc.docType === 'project') {
                uniNotifications.create('reportedProject', userId, doc.docId);
            }
        }
    });
});
