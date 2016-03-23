'use strict';

AutoForm.debug();

AutoForm.addHooks('applyForm', {
    onSuccess: function () {
        Session.set('mentorFormSuccess');
        Session.set('desiredRouteOnLogin'); // reset after login memory
        $(window).scrollTop(0);
        Router.go('/class');
    },
    formToModifier: function (modifier) {
        var birthday = UniUtils.get(modifier, '$set.birthday');
        if (birthday) {
            UniUtils.set(modifier, '$set.birthday', new Date(birthday));
        }
        return modifier;
    }
});

Template.applyView.onCreated(function () {
    this.q4OptionOther = new ReactiveVar(false);
});

Template.applyView.events({
    'click .js-stripe-payment': function (e) {
        e.preventDefault();

        var router = Router.current();
        var course = router && router.params && router.params.courseId;
        var getCourse = Colls.Courses.findOne({_id: course});
        var coursePrice = getCourse && getCourse.price;
        var currentUser = Meteor.user();
        var currentUserEmail = currentUser && currentUser.emails[0] && currentUser.emails[0].address;

        coursePrice = coursePrice * 100;

        if (coursePrice && course && currentUserEmail) {

            // open Stripe iframe form with prepopulated data
            // you will still have to explicitly include it when you create a charge using the Stripe API
            // thats why we need to set session var here

            Session.set('StripePaymentActualCourseId', course);

            App.StripeHandler.open({
                name: i18n('lc.title'),
                description: i18n('courses.paymentForCourseLabel'),
                amount: coursePrice,
                email: currentUserEmail
            });

        }
    },
    'change .js-other-q4-option': function (e, tmpl) {
        e.preventDefault();
        var value = $(e.currentTarget).val();
        if (value && value === 'other') {
            tmpl.q4OptionOther.set(true);
        } else {
            tmpl.q4OptionOther.set(false);
        }
    }
});

// TODO: merge code with the one from applyMentorView

Template.applyView.helpers({
    applyFormSchemaHelper: function () {
        return App.applyFormSchema;
    },
    courseIdVal: function () {
        return UniUtils.get(Router.current(), 'params.courseId');
    },
    userEmailVal: function () {
        var logedInuser = UniUsers.getLoggedIn();
        var email = logedInuser && logedInuser.email();
        if (_.isString(email)) {
            return email;
        }
    },
    isQ4otherOptionSelected: function () {
        return Template.instance().q4OptionOther.get();
    },
    sessionOptions: function () {
        var courseId = UniUtils.get(Router.current(), 'params.courseId');
        if (courseId) {
            return App.sessionTimesSelectOptions(courseId);
        }
    },
    getCourse: function () {
        var coursId = UniUtils.get(Router.current(), 'params.courseId');
        var cours;
        var community;

        if (coursId) {
            cours = Colls.Courses.findOne({_id: coursId});
            if (cours) {
                cours.formatDate = {
                    start: moment(cours.startDate).format('DD-MM-YYYY'),
                    end: moment(cours.endDate).format('DD-MM-YYYY')
                };
                community = Colls.Communities.findOne({_id: cours.community_id});
                if (community) {
                    cours.providerName = community.title;
                }
                return cours;
            }
        }
    }
});

Template.applyView.rendered = function () {

    // copied from html theme mockup

    // Basic wizard with validation
    this.$('#survey_container').wizard({
        stepsWrapper: '#wrapped',
        submit: '.submit',
        beforeSelect: function () {
            var inputs = $(this).wizard('state').step.find(':input');
            return !inputs.length || !!inputs.valid();
        }
    }).validate({
        errorPlacement: function (error, element) {
            if (element.is(':radio') || element.is(':checkbox')) {
                error.insertBefore(element.next());

            } else {
                error.insertAfter(element);
            }
        }
    });

    //  progress bar
    this.$('#progressbar').progressbar();

    this.$('#survey_container').wizard({
        afterSelect: function (event, state) {
            $('#progressbar').progressbar('value', state.percentComplete);
            $('#location').text('(' + state.stepsComplete + '/' + state.stepsPossible + ')');
        }
    });

    //Check and radio input styles
    this.$('input.check_radio').iCheck({
        checkboxClass: 'icheckbox_square-aero',
        radioClass: 'iradio_square-aero'
    });

    //Pace holder
    this.$('input, textarea').placeholder();

    // datepicker
    this.$('.datetimepicker').datetimepicker({
        format: 'll',
        useCurrent: false
    });

    var user = UniUsers.getLoggedIn();
    var userBirthday = user && UniUtils.get(UniUsers.getLoggedIn(), 'birthday');
    if (userBirthday) {
        this.$('[name=birthday]').val(UniUsers.getLoggedIn().birthday);
    }
};
