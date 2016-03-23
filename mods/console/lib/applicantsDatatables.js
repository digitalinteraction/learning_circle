'use strict';

App.TabularTables = {};

if (Meteor.isClient) {
    Template.registerHelper('TabularTables', App.TabularTables);
}

// ====================================================================================================
// admin console students applicants list
// ====================================================================================================

// there are also subrows with rest of the data in client/views/applicantsDatatables.js
App.TabularTables.ApplicantsStudents = new Tabular.Table({
    name: 'ApplicantsStudentsList',
    collection: Meteor.users,
    extraFields: ['courseSpecificData', 'gender', 'birthday', 'englishLevel', 'groupSessions', 'roles'],
    columns: [{
        title: '',
        className: 'reveal-icon',
        orderable: false,
        data: null,
        defaultContent: ''
    }, {
        data: 'name',
        title: 'Name'
    }, {
        data: 'surname',
        title: 'Surname'
    }, {
        data: 'nationality',
        title: 'Nationality'
    }, {
        data: 'country',
        title: 'Country'
    }, {
        data: 'city',
        title: 'City'
    }, {
        data: 'school',
        title: 'School'
    }, {
        title: 'Approval',
        className: 'applicant-aproval-cell',
        tmpl: Meteor.isClient && Template.consoleApplicantsStudentsApproveBtn
    }, {
        title: 'Group',
        className: 'applicant-group-cell',
        tmpl: Meteor.isClient && Template.consoleApplicantsStudentsGroup
    }]
});

// ====================================================================================================
// admin console mentors applicants list
// ====================================================================================================

// there are also subrows with rest of the data in client/views/applicantsDatatables.js
App.TabularTables.ApplicantsMentors = new Tabular.Table({
    name: 'ApplicantsMentorsList',
    collection: Meteor.users,
    extraFields: ['courseMentorSpecificData', 'gender', 'birthday', 'englishLevel', 'groupSessions', 'roles'],
    columns: [{
        title: '',
        className: 'reveal-icon',
        orderable: false,
        data: null,
        defaultContent: ''
    }, {
        data: 'name',
        title: 'Name'
    }, {
        data: 'surname',
        title: 'Surname'
    }, {
        data: 'nationality',
        title: 'Nationality'
    }, {
        data: 'country',
        title: 'Country'
    }, {
        data: 'city',
        title: 'City'
    }, {
        data: 'school',
        title: 'School'
    }, {
        title: 'Approval',
        className: 'applicant-aproval-cell',
        tmpl: Meteor.isClient && Template.consoleApplicantsMentorsApproveBtn
    }, {
        title: 'Group',
        className: 'applicant-group-cell',
        tmpl: Meteor.isClient && Template.consoleApplicantsMentorsGroup
    }]
});
