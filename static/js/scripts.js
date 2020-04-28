$(function () {
    console.log("Statics route for scripts loaded!");
});



$(function() {

    var $testcountry = $('#testcountry');

    $.ajax({
        type: 'GET',
        url: '/getcountries',
        success: function(data) {
            $.each(data, function(i, item) {
                $testcountry.append('<li>name: ' + item.name +'</li>');
            });
        }
    });
});
