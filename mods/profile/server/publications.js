'use strict';
// UniProfile package...
Meteor.publish('uniProfileUser', function (id) {
    return [
        Meteor.users.find({_id: id}, {
            fields: {
                profile: 1,
                name: 1,
                surname: 1,
                status: 1
            }
        }),
        ProfileAvatar.find({'metadata.owner': id})
    ];
});

Meteor.publish('userAvatar', function (_id) {
    return ProfileAvatar.find({'metadata.owner': _id});
});

Meteor.publish(null, function () {
    if (this.userId) {
        return [
            Meteor.users.find({_id: this.userId}),
            ProfileAvatar.find({'metadata.owner': this.userId})
        ];
    }
    return [];
});
