$(function()
{
    var data = [
        { "name" : "Canada" },
        { "name" : "New Zealand" }
      ];
      
      var g = d3.select("svg").selectAll("g").data(data);
      
      var enter = g.enter().append("g")
        .attr("transform",function(d){ 
          return "translate("+ (Math.random() * 1100) + 40 + "," + (Math.random() * 450) + 40 +")" 
        });
      
      var circle = enter.append("circle")
        .attr("r",function(d){ return Math.random() * 100 })
        .attr("fill",function(d,i){ return i % 2 == 0 ? "red" : "blue" });
      
      enter.append("text").text(function(d){ return d.name });
});