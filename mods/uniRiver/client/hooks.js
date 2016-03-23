'use strict';

UniComments.Comments.before.insert(function (userId, doc) {
    var activity;
    if (UniUtils.get(doc, 'moreInfo.collectionName')) {
        if (doc.moreInfo.collectionName === 'Project' || doc.moreInfo.collectionName === 'Blog') {
            activity = UniRiver.Activities.findOne({'o._id': doc.containerId});
            if (activity) {
                Session.set('commentAdded', {_id: activity._id, lastAction: activity.o.lastAction});
            }
        }
    }
    return doc;
});
