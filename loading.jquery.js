(function() {
  (function($) {
    return $.fn.loading = function(enable) {
      var key, offset, style, styleJSON, val;
      if (enable == null) {
        enable = true;
      }
      if (enable) {
        this.css('visibility', 'hidden');
        offset = this.offset();
        styleJSON = {
          'position': 'absolute',
          'top': "" + offset.top + "px",
          'left': "" + offset.left + "px",
          'width': "" + (this.outerWidth()) + "px",
          'height': "" + (this.outerHeight()) + "px",
          'text-align': 'center',
          'display': 'table'
        };
        style = "";
        for (key in styleJSON) {
          val = styleJSON[key];
          style += "" + key + ": " + val + "; ";
        }
        $(document.body).append("\n<div style=\"" + style + "\" class='loading-overlay'>\n	<p style='display: table-cell'>\n		Loading...\n	</p>\n</div>\n");
      } else {
        $('.loading-overlay').remove();
        this.css('visibility', 'visible');
      }
      return this;
    };
  })(jQuery);

}).call(this);