function getAll() {
    $.get('/getcountries', function (data) {
        //console.log(data);
        $('#temp-hold').text(data);
    })
        .fail(function () {
            $('#temp-hold').text("Error No Countries Found");
        })
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
        })
            .fail(function () {
                $('#foundHeading').text('Country Search Result');
                $foundCountry.text("Error no country found: " + $searchName.val());
                $searchName.val('');
            })
    }
    else {
        alert('Invalid Input, Please Try Again');
    }
};


function postCountry() {
    var $name = $('#name');
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
        $.post(('/getcountries'), storeCountry, function (data) {
            console.log(data);
            $name.val('');
            console.log('Countries Post Method: { name: ' + ' ' + storeCountry.name + ' , data: ' + storeCountry.data + ' }');

        });
    }
};

function DeleteOne() {
    var $deleteName = $('#dCountry');
    var hasName;
    if ($deleteName.val().length != 0) {
        var $countryToDelete = {
            'name': $deleteName.val()
        }
        hasName = true;
    }
    else {
        alert('Invalid Input, Please Try Again');
        hasName = false
    }

    if (hasName) {
        $.ajax({
            type: 'DELETE',
            url: '/getcountries/' + $countryToDelete.name,
            success: function (data) {
                console.log('User input delete: { name : ' + $countryToDelete.name + ' }');
                $deleteName.val('');
                $('#deleteHeading').text('Country to be deleted:');
                $('#deleteCountry').text(data + ": " + $countryToDelete.name);
            }
        })
            .fail(function (data) {
                $('#deleteHeading').text('Country to be deleted:');
                $('#deleteCountry').text(data + ": " + $countryToDelete.name);
                $deleteName.val('');
            })
    }
}



