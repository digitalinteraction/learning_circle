# LC Online

## Info for new developers

Before you commit anything you have to install and configure **JSHint**.

    sudo -H npm i -g eslint
    ./install.sh

Bootstrap template used in this project is called "LEARN". You can find it inside `.bin/` directory.

First start should be with settings (admin user credentials) `meteor --settings settings.json` or if you need you can run it with fixtures (also with admin creation) `meteor --settings fixtures.json` (**Note**: User collection and Courses collection will be emptied).


### Fixtures info

fixtures.json
---------------
{
    "mainAdminName": "Admin",
    "mainAdminSurname": "LC",
    "mainAdminEmail": "admin@example.com",
    "mainAdminPassword": "xxxxxx",
    "runFixtures": true,
    "runGroupsCreation": false,
    "runSectionsCreation": false,
    "fixturesSectionMax": 20,
    "fixturesGroupMin": 7,
    "fixturesGroupMax": 13,
    "fixturesCoursesNumber": 2,
    "fixturesUsersNumber": 140,
    "schedulesGoogleCalendarId": "xxxxxxxx@group.calendar.google.com",
    "private": {
        "facebookAppSecret": "xxxxxxxxxxxxxxxxxxxxxxxxxxx",
        "googleClientId": "xxxxxx-xxxxxxxxxxxx.apps.googleusercontent.com",
        "googleSecret": "xxxxxx-xxxxxxxx"
    },
    "public": {
        "facebookAppId": "xxxxxxxxxxxxxxxxxxxx"
    }
}

### Settings info

settings.json
-------------
{
    "mainAdminName": "Admin",
    "mainAdminSurname": "LC",
    "mainAdminEmail": "admin@example.com",
    "mainAdminPassword": "xxxxxx",
    "schedulesGoogleCalendarId": "xxxxxxxx@group.calendar.google.com",
    "private": {
        "facebookAppSecret": "xxxxxxxxxxxxxxxxxxxxxxxxxxx",
        "googleClientId": "xxxxxx-xxxxxxxxxxxx.apps.googleusercontent.com",
        "googleSecret": "xxxxxx-xxxxxxxx"
    },
    "public": {
        "facebookAppId": "xxxxxxxxxxxxxxxxxxxx",
        "stripePublicKey": "xxxxxxxxxxxxxxxxxxxxxxxx"
    }
}


### Buttons

There are few themed buttons you can use.

* `.lc-btn`
* `.lc-btn-big`
* `.lc-btn-outline`
* `.lc-btn-outline-big`
* `.lc-btn-outline-big`
* `.lc-btn-block`
* `.lc-btn-block-big`
* `.lc-btn-block-dark`

This styles are inherited from theme, normalized and customized for LC
