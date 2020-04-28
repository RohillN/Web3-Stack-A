$(function () {
    console.log("Statics route for scripts loaded!");
});



$(function() {

    function addCountry(country) {
        $country.append('<li>Name: ' + country.name +'</li>');
    }
    
    var $country = $('#country');
    var $name = $('#name');

    $.ajax({
        type: 'GET',
        url: '/getcountries',
        success: function(data) {
            $.each(data, function(i, item) {
                addCountry(item)
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
                $('#name').val('');
                console.log('Countries Post Method: { name: ' + ' ' + newCountry + ' }');
            }            
        });
    });
});

