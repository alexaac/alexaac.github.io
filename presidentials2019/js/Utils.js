import * as Config from './Config.js'

export const roundToNearestMultipleOf = m => n => Math.ceil(Math.round(n/m)*m);

export const pair = (array) => {
    return array.slice(1).map( (b, i) => {
        return [array[i], b];
    });
}

export const colorLayers = (d) => {
    return ( d.properties.joined.rate1 > d.properties.joined.rate2 ) 
                ? Config.colorScaleRed(d.properties.joined.rate1) 
                : Config.colorScaleBlue(d.properties.joined.rate2);
};

export const tooltip_div = d3.select("body")
    .append("tooltip_div") 
    .attr("class", "tooltip")       
    .style("opacity", 0);

export const highlight = (d) => {
    tooltip_div.transition()    
        .duration(200)    
        .style("opacity", .9);    
    tooltip_div.html(tooltipHTML(d))
        .style("left", (d3.event.pageX) + "px")
        .style("top", (d3.event.pageY - 28) + "px");
    d3.selectAll(".CO-" + d.properties.joined.code)
        .attr("style", "stroke: #00ffff; stroke-width: 2px; fill-opacity: 0.8; cursor: pointer;");
};

export const tooltipHTML = (d) => {
    return d.properties.joined.candidate2 + " votes: " + d3.format(".2f")(d.properties.joined.rate2) + "% </br>" +
        d.properties.joined.candidate1 + " votes: " + d3.format(".2f")(d.properties.joined.rate1) + "% </br>" +
        "Electoral district: " + d.properties.joined.electoralDistrict + "</br>" +
        "No of valid votes: " + d.properties.joined.totValidVotes.toLocaleString() + "</br>";
};

export const unHighlight = (d) => {
    tooltip_div.transition()    
        .duration(500)    
        .style("opacity", 0);
    d3.selectAll(".CO-" + d.properties.joined.code)
        .attr("style", "stroke: none; cursor: none;");
}