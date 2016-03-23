'use strict';

Template.communityListingItem.helpers({
    canApply: function () {
        var user = UniUsers.getLoggedIn();
        // if not logged in - display button, but there is auto redirect to login/register page
        if (!user) {
            return true;
        }
        // check if student is a community member
        var community = UniUtils.get(user.findSelf(), 'community');
        if (community && community.indexOf(this._id) !== -1) {
            return false;
        }
        // check if community is not started
        if (moment(new Date(this.startDate)).isAfter(new Date()) &&
            moment(new Date(this.endDate)).isAfter(new Date())) {
            return true;
        }
        return false;
    },
    startsInValue: function () {
        var startDate = this.startDate;
        var momentValue;
        if (startDate) {
            momentValue = moment(startDate).diff(moment(), 'hours');
            if (momentValue > 24) {
                return moment(startDate).diff(moment(), 'days') + ' ' + i18n('community.dateDaysLabel');
            }
            return momentValue + ' ' + i18n('community.dateHoursLabel');
        }
    }
});

// count community participants on the community list
// non reactive for now, refresh only on template creation
// if we need to make it reactive we should add paricipants data on Community (I think..)

Template.participantsCount.created = function () {
    var self = this;
    var communityId = this.data && this.data._id;
    self.communityParticipantCount = new ReactiveVar(0);
    if (_.isString(communityId)) {
        Meteor.call('getCommunityParticipantsCount', communityId, function (err, result) {
            if (!err) {
                self.communityParticipantCount.set(result);
            }
        });
    }
};

Template.participantsCount.helpers({
    participantCountValue: function () {
        return Template.instance().communityParticipantCount.get();
    }
});
