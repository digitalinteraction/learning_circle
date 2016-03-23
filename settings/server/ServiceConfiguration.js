'use strict';

/**
 * This will be moved later to settings file
 * Right now data are hardcoded to ease the development and deploy
 */

if (process.env.NODE_ENV === 'development') {
    //facebook app created by Maciek, works on localhost only
    ServiceConfiguration.configurations.remove({
        service: 'facebook'
    });
    ServiceConfiguration.configurations.insert({
        service: 'facebook',
        appId: Meteor.settings.private.development.FbAppId,
        secret: Meteor.settings.private.development.FbSecret
    });

    //google app created by Maciek, works on localhost
    ServiceConfiguration.configurations.remove({
        service: 'google'
    });
    ServiceConfiguration.configurations.insert({
        service: 'google',
        // needed for schedules google calendar events testing
        // it is on vazcodev@gmail.com
        clientId: Meteor.settings.private.development.GoogleClientId,
        secret: Meteor.settings.private.development.GoogleSecret
        // original: clientId: '88337990440-our8galvacje54jk26os94md1aro4kar.apps.googleusercontent.com',
        // original: secret: 'UpAHAwwLZru1vzT8Vozdq-2M'
    });
} else {
    //facebook app on facebook@elggdev.com
    ServiceConfiguration.configurations.remove({
        service: 'facebook'
    });
    ServiceConfiguration.configurations.insert({
        service: 'facebook',
        appId: Meteor.settings.public.facebookAppId,
        secret: Meteor.settings.private.facebookAppSecret
    });

    //google app on vvazco@gmail.com account
    ServiceConfiguration.configurations.remove({
        service: 'google'
    });
    ServiceConfiguration.configurations.insert({
        service: 'google',
        // it is on vazcodev@gmail.com
        // needed for schedules google calendar events testing
        clientId: Meteor.settings.private.googleClientId,
        secret: Meteor.settings.private.googleSecret
        // original: clientId: '601756276624-l1a2bg2cbbfjdjgtuu34u7f0grndhlvu.apps.googleusercontent.com',
        // original: secret: 'NVvhJSwOgs60w0qqawhjPEFk'
    });
}
