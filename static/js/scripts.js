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

let year = 1991;

function changeYearClick() {
    if (year == 2022) {
        year = 1991;
    }
    else {
        year += 1;
    }
    console.log(year);
}

function createCircles() {
    let margin = { top: 60, right: 20, bottom: 60, left: 50 };
    let width = 1110 - margin.left - margin.right;
    let height = 712 - margin.top - margin.bottom;

    let currentYear = 1991;

    // add a play button to start animation
    //$("#play_button").html("<button id='click-play' class='btn btn-secondary btn-sm align-right' onclick=''>Play</button>");

    $.get('/getcountries', function (data) {
        let responseObj = JSON.parse(data);
        //console.log(responseObj);

        //filter data to only use countries with employment rates and population
        let sortedData = responseObj.filter(function (d) { return (d.data.males_aged_15plus_employment_rate_percent && d.data.females_aged_15plus_employment_rate_percent) });

        // select div and create svg 
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

        // x axis text label
        svg.append("text")
            .attr("text-anchor", "end")
            .attr("x", width)
            .attr("y", height + 50)
            .text("Males Age 15+ Employment Rate (Percentage)");

        // y axis 
        let y = d3.scaleLinear()
            .domain([0, 100])
            .range([height, 0]);

        svg.append("g")
            .call(d3.axisLeft(y));

        // y axis text label
        svg.append("text")
            .attr("text-anchor", "end")
            .attr("x", "350")
            .attr("y", "-20")
            .text("Females Age 15+ Employment Rate (Percentage)");

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
            .attr("cx", function (d) { return x(d.data.males_aged_15plus_employment_rate_percent[currentYear]); })
            .attr("cy", function (d) { return y(d.data.females_aged_15plus_employment_rate_percent[currentYear]); })
            .attr("r", function (d) {
                //greater than 100mil
                if (d.data.population_total[currentYear] > 100000000) {
                    return z(80);
                }
                //greater than 10mill & less then 100mil
                else if (d.data.population_total[currentYear] > 10000000 && d.data.population_total[currentYear] < 100000000) {
                    return z(50);
                }
                else {
                    return z(20);
                }
            })
            .text(function (d) { return d.name })
            .style("fill", "orange")
            .style("opacity", "0.7")
            .attr("stroke", "black");

        svg.append("text")
            .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")")
            .text(currentYear)
            .attr("class", "currentYearDisplay");
    });
}

function startAnimation() {
    d3.selectAll("#data_graph > *").remove();

    let margin = { top: 60, right: 20, bottom: 60, left: 50 };
    let width = 1110 - margin.left - margin.right;
    let height = 712 - margin.top - margin.bottom;

    let currentYear = 1992;

    // add a play button to start animation
    //$("#play_button").html("<button id='click-play' class='btn btn-secondary btn-sm align-right' onclick=''>Play</button>");

    $.get('/getcountries', function (data) {
        let responseObj = JSON.parse(data);
        //console.log(responseObj);

        //filter data to only use countries with employment rates and population
        let sortedData = responseObj.filter(function (d) { return (d.data.males_aged_15plus_employment_rate_percent && d.data.females_aged_15plus_employment_rate_percent) });

        // select div and create svg 
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

        // x axis text label
        svg.append("text")
            .attr("text-anchor", "end")
            .attr("x", width)
            .attr("y", height + 50)
            .text("Males Age 15+ Employment Rate (Percentage)");

        // y axis 
        let y = d3.scaleLinear()
            .domain([0, 100])
            .range([height, 0]);

        svg.append("g")
            .call(d3.axisLeft(y));

        // y axis text label
        svg.append("text")
            .attr("text-anchor", "end")
            .attr("x", "350")
            .attr("y", "-20")
            .text("Females Age 15+ Employment Rate (Percentage)");

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
            .attr("cx", function (d) { return x(d.data.males_aged_15plus_employment_rate_percent[currentYear]); })
            .attr("cy", function (d) { return y(d.data.females_aged_15plus_employment_rate_percent[currentYear]); })
            .attr("r", function (d) {
                //greater than 100mil
                if (d.data.population_total[currentYear] > 100000000) {
                    return z(80);
                }
                //greater than 10mill & less then 100mil
                else if (d.data.population_total[currentYear] > 10000000 && d.data.population_total[currentYear] < 100000000) {
                    return z(50);
                }
                else {
                    return z(20);
                }
            })
            .text(function (d) { return d.name })
            .style("fill", "blue")
            .style("opacity", "0.7")
            .attr("stroke", "black");

        for (let countryCount = 1991; countryCount <= 2022; countryCount++) {
            currentYear = countryCount;
            console.log(currentYear);
            if (currentYear == 2022) {
                currentYear = 1991
            }
            else {
                svg.selectAll("circle")
                    .transition()
                    .delay(7)
                    .duration(7000)
                    .attr("cx", function (d) {
                        return x(d.data.males_aged_15plus_employment_rate_percent[currentYear]);
                    })
                    .attr("cy", function (d) {
                        return y(d.data.females_aged_15plus_employment_rate_percent[currentYear]);
                    })
                    .attr("r", function (d) {
                        //greater than 100mil
                        if (d.data.population_total[currentYear] > 100000000) {
                            return z(80);
                        }
                        //greater than 10mill & less then 100mil
                        else if (d.data.population_total[currentYear] > 10000000 && d.data.population_total[currentYear] < 100000000) {
                            return z(50);
                        }
                        else {
                            return z(20);
                        }
                    })
                    .text(function (d) { return d.name })
                    .style("fill", "red")
                    .style("opacity", "0.7")
                    .attr("stroke", "black");

                svg.select("text")
                    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")")
                    .attr("class", "currentYearDisplay")
                    .transition()
                    .delay(function (d, i) { return (i * 3) })
                    .duration(8000)
                    .style("opacity", "2")
                    .text(currentYear);
            }
        }
    });
}
