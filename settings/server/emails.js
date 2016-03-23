'use strict';

// config Email

Meteor.startup(function () {
    if (!process.env.MAIL_URL) {
        process.env.MAIL_URL = Meteor.settings.private.processEnvMAIL_URL;
    }
});

// template generated with: https://github.com/leemunroe/grunt-email-workflow

SSR.compileTemplate('testEmail', Assets.getText('testemail.html'));

Template.testEmail.helpers({
    getDocType: function () {
        return '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">';
    }
});

Meteor.methods({
    sendTestMail: function (email) {

        check(email, String);

        var mailTemplate = SSR.render('testEmail', {
            title: 'test title',
            preheader: 'preheader test',
            content1: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Excepturi, nulla officia facilis sit nostrum reiciendis hic, aliquam maiores quas modi quam quos ex, commodi voluptates.',
            content2: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Excepturi, nulla officia facilis sit nostrum reiciendis hic, aliquam maiores quas modi quam quos ex, commodi voluptates.',
            imageUrl: 'http://lorempixel.com/400/200/',
            url: Meteor.absoluteUrl(),
            linkText: 'lorem ipsum dolor link'
        });

        this.unblock();

        if (_.isString(mailTemplate)) {
            Email.send({
                bcc: email,
                to: 'Learning Circle <no-reply@learningcircle.io>',
                from: 'Learning Circle <no-reply@learningcircle.io>',
                subject: 'Test title',
                html: mailTemplate
            });
        }

    },
    sendRescheduleMail: function (doc) {
        var user, course, group,
            header, mailTemplate;

        user = UniUsers.findOne({_id: doc.userId});
        course = Colls.Courses.findOne({_id: doc.courseId});
        group = Colls.Groups.findOne({_id: doc.groupId});
        header =
            'From: ' + user.name + ' ' + user.surname + ' (' +
            'course: ' + course.title + ', ' +
            'preferred group: ' + group.title + ')';

        mailTemplate = SSR.render('testEmail', {
            title: 'Reschedule request',
            content1: header,
            content2: doc.message
        });

        this.unblock();

        if (_.isString(mailTemplate)) {
            Email.send({
                to: 'hanna@onlineuwc.org',
                from: 'hanna@onlineuwc.org',
                subject: 'Reschedule group session',
                html: mailTemplate
            });
        }
    }
});


/**
 * Send email using template layout
 * @param {String|[String]} to - receiver address(es)
 * @param {Object} params - params object
 * @param {String} params.title - email title and subject
 * @param {String} params.content1 - First content block
 * @param {String} [params.content2] - Second content block
 * @param {String} [params.preheader] - not sure what it is
 * @param {String} [params.imageUrl] - Image url
 * @param {String} [params.url] - Footer url
 * @param {String} [params.linkText] - Footer url text
 * @param {String} [emailLayout] - Template layout name
 * @throw Meteor.Error
 * @return {undefined} - this function isn't returning anything.
 */
App.sendTemplateEmail = function (to, params, emailLayout) {
    if (_.isString(to)) {
        to = [to];
    }
    check(to, [String]);
    check(params, {
        title: String,
        content1: String,
        content2: Match.Optional(String),
        preheader: Match.Optional(String),
        imageUrl: Match.Optional(String),
        url: Match.Optional(String),
        linkText: Match.Optional(String)
    });

    _(params).defaults({
        content2: '',
        preheader: '',
        imageUrl: 'http://lorempixel.com/400/200/',
        url: Meteor.absoluteUrl(),
        linkText: 'Go to LearningCircle.io'
    });

    emailLayout = 'testEmail'; // only option for now

    var mailTemplate = SSR.render(emailLayout, params);

    if (!_.isString(mailTemplate)) {
        throw new Meteor.Error('template-parse-error', 'Cannot parse the template');
    } else {
        Email.send({
            bcc: to,
            to: 'Learning Circle <no-reply@learningcircle.io>',
            from: 'Learning Circle <no-reply@learningcircle.io>',
            subject: params.title,
            html: mailTemplate
        });
    }
};

/**
 * Trigger email sending for action
 * @param {String} triggerId - trigger ID
 * @param {Object} options - options
 * @param {String} options.courseId - id of the course
 * @param {String|[String]} options.to - email recipients
 * @param {Object} [options.data] - data to be filled inside template
 * @throw Meteor.Error
 * @return {undefined} - this function isn't returning anything.
 */
App.triggerEmail = function (triggerId, options) {
    check(triggerId, String);
    check(options, Match.ObjectIncluding({
        courseId: String,
        to: Match.OneOf(String, [String]),
        data: Match.Optional(Object)
    }));

    var settings = _(EmailTemplates.triggersList).find(function (trigger) {
        return trigger.id === triggerId;
    });


    if (!settings) {
        throw new Meteor.Error('invalid-trigger', 'Invalid trigger');
    }

    var emailTemplate = EmailTemplates.findOne({
        triggerId: triggerId,
        courseId: options.courseId
    });

    if (!emailTemplate) {
        // no course specific template, get global one
        emailTemplate = EmailTemplates.findOne({
            triggerId: triggerId,
            courseId: EmailTemplates.GLOBAL
        });
    }

    if (!emailTemplate) {
        // still no template, throw an error
        throw new Meteor.Error('no-template', 'Cannot find EmailTemplate for ' + triggerId);
    }

    var course = Colls.Courses.findOne(options.courseId);

    if (!course) {
        throw new Meteor.Error('invalid-course-id', 'Invalid Course ID');
    }

    // get image for email

    function getImage (collection, id) {
        var image = collection.findOne(id);
        return image && Meteor.absoluteUrl(image.url({
                auth: false,
                store: 'bigCover'
            }));
    }

    var imageUrl, community;
    if (course.community_id) {
        // get image from the community
        community = Colls.Communities.findOne(course.community_id);
        if (community && community.image) {
            imageUrl = getImage(App.communityImagesCollection, community.image);
        }
    }
    if (!imageUrl && course.image) {
        // in case there is no image on the community, get it from the course itself
        imageUrl = getImage(App.courseImagesCollection, course.image);
    }

    // parse the template

    var templateSettings = {
        interpolate: /\{\{(.+?)\}\}/g
    };

    var parsedTemplate, parsedSubject;
    try {
        parsedTemplate = _.template(emailTemplate.template, options.data || {}, templateSettings);
        parsedSubject = _.template(emailTemplate.subject, options.data || {}, templateSettings);
    } catch (e) {
        throw new Meteor.Error('template-parsing-error', 'Error while parsing the template: ' + e);
    }

    // send email
    var params = {
        title: parsedSubject,
        content1: parsedTemplate
    };

    if (imageUrl) {
        params.imageUrl = imageUrl;
    }

    // send the email
    this.sendTemplateEmail(options.to, params);
};
