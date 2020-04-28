$(function () {
    console.log("Statics route for scripts loaded!");
});



$(function() {

    var $country = $('#country');

    $.ajax({
        type: 'GET',
        url: '/getcountries',
        success: function(data) {
            $.each(data, function(i, item) {
                $country.append('<li>Name: ' + item.name +'</li>');
            });
        }
    });
});
