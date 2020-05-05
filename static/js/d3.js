$(function()
{
    var data = [1,2,3,4,5];

    var circle = svg.selectAll("circle").data(data);

    circle.exit().remove();

    circle.attr("r", 1.5);

    circle.enter().append("circle")
    .attr("r", 2.5)
    .merge(circle)
    .attr("cx", function(d) { return d.x; })
    .attr("cy", function(d) { return d.y; });
});