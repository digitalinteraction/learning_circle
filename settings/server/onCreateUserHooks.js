'use strict';

// social login/register additional operations

Accounts.onCreateUser(function (options, user) {
    if (options.profile) {
        user.name = options.profile.name;
        user.surname = options.profile.surname;
    }

    if (user.services.google) {
        user.emails = [];
        user.emails.push({
            address: user.services.google.email,
            verified: true
        });
        return user;
    }

    if (user.services.facebook) {
        user.emails = [];
        user.emails.push({
            address: user.services.facebook.email,
            verified: true
        });
        return user;
    }

    return user;

});
