'use strict';

Meteor.publish('classActivity', function (q, o) {
    check(q, Object);
    check(o, Object);

    //@todo We may want to check if user actually CAN see this activities :)
    var query = _(q).pick('o.courseId', 'o.public');

    var options = {
        sort: o.sort || {},
        limit: o.limit || 10,
        fields: {
            content: 0 //bc optimization
        }
    };
    var usersIds = [];
    var activities = UniRiver.Activities.find(query, options);
    var imagesIds = activities.map(function (doc) {
        usersIds.push(doc.actor._id);
        if (doc.o.image) {
            return doc.o.image;
        }
    });
    return [
        activities,
        App.projectImagesCollection.find({_id: {$in: imagesIds}}),
        App.blogImagesCollection.find({_id: {$in: imagesIds}}),
        Meteor.users.find({_id: {$in: usersIds}}),
        ProfileAvatar.find({'metadata.owner':{$in: usersIds}})
    ];
});
