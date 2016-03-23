'use strict';

//todo: remove this later
Meteor.startup(function () {
    var community = Colls.Communities.findOne();
    var communityId;
    if (community) {
        communityId = community._id;
    } else {
        communityId = Colls.Communities.insert({
            title: 'LC'
        });
    }

    Colls.Courses.find({community_id: null}).forEach(function (course) {
        Colls.Courses.update(course._id, {
            $set: {community_id: communityId}
        });
    });
});
