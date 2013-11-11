jQuery(function($){
	if ($("#shortcode_generator").length) {
		var gen_html = '<h3>Shortcode generator</h3>'
			+ '<p>Paste the LUTube embed code in the box below, set optional settings, and click on the generate code button:</p>'
			+ '<p><textarea id="shortcode_generator_src" cols="80" rows="6"></textarea></p>'
			+ '<p><strong>Width and Height</strong></p>'
			+ '<p><input type="text" id="shortcode_generator_width" class="width_height" data-defaultwidth="" value="" size="3" /><label for="shortcode_generator_width">Width of player (in pixels)</label></p>'
			+ '<p><input type="text" id="shortcode_generator_height" class="width_height" data-defaultheight="" value="" size="3" /><label for="shortcode_generator_height">Height of player (in pixels)</label></p>'
			+ '<p id="dimensions-reset"><a class="btn" href="#">reset</a></p>'
			+ '<p><strong>Settings</strong></p>'
			+ '<p class="checkbox"><input type="checkbox" id="shortcode_generator_controls" class="cb" checked="checked" /><label for="shortcode_generator_controls">Whether to show the controls for the video in native players (currently on iOS devices only)</label></p>'
			+ '<p class="checkbox"><input type="checkbox" id="shortcode_generator_autoplay" class="cb" /><label for="shortcode_generator_autoplay">Whether to start playing video as soon as the page loads (not recommended)</label></p>'
			+ '<p class="checkbox"><input type="checkbox" id="shortcode_generator_preload" class="cb" /><label for="shortcode_generator_preload">Whether to preload video (not recommended)</label></p><p><input type="button" id="shortcode_generator_generate" class="button" value="Generate shortcode" /></p>'
			+ '<p><code id="shortcode_generator_results"></code></p>';
		$("#shortcode_generator").html(gen_html);
		$("#shortcode_generator_generate").click(function(){
			generateLUTubeShortcode();
		});
		$("#shortcode_generator_src").on("change", function(){
			generateLUTubeShortcode();
		});
		$(".cb").on("click", function(){
			generateLUTubeShortcode();
		});
		$(".width_height").on("keyup", function(){
			var dw = $("#shortcode_generator_width").attr("data-defaultwidth"),
				dh = $("#shortcode_generator_height").attr("data-defaultheight");
			if (dw && dh) {
				if ($(this).val() == "") {
					$(".width_height").val('');
					generateLUTubeShortcode();
					return;
				}
				if ($(this).is("#shortcode_generator_width")) {
					$("#shortcode_generator_height").val(Math.round(($("#shortcode_generator_width").val()/dw) * dh));
				} else {
					$("#shortcode_generator_width").val(Math.round(($("#shortcode_generator_height").val()/dh) * dw));
				}
			}
			generateLUTubeShortcode();
		});
		$("#dimensions-reset").hide();
	}
	function generateLUTubeShortcode()
	{
		var code = '',
			src = $("#shortcode_generator_src").val(),
			hash = /lutube\.leeds\.ac\.uk\/video\/([^"]*)/.exec(src),
			width = /width="([^"]*)"/.exec(src),
			height = /height="([^"]*)"/.exec(src);
		if ($.trim(src) !== ""){
			if(hash && hash.length){
				code += '[lutube hash="'+hash[1]+'"';
				if (width && width.length){
					$("#shortcode_generator_width").attr("data-defaultwidth", width[1]);
					if ($("#shortcode_generator_width").val() == "") {
						$("#shortcode_generator_width").val(width[1]);
					}
				}
				if ($("#shortcode_generator_width").val() != ""){
					code += ' width="'+parseInt($("#shortcode_generator_width").val())+'"';
				}
				if (height && height.length){
					$("#shortcode_generator_height").attr("data-defaultheight", height[1]);
					if ($("#shortcode_generator_height").val() == "") {
						$("#shortcode_generator_height").val(height[1]);
					}
				}
				if ($("#shortcode_generator_height").val() != ""){
					code += ' height="'+parseInt($("#shortcode_generator_height").val())+'"';
				}
				if (!$("#shortcode_generator_controls:checked").length){
					code += ' controls="0"';
				}
				if($("#shortcode_generator_autoplay:checked").length){
					code += ' autoplay="1"';
				}
				if($("#shortcode_generator_preload:checked").length){
					code += ' preload="1"';
				}
				code += "]";
				$("#shortcode_generator_results").text(code);
			}
		}
	}
});
