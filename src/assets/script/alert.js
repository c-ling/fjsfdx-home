(function($) {
	$.extend({
		alert: function(options) {
			var opts = $.extend({}, defaults, options);
      var alertEle = '<div class="alert alert-' + opts.type + ' fade in" role="alert">' + opts.text + '</div>';
      
      $('body').append(alertEle);

      setTimeout(function () {
        $('.alert').remove();
      }, opts.delay);
		}
	});

	var defaults = {
    text: '',
    type: 'info',
    delay: 1300
	}
})(jQuery)