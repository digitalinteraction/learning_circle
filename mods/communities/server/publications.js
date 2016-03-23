'use strict';

// TODO: roles and groups

// all community listing (visibility - all)
Meteor.publish('communities', function () {
    return Colls.Communities.find({}, {
            fields: {
                title: 1,
                description: 1,
                startDate: 1,
                endDate: 1,
                image: 1
            }
        });
});

Meteor.publish(null, function () {
    return Colls.Communities.find({}, {
        fields: {
            title: 1
        }
    });
});

// single community view (visibility - all)
Meteor.publish('community', function (communityId) {
    if (_.isString(communityId)) {
        return Colls.Communities.find({_id: communityId});
    }
    this.ready();
});

Meteor.publish('usersNamesLists', function () {
    return Meteor.users.find({}, {fields: {name: 1, surname: 1}});
});
