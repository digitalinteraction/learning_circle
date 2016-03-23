'use strict';

Template.layoutSecondMenu.onRendered(function () {
    $(window).on('scroll.js-layout-second-menu-container', function () {
        _secondMenuSetTop();
    });

    $(window).on('resize', function () {
        _secondMenuSetTop();
    });

    this.autorun(function () {
        if (Session.get('layoutSecondMenuShow')) {
            Meteor.defer(function () {
                _secondMenuSetTop();
            });
        }
    });
});

var _secondMenuSetTop = function () {
    var $secondMenuWrapper = $('.js-layout-second-menu-container-wrapper');
    var $secondMenu = $('.js-layout-second-menu-container');
    var $mainHeader = $('.js-main-header');
    var secondMenuTop = $secondMenuWrapper.offset() && $secondMenuWrapper.offset().top;
    var headerHeight = $mainHeader && $mainHeader.outerHeight(true);

    if ($(window).scrollTop() > secondMenuTop - headerHeight && $(window).width() > 769) {
        $secondMenu.addClass('fixed').css('top', headerHeight);
    } else {
        $secondMenu.removeClass('fixed').css('top', 0);
    }
};

Template.layoutSecondMenu.onDestroyed(function () {
    $(window).off('scroll.js-layout-second-menu-container');
    $(window).off('resize');
});


Template.layoutTopBar.events({
    'click .js-hamburger-icon': function () {
        if (Session.get('layoutSecondMenuShowXS') && Session.get('layoutSecondMenuShow')) {
            Session.set('layoutSecondMenuShowXS', false);
        } else {
            $('.js-menu-main').slideToggle(400);
        }
    },
    'mouseenter .js-drop-hover': function (e) {
        var $dropdown = $(e.target).find('.js-menu-dropdown');
        $dropdown.removeClass('hide');
    },
    'mouseleave .js-drop-hover': function (e) {
        var $dropdown = $(e.target).find('.js-menu-dropdown');
        $dropdown.addClass('hide');
    },
    'click .js-menu-main > li > a': function () {
        Session.set('layoutSecondMenuShowXS', true);
        Meteor.defer(function () {
            if ($(window).width() < 768) {
                $('.js-menu-main').animate({left: '-768px'}, 500, function () {
                    $('.js-menu-main').toggle().css({left: 0});
                });
            }
        });
    }
});

Template.layoutSecondMenu.events({
    'click .js-layout-second-menu-container li > a': function () {
        Meteor.defer(function () {
            $('.js-layout-second-menu-container-wrapper').animate({left: '-768px'}, 500, function () {
                Session.set('layoutSecondMenuShowXS', false);
                $(this).css({left: 0});
            });
        });
    }
});

/* swipe */

Template.layoutTopBar.onRendered(function () {
    var tmpl = this;
    var $menuMain = tmpl.$('.js-menu-main');
    $menuMain.swipe({
        swipe: function (e, direction) {
            if (direction === 'right' || direction === 'up') {
                $menuMain.slideToggle(400);
            }
        }
    });
});

Template.layoutSecondMenu.onRendered(function () {
    var tmpl = this;
    var $secondMenuWrapper = tmpl.$('.js-layout-second-menu-container-wrapper');
    var $secondMenu = tmpl.$('.js-layout-second-menu-container');
    $secondMenuWrapper.swipe({
        swipe: function (e, direction) {
            if (direction === 'right') {
                $('.js-menu-main').toggle();
                $secondMenuWrapper.css('z-index', 1000);
                $secondMenu.animate({left: '768px'}, 500, function () {
                    Session.set('layoutSecondMenuShowXS', false);
                    $(this).css({left: 0});
                    $secondMenuWrapper.css('z-index', 100);
                });
            }
        }
    });
});
