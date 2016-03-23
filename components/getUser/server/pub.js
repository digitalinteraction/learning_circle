'use strict';

Meteor.publish('getUser', function (id) {
    check(id, String);
    return [
        Meteor.users.find({_id: id}, {
            fields: {
                profile: 1,
                name: 1,
                surname: 1,
                status: 1
            },
            limit: 1
        }),
        ProfileAvatar.find({'metadata.owner': id})
    ];
});
