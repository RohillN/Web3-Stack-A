$(function () {
    console.log("Statics route for scripts loaded!");
});



$(function() {

    function addCountry(country) {
        $country.append('<li>Name: ' + country.name +'</li>');
    }
    
    var $country = $('#country');
    var $name = $('#name');
    var $searchName = $('#sCountry');
    var $foundCountry = $('#foundCountry');

    $.ajax({
        type: 'GET',
        url: '/getcountries',
        success: function(data) {
            $.each(data, function(i, item) {
                addCountry(item)
            });
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
                $name.val('');
                console.log('Countries Post Method: { name: ' + ' ' + newCountry + ' }');
            }            
        });
    });

    $('#search-country').on('click', function() {
        var findCountry = {
            "name" : $searchName.val()
        };

        $.ajax({
            type: 'GET',
            url: '/getcountries/' + findCountry.name,
            success: function(found) {
                $.each(found, function(i, item) {
                    $('#foundHeading').text('Country Search Result');
                    $foundCountry.text('Name: ' + item.name);
                    $searchName.val('');
                });
            }
        });
    });
});

