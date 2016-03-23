'use strict';

/*
 * This component make use of UniProfile
 */
Template.getUser.onCreated(function () {
    if (this.data) {
        this.subscribe('getUser', this.data);
    }
});
Template.getUser.helpers({
    user: function () {
        if (typeof this === 'string') {
            return Meteor.users.findOne({_id: this});
        }
    },
    avatar: function () {
        if (typeof this === 'string') {
            return ProfileAvatar.findOne({'metadata.owner': this});
        }
    }
});
