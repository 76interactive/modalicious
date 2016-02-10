/**
 * modalicious
 *
 * @author Sjors Snoeren
 * @version 0.1
 */
;(function($) {

  $.modalicious = function(element, options) {

    this.settings = {};

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
      historyBaseURL: '/'

    };  
    
    this.init = function() {
      var _this = this;

      this.settings = $.extend({}, defaults, options);

      if (!$('.modalicious--wrapper').length) {
        this.insertWrapperPlaceholder();
      }

      $(element).on('click', function(e) {
        e.preventDefault();

        var $wrapper = $('.modalicious--wrapper');
        var href = $(this).attr('href');

        $wrapper.load(href, function(response) {
          $wrapper.show();

          _this.setScrollEnabled(false);
          _this.bindModalEvents();

          if (_this.settings.shouldPushHistory) {
            history.pushState({}, '', href);
          }

          $(document).trigger('modalicious_load');
        });
      });
    };

    this.bindModalEvents = function() {
      var _this = this;

      $('.modalicious--close').on('click', function(e) {
        e.preventDefault();

        _this.clearWrapperPlaceholder();
        _this.setScrollEnabled(true);

        if (_this.settings.shouldPushHistory) {
          history.pushState({}, '', _this.settings.historyBaseURL);
        }
      });
    };

    this.insertWrapperPlaceholder = function() {
      $('body').append('<div class="modalicious--wrapper" style="width: 100%; position: fixed; top: 0; left: 0; bottom: 0; z-index: 999;"></div>');
      
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

    this.init();
  }

  $.fn.modalicious = function(options) {
    return this.each(function() {
      if (undefined == $(this).data('modalicious')) {
        var plugin = new $.modalicious(this, options);
        $(this).data('modalicious', plugin);
      }
    });
  }

})(jQuery);

function scrollHandler() { }

$(window).bind('scroll', scrollHandler);
$(window).unbind('scroll', scrollHandler);

