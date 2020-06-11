$(function () {
    console.log("Statics route for scripts loaded!");
});

//GET: all countries from mongodb
function getAll() {
    $.get('/getcountries', function (data) {
        console.log(data);
        $('#temp-hold').text(data);
    })
        .fail(function (data) {
            console.log(data);
            $('#temp-hold').text(data.responseText);
        });
};

//GET: single country search
function getSingleCountry() {
    let $searchName = $('#sCountry');
    let $foundCountry = $('#foundCountry');

    if ($searchName.val().length != 0) {
        $.get('/getcountries/' + $searchName.val(), function (data) {
            console.log(data);
            $('#foundHeading').text('Country Search Result');
            $foundCountry.html("Search Input: " + $searchName.val() + "<br><br>" + data);
            $searchName.val('');
        }).fail(function (data) {
            $('#foundHeading').text('Country Search Result');
            $foundCountry.html("Search Input: " + $searchName.val() + "<br><br>" + data.responseText);
            $searchName.val('');
            console.log(data);

        })
    }
    else {
        alert('Invalid Input, Please Try Again');
    }
};

//POST: save country entered to mongodb
function postCountry() {
    let $name = $('#name');
    let hasName;
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
            console.log(data); storeCountry
            $name.val('');
            console.log('Countries Post Method: { name: ' + ' ' + storeCountry.name + ' , data: ' + storeCountry.data + ' }');
            $('#addHeading').text('Country Add Status');
            $('#country').html("Add Input: " + storeCountry.name + "<br><br>Success Country Added: " + data);
        }).fail(function (data) {
            $('#addHeading').text('Country Add Status');
            console.log(data);
            $('#country').html("Add Input: " + storeCountry.name + "<br><br>Invalid Country Add: " + data.responseText);
        })
    }
}

//DELETE: remove country from mongo 
function DeleteOne() {
    let $deleteName = $('#dCountry');
    let hasName;
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
        }).fail(function (data) {
            console.log(data);
            $('#deleteHeading').text('Country Delete Status');
            $('#deleteCountry').html("Delete Input: " + $countryToDelete.name + "<br><br>" + data.responseText);
            $deleteName.val('');
        })
    }
};

function createCircles() {
    $.get('/getcountries', function (data) {
        let responseObj = JSON.parse(data);
        console.log(responseObj);

        //sortAxisData(responseObj);

        // a common thing is to 'wrap' some elements in a 'g' container (group)
        // this is like wrapping html elements in a container div
        let g = d3.select("svg").selectAll("g").data(responseObj);

        // create new 'g' elements for each country
        let en = g.enter().append("g")
            .attr("transform", function (d) {
                //console.log(d.data.population_total[1991]);
                return "translate(" + (Math.random() * 1100) + 50 + "," + (Math.random() * 600) + 50 + ")"
            });

        // add a circle to each 'g'
        let circle = en.append("circle")
            .attr("r", function (d) { 
                //greater than 100mil
                if (d.data.population_total[1991] > 100000000)
                {
                    return 50;
                }
                //greater than 10mill & less then 100mil
                else if (d.data.population_total[1991] > 10000000  && d.data.population_total[1991] < 100000000)
                {
                    return 25;
                }
                else
                {
                    return 10;
                }
            })
            .attr("fill", function (d, i) { return i % 2 == 0 ? "orange" : "blue" });

        // add a text to each 'g'
        en.append("text").text(function (d) { return d.name });

        d3.select("circle").transition()
            .style("background-color", "red");
    })
};

function sortAxisData(res) {
    populationYear = [];
    populationCount = [];
    holdPopulation = [];
    let min;
    let max;
    let noMatch = false;
    // console.log(data[0]);
    console.log(res);
    $.each(res, function (i, item) {
        $.each(item.data, function (j, value) {
            if (j == "population_total") {
                $.each(value, function (year, pop) {
                    let exists = true;
                    exists = populationYear.includes(year);
                    if (exists == false) {
                        populationYear.push(year);
                    }
                    populationCount.push(pop);
                });
            }
        });
    });
    createAxis(populationYear, populationCount)
}

function createAxis(year, value) {
    let populationYear = year;
    let populationCount = value;
    let width = 1100;
    let height = 690;

    // Append SVG 
    let svg = d3.select("svg");

    // Create scale X
    let scaleX = d3.scaleLinear()
        .domain([0, d3.max(populationCount)])
        .range([0, width - 100]);

    // Create scale Y
    let scaleY = d3.scaleLinear()
        .domain([d3.max(populationYear), 0])
        .range([0, height - 100]);

    // Add scales to x axis
    let x_axis = d3.axisBottom()
        .scale(scaleX)
        .ticks(20)
        .tickFormat(d3.format(".2s"));

    // Add scale to y axis
    let y_axis = d3.axisLeft()
        .scale(scaleY);

    //Append group: "g" and insert x axis
    svg.append("g")
        .attr("transform", "translate(90, 600)")
        .call(x_axis);

    //Append group: "g" and insert y axis
    svg.append("g")
        .attr("transform", "translate(90, 10)")
        .call(y_axis);
}

function DrawCirclesDraft() {
    let bar1 = svg.append("circle")
        .attr("fill", "blue")
        .attr("transform", function (d) {
            return "translate(" + (Math.random() * 1100) + 50 + "," + (Math.random() * 450) + 50 + ")"
        })
        .attr("r", 40)
        .attr("height", 20)
        .attr("width", 10)

    let bar2 = svg.append("circle")
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
}
