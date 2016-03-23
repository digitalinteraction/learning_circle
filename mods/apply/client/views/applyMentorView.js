'use strict';

AutoForm.addHooks('applyMentorForm', {
    onSuccess: function () {
        $(window).scrollTop(0);
        Session.set('mentorFormSuccess', true);
        Router.go('/class');
    },
    formToDoc: function (doc) {
        doc.birthday = new Date(doc.birthday);
        return doc;
    }
});

// TODO: merge code with the one from applyView

Template.applyMentorView.helpers({
    applyMentorFormSchemaHelper: function () {
        return App.applyMentorFormSchema;
    },
    mentorshipCourseIdVal: function () {
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
    getCourse: function () {
        var coursId = UniUtils.get(Router.current(), 'params.courseId');
        var cours, provider;

        if (coursId) {
            cours = Colls.Courses.findOne({_id: coursId});
            if (cours) {
                cours.formatDate = {
                    start: moment(cours.startDate).format('DD-MM-YYYY'),
                    end: moment(cours.endDate).format('DD-MM-YYYY')
                };
                provider = Colls.Communities.findOne({_id: cours.community_id});
                if (provider) {
                    cours.providerName = provider.title;
                }
                return cours;
            }
        }
    },
    sessionOptions: function () {
        var courseId = UniUtils.get(Router.current(), 'params.courseId');
        if (courseId) {
            return App.sessionTimesSelectOptions(courseId);
        }
    }
});

Template.applyMentorView.onCreated(function () {
    this.q4OptionOther = new ReactiveVar(false);
});

Template.applyMentorView.events({
    'change .js-other-q4-option': function (e, tmpl) {
        e.preventDefault();
        var value = $(e.currentTarget).val();
        if (value && value === 'other') {
            tmpl.q4OptionOther.set(true);
        } else {
            tmpl.q4OptionOther.set(false);
        }
    },
    'change .js-show-whatrole-answer': function (e) {
        e.preventDefault();
        var value = $(e.currentTarget).val();
        if (value === '4') {
            $('.js-if-selected-whatrole').show();
        } else {
            $('.js-if-selected-whatrole').hide();
        }
    }
});

Template.applyMentorView.rendered = function () {

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
