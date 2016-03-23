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
    var activities = UniRiver.Activities.find(query, options);
    var imagesIds = activities.map(function (doc) {
        if (doc.o.image) {
            return doc.o.image;
        }
    });
    return [
        activities,
        App.projectImagesCollection.find({_id: {$in: imagesIds}}),
        App.blogImagesCollection.find({_id: {$in: imagesIds}})
    ];
});
