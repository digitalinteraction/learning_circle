'use strict';
window.getJsonStatistic = function () {
    Meteor.call('getStatisticToken', function (err, response) {
        if (err) {
            console.error(err);
        } else {
            window.open(Meteor.absoluteUrl(response));
        }
    });
};
