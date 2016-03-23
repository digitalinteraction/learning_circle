'use strict';

// accounts ui facebook email request

Accounts.ui.config({
    requestPermissions: {
        facebook: ['email']
    },
    requestOfflineToken: {
        google: true
    },
    forceApprovalPrompt: {
        google: false
    }
});

// accounts entry config

Meteor.startup(function () {
    AccountsEntry.config({
        logo: false,
        privacyUrl: '/',
        termsUrl: '/',
        homeRoute: '/',
        dashboardRoute: '/after-login',
        profileRoute: '/profile',
        passwordSignupFields: 'EMAIL_ONLY',
        showSignupCode: false,
        showOtherLoginServices: true,
        extraSignUpFields: [
            {
                field: 'name',
                name: '',
                label: i18n('apply.firstNameLabel'),
                placeholder: ' ',
                type: 'text',
                required: true
            },
            {
                field: 'surname',
                name: '',
                label: i18n('apply.lastNameLabel'),
                placeholder: ' ',
                type: 'text',
                required: true
            }
        ]
    });
});
