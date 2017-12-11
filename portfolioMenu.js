$(function() {
    var selectedClass = "";
    $("h2").click(function(){
    selectedClass = $(this).attr("data-rel");
    $("#portfolio-grid").fadeTo(100, 0.1);
    $("#portfolio-grid div").not("."+selectedClass).fadeOut();
    setTimeout(function() {
      $("."+selectedClass).fadeIn();
      $("#portfolio-grid").fadeTo(500, 1);
    }, 500);

  });
});
