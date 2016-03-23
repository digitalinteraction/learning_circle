'use strict';

/**
 * This will be moved later to settings file
 * Right now data are hardcoded to ease the development and deploy
 */

if (process.env.NODE_ENV === 'development') {
    ServiceConfiguration.configurations.remove({
        service: 'facebook'
    });
    ServiceConfiguration.configurations.insert({
        service: 'facebook',
        appId: Meteor.settings.private.development.FbAppId,
        secret: Meteor.settings.private.development.FbSecret
    });

    ServiceConfiguration.configurations.remove({
        service: 'google'
    });
    ServiceConfiguration.configurations.insert({
        service: 'google',
        clientId: Meteor.settings.private.development.GoogleClientId,
        secret: Meteor.settings.private.development.GoogleSecret

    });
} else {
    ServiceConfiguration.configurations.remove({
        service: 'facebook'
    });
    ServiceConfiguration.configurations.insert({
        service: 'facebook',
        appId: Meteor.settings.public.facebookAppId,
        secret: Meteor.settings.private.facebookAppSecret
    });
    
    ServiceConfiguration.configurations.remove({
        service: 'google'
    });
    ServiceConfiguration.configurations.insert({
        service: 'google',
        clientId: Meteor.settings.private.googleClientId,
        secret: Meteor.settings.private.googleSecret

    });
}
