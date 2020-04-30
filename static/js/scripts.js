$(function () {
    console.log("Statics route for scripts loaded!");
});


//GET: all countries from mongodb
//This function will happen on page load
$(function() {

    function addCountry(country) {
        $country.append('<p class="bg-success">Name: ' + country.name +'</p>');
    }
    
    var $country = $('#country');

    $.ajax({
        type: 'GET',
        url: '/getcountries',
        success: function(data) {
            $.each(data, function(i, item) {
                addCountry(item)
                console.log(item);
            });
            console.log('Countries Get Method Data Loaded');
        }
    }), 200;
    postCountry($country);
});

//GET: single country search
//this function load on the page, but will look for the button click for the id field
$(function()
{   var $searchName = $('#sCountry');
    var $foundCountry = $('#foundCountry');

    $('#search-country').on('click', function() {

        var $searchName = $('#sCountry');
        var $foundCountry = $('#foundCountry');

        if ($searchName.val().length != 0)
        {
            var findCountry = {
                "name" : $searchName.val()
            };
        }
        else 
        {
            alert('Invalid Input, Please Try Again');
        }


        $.ajax({
            type: 'GET',
            url: '/getcountries/' + findCountry.name,
            success: function(found) {
                $.each(found, function(i, item) {
                    $('#foundHeading').text('Country Search Result');
                    $foundCountry.text('Name: ' + item.name);
                    $searchName.val('');
                    console.log('Get: ' + ' { name: ' + item.name + ' }');
                });
            }
        }), 200;
    });
});

//POST: save country entered to mongodb
//function is being called from get all countries function above
//this will pass in the country is list add a country to the bottom of list
function postCountry($country)
{
    var $name = $('#name');

    $('#add-country').on('click', function() {
        var hasName;
        if ($name.val().length != 0)
        {
            var storeCountry = {
                "name" : $name.val() 
            };
            hasName = true;
        }
        else 
        {
            alert('Invalid Input, Please Try Again');
            hasName = false;
        }
        if (hasName)
        {
            $.ajax({
                type: 'POST',
                url: '/getcountries',
                data: storeCountry,
                success: function(newCountry) {
                    $country.append('<p class="bg-danger">Name: ' + newCountry +'</p>');
                    $name.val('');
                    console.log('Countries Post Method: { name: ' + ' ' + newCountry + ' }');
                }            
            }), 200;
        }
    });
}

$(function()
{ 
        $('#delete-country').on('click', function() {

        var $deleteName = $('#dCountry');

        var $countryToDelete = {
            'name' : $deleteName.val()
        }

        $.ajax({
            type: 'DELETE',
            url: '/getcountries/' + $countryToDelete.name,
            success: function() {
                console.log($countryToDelete.name);
                $deleteName.val('');
            }
        }), 200;
    });
});
