$(function () {
    console.log("Statics route for scripts loaded!");
});

//GET: all countries from mongodb
function getAll() {
    $.get('/getcountries', function (data) {
        console.log(data);
        $('#temp-hold').text(data);
    }).fail(function (xhr, ajaxOptions, thrownError) {
        console.log(xhr.responseText);
        $('#temp-hold').text(xhr.responseText);
    });
};

//GET: single country search
function getSingleCountry() {
    var $searchName = $('#sCountry');
    var $foundCountry = $('#foundCountry');

    if ($searchName.val().length != 0) {
        $.get('/getcountries/' + $searchName.val(), function (data) {
            console.log(data);
            $('#foundHeading').text('Country Search Result');
            $foundCountry.html("Search Input: " + $searchName.val() + "<br><br>" + data);
            $searchName.val('');
        }).fail(function (xhr, ajaxOptions, thrownError) {
            $('#foundHeading').text('Country Search Result');
            $foundCountry.html("Search Input: " + $searchName.val() + "<br><br>" + xhr.responseText);
            $searchName.val('');
            console.log(xhr.responseText);
        })
    }
    else {
        alert('Invalid Input, Please Try Again');
    }
};

//POST: save country entered to mongodb
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
            $('#addHeading').text('Country Add Status');
            $('#country').html("Add Input: " + storeCountry.name + "<br><br>Success Country Added: " + data);
        }).fail(function (xhr, ajaxOptions, thrownError) {
            $('#addHeading').text('Country Add Status');
            $('#country').html("Add Input: " + storeCountry.name + "<br><br>Invalid Country Add: " + xhr.responseText);
            console.log(xhr.responseText);
        })
    }
};

//DELETE: remove country from mongo 
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
                $('#deleteHeading').text('Country Delete Status');
                $('#deleteCountry').html("Delete Input: " + $countryToDelete.name + "<br><br>" + data);
                $deleteName.val('');
            }
        }).fail(function (xhr, ajaxOptions, thrownError) {
            console.log(xhr.responseText);
            $('#deleteHeading').text('Country Delete Status');
            $('#deleteCountry').html("Delete Input: " + $countryToDelete.name + "<br><br>" + xhr.responseText);
            $deleteName.val('');
        })
    }
};

function createGraph() {
    $.get('/getcountries', function (data) {
        var responseObj = JSON.parse(data);
        console.log(responseObj);

        // a common thing is to 'wrap' some elements in a 'g' container (group)
        // this is like wrapping html elements in a container div
        var g = d3.select("svg").selectAll("g").data(responseObj);

        // create new 'g' elements for each country
        var en = g.enter().append("g")
            .attr("transform", function (d) {
                return "translate(" + (Math.random() * 1100) + 50 + "," + (Math.random() * 680) + 50 + ")"
            });

        // add a circle to each 'g'
        var circle = en.append("circle")
            .attr("r", function (d) { return Math.random() * 50 })
            .attr("fill", function (d, i) { return i % 2 == 0 ? "orange" : "blue" });

        // add a text to each 'g'
        en.append("text").text(function (d) { return d.name });

        d3.select("circle").transition()
            .style("background-color", "red");
    })
};

function createCircles() {
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
};
