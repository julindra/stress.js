/*
/ *  Project: stress.js
/ *  Author: Renhard Julindra
/ *  Docs: https://stress.js.org/1.0/
/ *  License: MIT License
/ */

;(function ($, window, document, undefined) {

	var pluginName = "stress",
	dataKey = "plugin_" + pluginName;

	var status = ['active', 'complete', 'fail'];

	var Plugin = function (element, options) {

		this.element = element;

		this.options = {
			total : 2
		};

		this.init(options);
	};

	Plugin.prototype = {
		init: function (options) {
			$.extend(this.options, options);
			if(this.options['total'] <= 1 || this.options['total'] > 12) {
				alert('total must be > 1 and <= 12');
				return;
			}
			var col = [6, 4, 3, 2, 2, 1, 1, 1, 1, 1, 1];
			var cols = ['', '', '', 'five-cols', '', 'seven-cols', 'eight-cols', 'nine-cols', 'ten-cols', 'eleven-cols', ''];
			var step_html = '<div class="col-xs-'+col[this.options['total']-2]+' stress-step"><div class="progress"><div class="progress-bar"></div></div><span class="stress-circle"></span></div>';
			this.element.addClass('row '+cols[this.options['total']-2]);
			this.element.attr('data-stress', 'stress');
			var full_step_html = '';
			for(var i=1; i<=this.options['total']; i++) {
				full_step_html += step_html;
			}
			this.element.html(full_step_html);
			var data_now = parseInt(this.element.attr('data-now') ? this.element.attr('data-now') : 0);
			var data_status = this.element.attr('data-status');
			var data_title_on_now = this.element.attr('data-title-on-now');
			if(data_now < 0 || data_now > this.options['total']) {
				alert("data-now must be >= 0 and <= "+this.options['total']);
				return;
			}
			if(data_now == 0) {
				return;
			}
			if(data_status) {
				if(status.indexOf(data_status) == -1) {
					alert("invalid data-status");
					return;
				}
				var now = data_now - 1;
				for(var i=1; i<=now; i++) {
					this.element.find('.stress-step').eq(i-1).addClass('complete');
				}
				this.element.find('.stress-step').eq(now).addClass(data_status);
				if(data_title_on_now) {
					var temp = this.element.find('.stress-step').eq(now).find('.stress-circle');
					temp.attr('data-toggle', 'tooltip');
					temp.attr('data-placement', 'top');
					temp.attr('data-title', data_title_on_now);
					temp.attr('data-html', 'true');
					temp.attr('title', data_title_on_now);
					this.element.find('[data-toggle="tooltip"]').tooltip();
				}
				if(data_status == 'complete' && data_now < this.options['total']) {
					this.element.find('.stress-step').eq(now).addClass('not-last');
				}
			}

		},

		update: function (key, value) {
			if(!this.element.attr('data-stress') || this.element.attr('data-stress') != "stress") {
				return;
			}
			if(key == "now") {
				var data_now = parseInt(value);
				var data_status = this.element.attr('data-status');
				var data_title_on_now = this.element.attr('data-title-on-now');
				if(data_now < 0 || data_now > this.options['total']) {
					alert("data-now must be >= 0 and <= "+this.options['total']);
					return;
				}

				var old_now = parseInt(this.element.attr('data-now') ? this.element.attr('data-now') : 0);
				if(old_now > 0) {
					old_now -= 1;
					this.element.find('.stress-step').eq(old_now).find('.stress-circle[data-toggle="tooltip"]').tooltip('destroy');
					this.element.find('.stress-step').eq(old_now).find('.stress-circle').removeAttr('data-toggle data-placement data-title data-original-title data-html title');
				}
				this.element.attr('data-now', data_now);
				if(data_now == 0) {
					this.element.find('.stress-step').removeClass('complete fail active not-last');
					return;
				}
				if(data_status) {
					if(status.indexOf(data_status) == -1) {
						alert("invalid data-status");
						return;
					}
					var now = data_now - 1;
					this.element.find('.stress-step').eq(now).find('.stress-circle[data-toggle="tooltip"]').tooltip('destroy');
					this.element.find('.stress-step').eq(now).find('.stress-circle').removeAttr('data-toggle data-placement data-title data-original-title data-html title');
					this.element.find('.stress-step').removeClass('complete fail active not-last');
					for(var i=1; i<=now; i++) {
						this.element.find('.stress-step').eq(i-1).addClass('complete');
					}
					this.element.find('.stress-step').eq(now).addClass(data_status);
					if(data_title_on_now) {
						var temp = this.element.find('.stress-step').eq(now).find('.stress-circle');
						temp.attr('data-toggle', 'tooltip');
						temp.attr('data-placement', 'top');
						temp.attr('data-title', data_title_on_now);
						temp.attr('data-html', 'true');
						temp.attr('title', data_title_on_now);
						this.element.find('[data-toggle="tooltip"]').tooltip();
					}
					if(data_status == 'complete' && data_now < this.options['total']) {
						this.element.find('.stress-step').eq(now).addClass('not-last');
					}
				}
			} else if(key == "status") {
				var data_now = parseInt(this.element.attr('data-now') ? this.element.attr('data-now') : 0);
				var data_status = value;
				if(data_now < 0 || data_now > this.options['total']) {
					alert("data-now must be >= 0 and <= "+this.options['total']);
					return;
				}
				if(data_status) {
					if(status.indexOf(data_status) == -1) {
						alert("invalid data-status");
						return;
					}
					this.element.attr('data-status', data_status);
					if(data_now == 0) {
						return;
					}
					var now = data_now - 1;
					this.element.find('.stress-step').removeClass('complete fail active not-last');
					for(var i=1; i<=now; i++) {
						this.element.find('.stress-step').eq(i-1).addClass('complete');
					}
					this.element.find('.stress-step').eq(now).addClass(data_status);
					if(data_status == 'complete' && data_now < this.options['total']) {
						this.element.find('.stress-step').eq(now).addClass('not-last');
					}
				}
			} else if(key == "title-on-now") {
				var data_now = parseInt(this.element.attr('data-now') ? this.element.attr('data-now') : 0);
				var data_title_on_now = value;
				if(data_now < 0 || data_now > this.options['total']) {
					alert("data-now must be >= 0 and <= "+this.options['total']);
					return;
				}
				if(data_title_on_now) {
					this.element.attr('data-title-on-now', data_title_on_now);
					if(data_now == 0) {
						return;
					}
					var now = data_now - 1;
					var temp = this.element.find('.stress-step').eq(now).find('.stress-circle');
					if(temp.attr('data-toggle') && temp.attr('data-placement')) {
						temp.attr('data-title', data_title_on_now);
						temp.attr('data-html', 'true');
						temp.attr('title', data_title_on_now);
						this.element.find('.stress-step').eq(now).find('.stress-circle[data-toggle="tooltip"]').tooltip('fixTitle');
					} else {
						temp.attr('data-toggle', 'tooltip');
						temp.attr('data-placement', 'top');
						temp.attr('data-title', data_title_on_now);
						temp.attr('data-html', 'true');
						temp.attr('title', data_title_on_now);
						this.element.find('.stress-step').eq(now).find('.stress-circle[data-toggle="tooltip"]').tooltip();
					}
				}
			}
		},

		delete: function () {
			this.element.removeAttr('data-stress');
			this.element.removeClass('row five-cols seven-cols eight-cols nine-cols ten-cols eleven-cols');
			this.element.html('');
		},

		Title: function (step, text) {
			step = parseInt(step ? step : 0);
			if(step < 0 || step > this.options['total']) {
				alert("step must be >= 0 and <= "+this.options['total']);
				return;
			}
			if(step == 0) {
				return;
			}
			step -= 1;
			if(text) {
				var temp = this.element.find('.stress-step').eq(step).find('.stress-circle');
				if(temp.attr('data-toggle') && temp.attr('data-placement')) {
					temp.attr('data-title', text);
					temp.attr('data-html', 'true');
					temp.attr('title', text);
					this.element.find('.stress-step').eq(step).find('.stress-circle[data-toggle="tooltip"]').tooltip('fixTitle');
				} else {
					temp.attr('data-toggle', 'tooltip');
					temp.attr('data-placement', 'top');
					temp.attr('data-title', text);
					temp.attr('data-html', 'true');
					temp.attr('title', text);
					this.element.find('.stress-step').eq(step).find('.stress-circle[data-toggle="tooltip"]').tooltip();
				}
				if(step+1 == this.element.attr('data-now')) {
					this.element.attr('data-title-on-now', text);
				}
			}
		},

		deleteTitle: function (step) {
			step = parseInt(step ? step : 0);
			if(step < 0 || step > this.options['total']) {
				alert("step must be >= 0 and <= "+this.options['total']);
				return;
			}
			if(step == 0) {
				return;
			}
			step -= 1;
			this.element.find('.stress-step').eq(step).find('.stress-circle[data-toggle="tooltip"]').tooltip('destroy');
			this.element.find('.stress-step').eq(step).find('.stress-circle').removeAttr('data-toggle data-placement data-title data-original-title data-html title');
			if(step+1 == this.element.attr('data-now')) {
				this.element.removeAttr('data-title-on-now');
			}
		}
	};

	$.fn[pluginName] = function (options) {

		var plugin = this.data(dataKey);

		if (plugin instanceof Plugin) {
			if (typeof options !== 'undefined') {
				plugin.init(options);
			}
		} else {
			plugin = new Plugin(this, options);
			this.data(dataKey, plugin);
		}

		return plugin;
	};

	function init_all() {
		var body = $('body');
		body.find('[data-init-stress]').each(function(i) {
			var t = $(this).attr('data-init-stress');
			if(t.trim() === "") {
				$(this).stress();
			} else {
				t = parseInt(t);
				if(t >= 2 && t <= 12) {
					$(this).stress({
						total: t
					});
				}	
			}
		});
	};
	init_all();

}(jQuery, window, document));