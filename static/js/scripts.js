$(function () {
    console.log("Statics route for scripts loaded!");
});



$(function() {

    var $country = $('#country');
    var $name = $('#name');

    $.ajax({
        type: 'GET',
        url: '/getcountries',
        success: function(data) {
            $.each(data, function(i, item) {
                $country.append('<li>Name: ' + item.name +'</li>');
            })
            console.log('Countries Get Method Data Loaded');
        }
    });

    $('#add-country').on('click', function() {

        var storeCountry = {
            "name" : $name.val() 
        };
        $.ajax({
            type: 'POST',
            url: '/getcountries',
            data: storeCountry,
            success: function(newCountry) {
                $country.append('<li>Name: ' + newCountry +'</li>');
            }            
        });
    });
});

