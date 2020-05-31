$(function () {
    console.log("Statics route for scripts loaded!");
});

//GET: all countries from mongodb
//This function will happen on page load
function getCountries() {

    function addCountry(country) {
        $country.append('<p id=' + '"' + country.name.toLowerCase() + '"' + 'class="bg-success">Name: ' + country.name + ', Data: ' + country.data + '</p>');
    }

    var $country = $('#country');

    $.ajax({
        type: 'GET',
        url: '/getcountries',
        success: function (data) {
            //createCircles(data),

            $.each(data, function (i, item) {
                addCountry(item)
                //console.log(item);
            });
            console.log('Countries Get Method Data Loaded');
            console.log($country);
        }
    }), 200;
    postCountry($country);
};

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
        var findCountry = {
            "name": $searchName.val()
        };
    }
    else {
        alert('Invalid Input, Please Try Again');
    }


    $.get('/getcountries', + findCountry.name, function (data) {
        console.log(data);
        $('#foundHeading').text('Country Search Result');
        $foundCountry.text('Name: ' + data.name + ', Data: ' + data.data);
        $searchName.val('');
        console.log('Get: ' + ' { name: ' + data.name + ', data: ' + data.data + ' }');
        //$('#temp-hold').text(data);
    });
};

//GET: single country search
//this function load on the page, but will look for the button click for the id field
$(function () {
    var $searchName = $('#sCountry');
    var $foundCountry = $('#foundCountry');

    $('#search-country').on('click', function () {

        if ($searchName.val().length != 0) {
            var findCountry = {
                "name": $searchName.val()
            };
        }
        else {
            alert('Invalid Input, Please Try Again');
        }


        $.ajax({
            type: 'GET',
            url: '/getcountries/' + findCountry.name,
            success: function (found) {
                $.each(found, function (i, item) {
                    $('#foundHeading').text('Country Search Result');
                    $foundCountry.text('Name: ' + item.name + ', Data: ' + item.data);
                    $searchName.val('');
                    console.log('Get: ' + ' { name: ' + item.name + ', data: ' + item.data + ' }');
                });
            }
        }), 200;
    });
});

//POST: save country entered to mongodb
//function is being called from get all countries function above
//this will pass in the country is list add a country to the bottom of list
// function postCountry($country) {
//     var $name = $('#name');
//     //var $population = $('#population');

//     $('#add-country').on('click', function () {
//         var hasName;
//         if ($name.val().length != 0) {
//             var storeCountry = {
//                 "name": $name.val()
//             };
//             hasName = true;
//         }
//         else {
//             alert('Invalid Input, Please Try Again');
//             hasName = false;
//         }
//         if (hasName) {
//             $.ajax({
//                 type: 'POST',
//                 url: '/getcountries',
//                 data: storeCountry,
//                 success: function () {
//                     $country.append('<p id=' + '"' + storeCountry.name.toLowerCase() + '"' + 'class="bg-danger">Name: ' + storeCountry.name + ' , Data: ' + storeCountry.data + '</p>');
//                     $name.val('');
//                     $population.val('');
//                     console.log('Countries Post Method: { name: ' + ' ' + storeCountry.name + ' , data: ' + storeCountry.data + ' }');
//                 }
//             }), 200;
//         }
//     });
// }


//DELETE: remove country from mongo 
//issue: new zealand cant be deleted because of the space " "
$(function () {
    function addCountry(country) {
        $country.reload;
        $country.append('<p class="bg-success">Name: ' + country.name + '</p>');
    }

    var $country = $('#country');

    $('#delete-country').on('click', function () {

        var $deleteName = $('#dCountry');

        var $countryToDelete = {
            'name': $deleteName.val()
        }

        $.ajax({
            type: 'DELETE',
            url: '/getcountries/' + $countryToDelete.name,
            success: function () {
                var $findDeletedOne = $('#' + $countryToDelete.name.toLowerCase());
                $findDeletedOne.text('');
                console.log('Country Deleted: { name : ' + $countryToDelete.name + ' }');
                $deleteName.val('');
            }
        }), 200;
    });
});



function createCircles(data) {
    var responseObj = data;
    console.log(responseObj);
    populationYear = [];
    populationCount = [];
    //var g = d3.select("svg").selectAll("g").data(responseObj);
    console.log("Start for each loop");
    $.each(responseObj, function (i, item) {
        //console.log(item);
        $.each(item.data, function (i, key) {
            //each data set, eg.... 
            //female_employment_rate, male_employment_rate, population
            //console.log(key);
            if (i == "population_total") {
                //console.log(i);
                $.each(key, function (i, value) {
                    //console.log(key + " : " + value);
                });
            }
        });

    });

    //population total first record
    //getting year - it is a constant over all countries
    //popluation number - currently only first records number - need to get min max of all population number and divide by millions to get even spread.
    var populationFirst = responseObj[0];
    //console.log(populationFirst.name);
    $.each(populationFirst.data, function (i, item) {
        if (i == "population_total") {
            //console.log(i);
            $.each(item, function (j, key) {
                //console.log(i);

                populationYear[j] = j;
                populationCount[key] = key;
                //console.log(key);
                //console.log(temp);

            });
            //console.log(temp);
        }
        //console.log(key + " : " + value);
    });

    for (i = 0; i < populationYear.length; i++) {
        //console.log(populationYear[i]);
        //console.log(populationCount[i]);
    }
    console.log("End for each loop");


    var width = 1100;
    var height = 700;
    //var temp = [10, 15, 20, 25, 30];

    // Append SVG 
    var svg = d3.select("svg");

    // Create scale X
    var scaleX = d3.scaleLinear()
        .domain([d3.max(populationCount), d3.min(populationCount)])
        .range([0, width - 100]);

    // Create scale Y
    var scaleY = d3.scaleLinear()
        .domain([d3.max(populationYear), d3.min(populationYear)])
        .range([0, height - 100]);

    // Add scales to x axis
    var x_axis = d3.axisBottom()
        .scale(scaleX);

    // Add scale to y axis
    var y_axis = d3.axisLeft()
        .scale(scaleY);

    //Append group: "g" and insert x axis
    svg.append("g")
        .attr("transform", "translate(90, 600)")
        .call(x_axis);

    //Append group: "g" and insert y axis
    svg.append("g")
        .attr("transform", "translate(90, 10)")
        .call(y_axis);

    var bar1 = svg.append("circle")
        .attr("fill", "blue")
        .attr("transform", function (d) {
            return "translate(" + (Math.random() * 1100) + 50 + "," + (Math.random() * 450) + 50 + ")"
        })
        .attr("r", 40)
        .attr("height", 20)
        .attr("width", 10)

    var bar2 = svg.append("circle")
        .attr("fill", "blue")
        .attr("transform", function (d) {
            return "translate(" + (Math.random() * 1100) + 50 + "," + (Math.random() * 450) + 50 + ")"
        })
        .attr("r", 40)
        .attr("height", 20)
        .attr("width", 10)

    function update() {
        bar1.transition()
            .ease(d3.easeLinear)
            .duration(2000)
            .attr("r", 150)

        bar2.transition()
            .ease(d3.easeLinear)
            .duration(2000)
            .delay(2000)
            .attr("r", 150)
    }
    update();


    /*

    var responseObj = data;
    console.log(responseObj);

    // a common thing is to 'wrap' some elements in a 'g' container (group)
    // this is like wrapping html elements in a container div
    var g = d3.select("svg").selectAll("g").data(responseObj);

    // create new 'g' elements for each country
    var en = g.enter().append("g")
        .attr("transform",function(d){ 
        return "translate("+ (Math.random() * 1100) + 50 + "," + (Math.random() * 450) + 50 +")" 
    });

    // add a circle to each 'g'
    var circle = en.append("circle")
        .attr("r",function(d){ return Math.random() * 10 })
        .attr("fill",function(d,i){ return i % 2 == 0 ? "orange" : "blue" });

    // add a text to each 'g'
    en.append("text").text(function(d){ return d.name });

    d3.select("circle").transition()
    .style("background-color", "red");*/
}
