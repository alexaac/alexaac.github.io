import * as Config from './Config.js'

export const roundToNearestMultipleOf = m => n => Math.ceil(Math.round(n/m)*m);

export const pair = (array) => {
    return array.slice(1).map( (b, i) => {
        return [array[i], b];
    });
}

export const colorLayers = (d) => {
    return ( d.properties.joined.rate1 > d.properties.joined.rate2 ) 
                ? ( d.properties.joined.electionsDate === "2019-11-10")
                    ? Config.colorScaleRed(d.properties.joined.rate1)
                    : Config.colorScaleRed2(d.properties.joined.rate1)
                : ( d.properties.joined.electionsDate === "2019-11-10")
                    ? Config.colorScaleBlue(d.properties.joined.rate2)
                    : Config.colorScaleBlue2(d.properties.joined.rate2);
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
        .attr("style", "stroke: #00ffff; stroke-Config.viewport_width: 2px; fill-opacity: 0.8; cursor: pointer;");
};

export const tooltipHTML = (d) => {
    return d.properties.joined.candidate2 + " votes: " + d3.format(".2f")(d.properties.joined.rate2) + "% </br>" +
        d.properties.joined.candidate1 + " votes: " + d3.format(".2f")(d.properties.joined.rate1) + "% </br>" +
        "Electoral district: " + d.properties.joined.electoralDistrict + "</br>" +
        "Total valid votes: " + d.properties.joined.totValidVotes.toLocaleString() + "</br>" +
        ( (d.properties.cod_birou !== 48) ? "Valid votes / km²: " + d.properties.joined.vvot_sqkm + "</br>" : "");
};

export const unHighlight = (d) => {
    tooltip_div.transition()    
        .duration(500)    
        .style("opacity", 0);
    d3.selectAll(".CO-" + d.properties.joined.code)
        .attr("style", "stroke: none; cursor: none;");
}

export const repaint = () => {
    d3.select("#legend-percent").selectAll("*").remove();
    d3.select("#legend-population").selectAll("*").remove();
    d3.select("#geography").selectAll("*").remove();
    d3.select("#gastner-c-cartogram").selectAll("*").remove();
    d3.select("#gastner-g-cartogram").selectAll("*").remove();
    d3.select("#dorling-cartogram").selectAll("*").remove();
    d3.select("#demers-cartogram").selectAll("*").remove();
    d3.select("#noncont-cartogram").selectAll("*").remove();
    d3.select("#candidates-donut").selectAll("*").remove();
    d3.select("#counties-treemap").selectAll("*").remove();

    const svg1 = d3.select("#legend-percent").append("svg").attr("class", "chart-group").attr("preserveAspectRatio", "xMidYMid").attr("viewBox", "-60 60 " + Config.viewport_width + " " + 150);
    const svg2 = d3.select("#legend-population").append("svg").attr("class", "chart-group").attr("preserveAspectRatio", "xMidYMid").attr("viewBox", "-20 20 " + Config.width + " " + Config.height);
    const svg3 = d3.select("#geography").append("svg").attr("class", "chart-group").attr("preserveAspectRatio", "xMidYMid").attr("viewBox", "-60 60 " + Config.viewport_width + " " + Config.viewport_height);
    const svg4 = d3.select("#gastner-c-cartogram").append("svg").attr("class", "chart-group").attr("preserveAspectRatio", "xMidYMid").attr("viewBox", "-60 60 " + Config.viewport_width + " " + Config.viewport_height);
    const svg5 = d3.select("#gastner-g-cartogram").append("svg").attr("class", "chart-group").attr("preserveAspectRatio", "xMidYMid").attr("viewBox", "-60 60 " + Config.viewport_width + " " + Config.viewport_height);
    const svg6 = d3.select("#dorling-cartogram").append("svg").attr("class", "chart-group").attr("preserveAspectRatio", "xMidYMid").attr("viewBox", "-60 60 " + Config.viewport_width + " " + Config.viewport_height);
    const svg7 = d3.select("#demers-cartogram").append("svg").attr("class", "chart-group").attr("preserveAspectRatio", "xMidYMid").attr("viewBox", "-60 60 " + Config.viewport_width + " " + Config.viewport_height);
    const svg8 = d3.select("#noncont-cartogram").append("svg").attr("class", "chart-group").attr("preserveAspectRatio", "xMidYMid").attr("viewBox", "-60 60 " + Config.viewport_width + " " + Config.viewport_height);
    const svg9 = d3.select("#candidates-donut").append("svg").attr("class", "chart-group").attr("preserveAspectRatio", "xMidYMid").attr("viewBox", "0 0 " + Config.width + " " + Config.height);
    const svg10 = d3.select("#counties-treemap").append("svg").attr("class", "chart-group").attr("preserveAspectRatio", "xMidYMid").attr("viewBox", "0 0 " + Config.width + " " + Config.height);

    return [svg1, svg2, svg3, svg4, svg5, svg6, svg7, svg8, svg9, svg10];
}