'use strict';

Meteor.methods({
    getCounts: function () {
        var counts;
        counts = {
            posts: Blog.find().count(),
            projects: Project.find().count(),
            users: UniUsers.find().count()
        };
        return counts;
    },
    sendContactEmail: function (data) {
        check(data, {
            name: String,
            email: Match.Where(SimpleSchema.RegEx.Email.test.bind(SimpleSchema.RegEx.Email)),
            message: String
        });
        Email.send({
            to: 'hanna@onlineuwc.org', //hardcoded
            from: data.email,
            subject: 'Learning Cirle: Contact form message',
            text: 'From: ' + data.name + ' (' + data.email + ') \n\n' + data.message
        });
    }
});
