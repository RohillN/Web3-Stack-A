// console log the success of the script being loaded
$(function () {
    console.log("Statics route for scripts loaded!");
});

//GET: all countries from mongodb
function getAll() {
    // ajax / jquery call
    // on success display the data from the api 
    // on fail display error message from the api
    $.get('/getcountries', function (data) {
        console.log(data);
        $('#temp-hold').text(data);
    }).fail(function (data) {
        console.log(data);
        $('#temp-hold').text(data.responseText);
    });
};

//GET: single country search
function getSingleCountry() {
    let $searchName = $('#sCountry');
    let $foundCountry = $('#foundCountry');

    // if user input is not null
    // then ajax / jquery call with a get method
    // on success display the data returned from the api
    // on fail display error message from the api
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
    // check if the user input is not null
    if ($name.val().length != 0) {
        var storeCountry = {
            "name": $name.val()
        };
        hasName = true;
    }
    // if no input was made, alert the user to enter again
    else {
        alert('Invalid Input, Please Try Again');
        hasName = false;
    }
    // if user has entered a name
    // ajax / jquery call with a post method type
    // on success display the data that has been entered
    // on fail display the error message from the api
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
    // checking if input is not null 
    if ($deleteName.val().length != 0) {
        var $countryToDelete = {
            'name': $deleteName.val()
        }
        hasName = true;
    }
    // if no input is made, alert the user to enter again
    else {
        alert('Invalid Input, Please Try Again');
        hasName = false
    }

    // if user has entered a name
    // ajax call with a delete method type
    // on success display the data sent back from api
    // on fail display the error message from the api
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

// start / load d3 to run the graph
function startAnimation() {
    d3.selectAll("#data_graph > *").remove();   // removed all from svg then recreate 

    let margin = { top: 100, right: 20, bottom: 60, left: 50 };
    let width = 1110 - margin.left - margin.right;
    let height = 712 - margin.top - margin.bottom;

    let currentYear = 1991;
    let countryCount = 1991;
    let stopStart = false;

    let circleXL = 80;
    let circleL = 50;
    let circleM = 30

    // call a get request and parse the json data
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

        // append group element and call x axis translate it to the bottom
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

        // append group element and call the y axis
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
                .style("left", (d3.mouse(this)[0]) + 300 + "px")
                .style("top", (d3.mouse(this)[1]) + 250 + "px");
        }

        //on mouse move, move the tool tip box to the mouse location
        let moveToolTip = function (d) {
            tooltip
                .style("left", (d3.mouse(this)[0]) + 300 + "px")
                .style("top", (d3.mouse(this)[1]) + 250 + "px");
        }

        //if mouse is not on a circle, then set the tooltips box opacity to zero (no visable)
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

        // add circles, define the data to enter at
        // assign x = male rate && assign y = female rate
        // assign radius to populations limit 
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
            .on("mouseover", showToolTip)       //on events call the function to show 
            .on("mousemove", moveToolTip)       //on even move call move tooltip
            .on("mouseleave", hideToolTip);     //on event leave call hide tool tip

        //create a text element, text will be the current year 
        svg.append("text")
            .attr("transform", "translate(" + width / 2 + "," + 100 + ")")
            .text(currentYear)
            .attr("id", "yearBGText")
            .attr("class", "currentYearDisplay");

        // on click of button increment the countryCount
        // recall the drawing function
        $("#next").on("click", function () {
            countryCount += 1;
            currentYear = countryCount;
            callReDraw();

        });

        // on click of button decrement the countryCount
        // recall the drawing function
        $("#back").on("click", function () {
            countryCount -= 1;
            if (countryCount < 1991) {
                countryCount = 2022;
            }
            currentYear = countryCount;
            callReDraw();

        });

        // on click of button, start the animation loop
        // loopAnimation will have a delay between each loop
        // at the end count reset countryCount to restart the loop
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
                    }, 1000)
                }
            }
            if (stopStart == false) {
                loopAnimation();
            }

        });

        // on click set stopStart to true, recall draw
        // if stopStart if true then auto play will stop 
        $("#pause").on("click", function () {
            console.log("pause the animation");
            stopStart = true
            currentYear = currentYear;
            callReDraw();
        });

        //function will display current year
        //draw cicles on x,y and r for the current year
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
    // call and draw color key legends
    colorKeyLegend();

}

// function will create two div elements and a span
// assign class names to the element
// loop through the the object of color keys and text
function colorKeyLegend() {
    let colorKeys = [{ 'key': 'pink', 'text': "Females Over 50%" }, { 'key': 'blue', 'text': "Males Over 50%" }, { 'key': 'orange', 'text': "Both Over 50%" }, { 'key': 'red', 'text': "Both Under 50%" }];

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
