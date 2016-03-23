'use strict';
Blog.getCollection().before.insert(function (userId, doc) {
    doc.brief = App.clearText(doc.content);
    if (doc.brief.length > 500) {
        doc.brief = doc.brief.substr(0, 447) + '...';
    }
});

Blog.getCollection().before.update(function (userId, doc, fieldNames, modifier) {
    if (modifier.$set && modifier.$set.content) {
        modifier.$set.brief = App.clearText(modifier.$set.content);
        if (modifier.$set.brief.length > 500) {
            modifier.$set.brief = modifier.$set.brief.substr(0, 447) + '...';
        }
    }
});


Blog.getCollection().after.update(function (userId, doc, fieldNames, modifier) {
    if (_.contains(fieldNames, 'likes')) {
        UniRiver.Activities.update({'o._id': doc._id}, {$set: {'o.likes': doc.likes}}, {multi: 1});
    }
    if (_.contains(fieldNames, 'public')) {
        UniRiver.Activities.update({'o._id': doc._id}, {$set: {'o.public': doc.public}}, {multi: 1});
    }

    if (UniUtils.get(modifier, '$set.status') === 'archived') {
        // remove all activity from the river
        UniRiver.Activities.remove({'o._id': doc._id});
    }
});

Blog.getCollection().after.remove(function (userId, doc) {
    // remove all activity from the river
    UniRiver.Activities.remove({'o._id': doc._id});
});
