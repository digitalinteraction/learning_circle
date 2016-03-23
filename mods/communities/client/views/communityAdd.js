'use strict';

AutoForm.hooks({
    insertCommunityForm: {
        after: {
            insert: function (err, result) {
                if (!err) {
                    $(window).scrollTop(0);
                    Router.go('/community/' + result);
                }
            }
        }
    }
});

Template.communityAdd.rendered = function () {
    this.$('.datetimepicker').datetimepicker({
        format: 'll'
    });
};
