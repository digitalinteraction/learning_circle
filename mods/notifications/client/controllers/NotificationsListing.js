'use strict';

RouteCtrls.NotificationsListing = RouteCtrls.Basic.extend({
    headerView: 'notificationListingHeader',
    subscriptions: function () {
        return [
            Meteor.subscribe('allNotifications')
        ];
    },
    data: function () {
        return {
            notifications: uniNotifications.getNotifications()
        };
    }
});
