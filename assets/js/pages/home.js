(function($) {
  $(document).ready(function() {
    var date  = new Date();
    var eom   = new Date(date.getFullYear(), date.getMonth() + 1, 0);

    eom = eom.toISOString().split('T')[0].replace(/-/g, '/');

    $('#countdown').countdown(eom, function(event) {
      $(this).text(event.strftime('%Dd:%Hh:%Mm:%Ss'));
    });
  });
})(jQuery);
