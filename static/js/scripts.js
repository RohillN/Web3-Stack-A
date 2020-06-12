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
    let margin = { top: 10, right: 20, bottom: 30, left: 50 };
    let width = 1110 - margin.left - margin.right;
    let height = 662 - margin.top - margin.bottom;

    $.get('/getcountries', function (data) {
        let responseObj = JSON.parse(data);
        //console.log(responseObj);

        //filter data to only use countries with employment rates and population
        let sortedData = responseObj.filter(function (d) { return (d.data.males_aged_15plus_employment_rate_percent && d.data.females_aged_15plus_employment_rate_percent) });

        let svg = d3.select("#data_graph")
            .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        // x axis
        let x = d3.scaleLinear()
            .domain([0, 100])
            .range([0, width]);

        svg.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x));

        // y axis 
        let y = d3.scaleLinear()
            .domain([0, 100])
            .range([height, 0]);

        svg.append("g")
            .call(d3.axisLeft(y));

        // circle scale
        let z = d3.scaleLinear()
            .domain([10, 30])
            .range([1, 10]);

        // add circles
        svg.append("g")
            .selectAll("dot")
            .data(sortedData)
            .enter()
            .append("circle")
            .attr("cx", function (d) { return x(d.data.males_aged_15plus_employment_rate_percent[1991]); })
            .attr("cy", function (d) { return y(d.data.females_aged_15plus_employment_rate_percent[1991]); })
            .attr("r", function (d) {
                //greater than 100mil
                if (d.data.population_total[1991] > 100000000) {
                    return z(80);
                }
                //greater than 10mill & less then 100mil
                else if (d.data.population_total[1991] > 10000000 && d.data.population_total[1991] < 100000000) {
                    return z(50);
                }
                else {
                    return z(20);
                }
            })
            .style("fill", "orange")
            .style("opacity", "0.7")
            .attr("stroke", "black");

    });
}
