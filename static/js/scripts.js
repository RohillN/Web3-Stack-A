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
    let margin = { top: 100, right: 20, bottom: 60, left: 50 };
    let width = 1110 - margin.left - margin.right;
    let height = 712 - margin.top - margin.bottom;

    let currentYear = 1991;
    let colorKeys = [{ 'key': 'pink', 'text': "Females Over 50%" }, { 'key': 'blue', 'text': "Males Over 50%" }, { 'key': 'orange', 'text': "Both Over 50%" }, { 'key': 'red', 'text': "Both Under 50%" }];
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

        // draw background year text
        svg.append("text")
            .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")")
            .text(currentYear)
            .attr("class", "currentYearDisplay");

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

        // Usually you have a color scale in your chart already
        var color = d3.scaleOrdinal()
            .domain([0, 4])
            .range([0, 4]);

        // Add one dot in the legend for each name.
        svg.selectAll("keydots")
            .data(colorKeys)
            .enter()
            .append("circle")
            .attr("cx", width - 170)
            .attr("cy", function (d, i) { return -75 + i * 20 }) // 100 is where the first dot appears. 25 is the distance between dots
            .attr("r", 7)
            .style("fill", function (d) { return d.key });

        // Add one dot in the legend for each name.
        svg.selectAll("keylabels")
            .data(colorKeys)
            .enter()
            .append("text")
            .attr("x", width - 150)
            .attr("y", function (d, i) { return -70 + i * 20 }) // 100 is where the first dot appears. 25 is the distance between dots
            .style("fill", function (d) { return d.key })
            .text(function (d) { return d.text })
            .attr("text-anchor", "left")
            .style("alignment-baseline", "middle");

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

        // create default for tooltip hover which will be invisible to start
        let tooltip = d3.select("#data_graph")
            .append("div")
            .style("opacity", 0)
            .attr("class", "tooltip")
            .style("background-color", "black")
            .style("border-radius", "5px")
            .style("padding", "10px")
            .style("color", "white");

        // show and update on mouse hover
        let showToolTip = function (d) {
            tooltip
                .transition()
                .duration(200);

            tooltip
                .style("opacity", 1)
                .html("Country: " + d.name)
                .style("left", (d3.mouse(this)[0]) + "px")
                .style("top", (d3.mouse(this)[1]) + "px");
        }

        let moveToolTip = function (d) {
            tooltip
                .style("left", (d3.mouse(this)[0]) + "px")
                .style("top", (d3.mouse(this)[1]) + "px");
        }

        let hideToolTip = function (d) {
            tooltip
                .transition()
                .duration(200)
                .style("opacity", 0);
        }

        // add circles
        svg.append("g")
            .selectAll("dot")
            .data(sortedData)
            .enter()
            .append("circle")
            .attr("class", "bubbles")
            .attr("cx", function (d) { return x(d.data.males_aged_15plus_employment_rate_percent[currentYear]); })
            .attr("cy", function (d) { return y(d.data.females_aged_15plus_employment_rate_percent[currentYear]); })
            .attr("r", function (d) {
                //greater than 100mil
                if (d.data.population_total[currentYear] > 100000000) {
                    return z(70);
                }
                //greater than 10mill & less then 100mil
                else if (d.data.population_total[currentYear] > 10000000 && d.data.population_total[currentYear] < 100000000) {
                    return z(50);
                }
                else {
                    return z(30);
                }
            })
            .text(function (d) { return d.name })
            .style("fill", "orange")
            .style("opacity", "0.7")
            .attr("stroke", "black")
            .on("mouseover", showToolTip)
            .on("mousemove", moveToolTip)
            .on("mouseleave", hideToolTip);
    });
}

function startAnimation() {
    d3.selectAll("#data_graph > *").remove();

    let margin = { top: 100, right: 20, bottom: 60, left: 50 };
    let width = 1110 - margin.left - margin.right;
    let height = 712 - margin.top - margin.bottom;

    let currentYear = 1991;
    let countryCount = 1991;
    let stopStart = false;

    let circleXL = 80;
    let circleL = 50;
    let circleM = 30

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

        // create default for tooltip hover which will be invisible to start
        let tooltip = d3.select("#data_graph")
            .append("div")
            .style("opacity", 0)
            .attr("class", "tooltip")
            .style("background-color", "black")
            .style("border-radius", "5px")
            .style("padding", "10px")
            .style("color", "white");

        // show and update on mouse hover
        let showToolTip = function (d) {
            tooltip
                .transition()
                .duration(200);

            tooltip
                .style("opacity", 1)
                .html("Country: " + d.name + "<br>Population: " + d.data.population_total[currentYear] + "<br>Female Rate: " + d.data.females_aged_15plus_employment_rate_percent[currentYear] + "%" + "<br>Female Rate: " + d.data.males_aged_15plus_employment_rate_percent[currentYear] + "%")
                .style("left", (d3.mouse(this)[0]) + "px")
                .style("top", (d3.mouse(this)[1]) + "px");
        }

        let moveToolTip = function (d) {
            tooltip
                .style("left", (d3.mouse(this)[0]) + "px")
                .style("top", (d3.mouse(this)[1]) + "px");
        }

        let hideToolTip = function (d) {
            tooltip
                .transition()
                .duration(200)
                .style("opacity", 0);
        }
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
            .attr("class", "bubbles")
            .attr("cx", function (d) { return x(d.data.males_aged_15plus_employment_rate_percent[currentYear]); })
            .attr("cy", function (d) { return y(d.data.females_aged_15plus_employment_rate_percent[currentYear]); })
            .attr("r", function (d) {
                //greater than 100mil
                if (d.data.population_total[currentYear] > 100000000) {
                    return z(circleXL);
                }
                //greater than 10mill & less then 100mil
                else if (d.data.population_total[currentYear] > 10000000 && d.data.population_total[currentYear] < 100000000) {
                    return z(circleL);
                }
                else {
                    return z(circleM);
                }
            })
            .text(function (d) { return d.name })
            .style("fill", "blue")
            .style("opacity", "0.7")
            .attr("stroke", "black")
            .on("mouseover", showToolTip)
            .on("mousemove", moveToolTip)
            .on("mouseleave", hideToolTip);;

        svg.append("text")
            .attr("transform", "translate(" + width / 2 + "," + 100 + ")")
            .text(currentYear)
            .attr("id", "yearBGText")
            .attr("class", "currentYearDisplay");

        $("#next").on("click", function () {
            countryCount += 1;
            currentYear = countryCount;
            callReDraw();

        });

        $("#back").on("click", function () {
            countryCount -= 1;
            if (countryCount < 1991) {
                countryCount = 2022;
            }
            currentYear = countryCount;
            callReDraw();

        });

        $("#auto-play").on("click", function () {
            console.log("AUTO PLAY");
            stopStart = false;
            function loopAnimation() {
                if (stopStart == false) {
                    setTimeout(function () {
                        countryCount += 1;
                        currentYear = countryCount;
                        callReDraw();
                        console.log(currentYear);
                        if (countryCount < 2022) {
                            loopAnimation();
                        }
                        if (countryCount == 2022) {
                            countryCount = 1990;
                            loopAnimation();
                        }
                        // callReDraw();                   
                    }, 1000)
                }
            }
            if (stopStart == false) {
                loopAnimation();
            }

        });

        $("#pause").on("click", function () {
            console.log("pause the animation");
            stopStart = true
            currentYear = currentYear;
            callReDraw();
        });

        function callReDraw() {
            if (currentYear == 2023) {
                countryCount = 1991
                currentYear = countryCount;
            }
            if (currentYear <= 2022) {
                svg.selectAll("circle")
                    .transition()
                    //.delay(10)
                    .duration(1000)
                    .attr("cx", function (d) {
                        return x(d.data.males_aged_15plus_employment_rate_percent[currentYear]);
                    })
                    .attr("cy", function (d) {
                        return y(d.data.females_aged_15plus_employment_rate_percent[currentYear]);
                    })
                    .attr("r", function (d) {
                        //greater than 100mil
                        if (d.data.population_total[currentYear] > 100000000) {
                            return z(circleXL);
                        }
                        //greater than 10mill & less then 100mil
                        else if (d.data.population_total[currentYear] > 10000000 && d.data.population_total[currentYear] < 100000000) {
                            return z(circleL);
                        }
                        else {
                            return z(circleM);
                        }
                    })
                    .text(function (d) { return d.name })
                    .style("fill", function (d) {
                        //if females work percetage is greater than males return red color
                        if (d.data.females_aged_15plus_employment_rate_percent[currentYear] >= 50 && d.data.males_aged_15plus_employment_rate_percent[currentYear] < 50) {
                            return "pink";
                        }
                        //if male work percetage is greater than females return blue color
                        else if (d.data.females_aged_15plus_employment_rate_percent[currentYear] < 50 && d.data.males_aged_15plus_employment_rate_percent[currentYear] >= 50) {
                            return "blue";
                        }
                        // both females and male have percentage is over 50
                        else if (d.data.females_aged_15plus_employment_rate_percent[currentYear] >= 50 && d.data.males_aged_15plus_employment_rate_percent[currentYear] >= 50) {
                            return "orange";
                        }
                        // both females and males work percentage is less than 50
                        else if (d.data.females_aged_15plus_employment_rate_percent[currentYear] < 50 && d.data.males_aged_15plus_employment_rate_percent[currentYear] < 50) {
                            return "red";
                        }

                    })
                    .style("opacity", "0.7")
                    .attr("stroke", "black");

                svg.select("#yearBGText")
                    .transition()
                    .duration(1000)
                    .text(currentYear);
            }
        }
    });

    test();

}

function test() {
    let colorKeys = [{ 'key': 'pink', 'text': "Females Over 50%" }, { 'key': 'blue', 'text': "Males Over 50%" }, { 'key': 'orange', 'text': "Both Over 50%" }, { 'key': 'red', 'text': "Both Under 50%" }];

    //var colorList = { color1: 'pink', t2: 'blue', t3: 'orange', t4: 'red' };

    colorize = function (colorKeys) {
        let container = document.getElementById('data_graph');

        $.each(colorKeys, function (key, value) {
            console.log(value.key);
            let boxContainer = document.createElement("div");
            boxContainer.className = "align-right";
            let box = document.createElement("div");
            let label = document.createElement("span");

            label.innerHTML = value.text;
            box.className = "box";
            box.style.backgroundColor = value.key;

            boxContainer.appendChild(box);
            boxContainer.appendChild(label);

            container.appendChild(boxContainer);
        });
    }

    colorize(colorKeys);
}
