/**
 * modalicious
 *
 * @author Sjors Snoeren
 * @version 0.1.2
 */
;(function($) {

  $.modalicious = function(element, options) {

    this.settings = {};

    var _this = this;

    var defaults = {

      /**
       * Body backgroundColor isn't used while showing a modal you
       * can define a custom backgroundColor to show
       */
      backgroundColor: '#000000',

      /**
       * Enables HTML5 state pushes for showing and dismissing a modal
       */
      shouldPushHistory: true,

      /**
       * When dismissing, a new state is pushed using the baseURL
       * defaults to root
       */
      historyBaseURL: '/',

      /**
       * Enable override on the built-in back and forward functionality
       * of a browser
       */
      usesNativeBackAndForward: true,

      /**
       * Callback after opening
       */
      afterPresentModal: null
      
    };

    this.init = function() {
      this.settings = $.extend({}, defaults, options);

      if (!$('.modalicious--wrapper').length) {
        this.insertWrapperPlaceholder();
      }

      $(element).on('click.modalicous', function(e) {
        e.preventDefault();

        var href = $(this).attr('href');
        _this.presentModal(href);
      });
    };

    this.didPopState = function(e) {
      _this.dismissModal();
    };

    this.bindModalEvents = function() {
      $('.modalicious--close').on('click', function(e) {
        e.preventDefault();

        _this.dismissModal();
      });
    };

    this.presentModal = function(href) {
      var $wrapper = $('.modalicious--wrapper');

      $wrapper.load(href, function(response) {
        $wrapper.show();

        _this.setScrollEnabled(false);
        _this.bindModalEvents();

        if (_this.settings.shouldPushHistory) {
          history.pushState({}, '', href);
        }        

        if (_this.settings.usesNativeBackAndForward) {
          $(window).bind('popstate', _this.didPopState);
        }

        if (_this.settings.afterPresentModal) {
          _this.settings.afterPresentModal(href, $wrapper);
        }

        $(document).trigger('modalicious_load');
      });
    };

    this.dismissModal = function() {
      this.clearWrapperPlaceholder();
      this.setScrollEnabled(true);

      if (this.settings.shouldPushHistory) {
        history.pushState({}, '', this.settings.historyBaseURL);
      }

      if (_this.settings.usesNativeBackAndForward) {
        $(window).unbind('popstate', this.didPopState);
      }
      
      $(document).trigger('modalicious_unload');
    };

    this.insertWrapperPlaceholder = function() {
      $('body').append('<div class="modalicious--wrapper" style="width: 100%; position: fixed; overflow: auto; top: 0; left: 0; bottom: 0; z-index: 999;"></div>');

      var $wrapper = $('.modalicious--wrapper');
      $wrapper.css('background-color', this.settings.backgroundColor);
      $wrapper.hide();
    };

    this.clearWrapperPlaceholder = function() {
      $('.modalicious--wrapper').html('').hide();
    }

    this.setScrollEnabled = function(enabled) {
      $('body').css('overflow', enabled ? 'auto' : 'hidden');
    };
  }

  $.fn.modalicious = function(options) {
    return this.each(function() {
      if (undefined == $(this).data('modalicious')) {
        var plugin = new $.modalicious(this, options);
        plugin.init();
        $(this).data('modalicious', plugin);
      }
    });
  }

})(jQuery);
