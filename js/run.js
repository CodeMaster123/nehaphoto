$(function(){
	$('.galleries_switch').click(function(){
		var p = $(this).parent();
		if (p.hasClass('on')){
			p.switchClass('on', 'off', 0);
		}else{
			p.switchClass('off', 'on', 0);
		}
	});
	
	if ($('.header_images.off').size() > 0){
		$('.gallery_images').css('height', '0%');
	}
	
	$('.gallery_image_btn').click(function(){
		if ($(this).parent().hasClass('on')){
			$('.gallery_images').animate({
				opacity: 0,
				height: '0'
			}, 'slow', function(){
				$('.header_images').switchClass('on', 'off', 1000);
			});
		}else{
			$('.header_images').switchClass('off', 'on', 1000, function(){
				$('.gallery_images').animate({
					opacity: 1,
					height: $(window).height()
				}, 'slow', function(){
					$('.gallery_images').get(0).style.height = '100%';
				});
			});
		}
		return false;
	});
	
	$('input[type=text][value!=""], textarea[value!=""]').each(function(){
		var _v = $(this).val(),
			$this = $(this);
		$this.focus(function(){
			if ($this.val() == _v){
				$this.val('');
			}
		}).blur(function(){
			if ($this.val() == ''){
				$this.val(_v);
			}
		});
	});
	
	$('.content').each(function(){
		content_size($(this));
	});
	$(window).resize(function(){
		content_size($('.content'));
	});
	
	// thumbs slide
	$('.control.up').click(function(){
		var $thumbs = $('.gallery_thumbs'),
			top_limit = ($(window).height() - 85 - $thumbs.height()),
			top = parseInt($thumbs.css('top'));
		
		if (top > top_limit){
			if (top_limit - top > -100){
				$thumbs.stop().animate({
					top: top_limit
				}, 500, 'easeInOutQuad');
			}else{
				$thumbs.stop().animate({
					top: '-=100px'
				}, 500, 'easeInOutQuad');
			}
		}
		return false;
	});
	
	$('.control.down').click(function(){
		var $thumbs = $('.gallery_thumbs'),
			top = parseInt($thumbs.css('top'));
		
		if (top < 0){
			if (top > -100){
				$thumbs.stop().animate({
					top: 0
				}, 500, 'easeInOutQuad');
			}else{
				$thumbs.stop().animate({
					top: '+=100px'
				}, 500, 'easeInOutQuad');
			}
		}
		return false;
	});
	
	var start_slide = $.cookie('slideshow-index') || 1;
	var slides_array = [];
	if (typeof slides_config == 'object'){
		for(i = 1; i <= slides_config.count; i++){
			slides_array.push({image : 'galleries/'+slides_config.name+'/'+i+'.jpg', thumb: 'galleries/'+slides_config.name+'/'+i+'t.jpg'});
		}
	}
	if (start_slide > slides_array.length){
		start_slide = slides_array.length;	
	}
	if (typeof slides_array != 'undefined'){
		$.supersized({
			slideshow               : 1,
			autoplay				: 0,
			start_slide             : start_slide,
			stop_loop				: 0,
			random					: 0,
			slide_interval          : 5000,
			transition              : 1,
			transition_speed		: 1000,
			new_window				: 1,
			pause_hover             : 0,
			keyboard_nav            : 1,
			performance				: 2,
			image_protect			: 1,

			min_width		        : 0,
			min_height		        : 0,
			vertical_center         : 1,
			horizontal_center       : 1,
			fit_always				: 0,
			fit_portrait         	: 1,
			fit_landscape			: 0,

			slide_links				: 'blank',
			thumb_links				: 1,
			thumbnail_navigation    : 1,
			slides 					:  slides_array,

			progress_bar			: 1,
			mouse_scrub				: 0
		});
	};
	
	//content toggler
	if ($('.content').size() > 0){
		$('.content_toggle').show().click(function(){
			var $t = $(this);
			if ($t.hasClass('closed')){
				$('.content').slideDown('slow');
				$t.removeClass('closed');
			}else{
				var ai = $('.activeslide img'),
					iw = parseInt(ai.css('width')),
					ih = parseInt(ai.css('height'));
				if (ih < iw){
					ai.css('width', '100%');
				};
				$('.content').slideUp('slow');
				$t.addClass('closed');
			}
		});
	}
	
	//contact form
	$('#contact_form').submit(function(){
		var form = this,
			fields = [
				{
					name: 'name',
					message: 'Write Your Name',
					def: 'Name',
					gr: 'e'
				},{
					name: 'email',
					message: 'Write Your E-Mail',
					def: 'E-Mail',
					gr: 'e'
				},{
					name: 'subject',
					message: 'Write Subject',
					def: 'Subject',
					gr: 'e'
				},{
					name: 'message',
					message: 'Write Message',
					def: 'Message'
				}
			];
		
		res = check_form(this, fields);
		
		if (res) {
			//send form
			$.post('mailer.php', $(this).serializeArray(), function(data){
				if (data == 'ok'){
					alert('Message sent!');
					form.reset();
				}else{
					alert(data);
				}
			});
			return false;
		};
		
		return res;
	});
});

function content_size($this){
	if (($(window).height() - 195) < $this.height()) {
		$this.addClass('content_to_top');
	}else{
		$this.removeClass('content_to_top');
	}
}

function check_form(self, fields){
	var res = true;
	
	var scroll = true;
	for(ind in fields){
		var field = fields[ind];
		var f = $('*[name="'+field.name+'"]', self);
		switch (f.attr('type')){
			case 'checkbox':
				if (f.filter(':checked').length === 0) {
					f.last().tipsy({
						gravity: 'nw',
						fallback: field.message,
						trigger: 'manual'
					}).tipsy('show');
					if (scroll) {
						f.last().focus();
						scroll = false;
					};
					res = false;
				}else{
					f.last().tipsy('hide');
				}
				break;
				
			default:
				if ($.trim(f.val()) === '' || $.trim(f.val()) == field.def) {
					f.tipsy({
						gravity: field.gr || 'w',
						fallback: field.message,
						trigger: 'manual'
					}).tipsy('show');
					if (scroll) {
						f.last().focus();
						scroll = false;
					};
					res = false;
				}else{
					f.tipsy('hide');
				}
				break;
		}
	}

	return res;
}