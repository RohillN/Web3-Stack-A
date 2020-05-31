function getAll() {
    $.get('/getcountries', function (data) {
        //console.log(data);
        $('#temp-hold').text(data);
    });
};

function getSingleCountry() {
    var $searchName = $('#sCountry');
    var $foundCountry = $('#foundCountry');

    if ($searchName.val().length != 0) {
        $.get('/getcountries/' + $searchName.val(), function (data) {
            console.log(data);
            $('#foundHeading').text('Country Search Result');
            $foundCountry.text(data);
            $searchName.val('');
        });
    }
    else {
        alert('Invalid Input, Please Try Again');
    }
};


function postCountry() 
{
    var $name = $('#name');
    $('#add-country').on('click', function () {
        var hasName;
        if ($name.val().length != 0) {
            var storeCountry = {
                "name": $name.val()
            };
            hasName = true;
        }
        else {
            alert('Invalid Input, Please Try Again');
            hasName = false;
        }
        if (hasName) {
            $.post(('/getcountries'), storeCountry, function(data)
            {
                console.log(data);
                $name.val('');
                console.log('Countries Post Method: { name: ' + ' ' + storeCountry.name + ' , data: ' + storeCountry.data + ' }');
                        
            });
        }
    });
};


