import * as Utils from './Utils.js'
import * as Config from './Config.js'

export const drawScaleBar = (data, layer, svg) => {
    //https://bl.ocks.org/HarryStevens/8c8d3a489aa1372e14b8084f94b32464

    data = topojson.feature(data, {
        type: "GeometryCollection",
        geometries: data.objects[layer].geometries
    });

    const g = svg.append("g");
    const projection = Config.projection;
    
    const miles = d3.geoScaleBar()
      .units("miles")
      .left(.45);
    const scaleBarMiles = g.append("g")
        .attr("transform",  `translate(${-110},${Config.height - 40})`);

    const kilometers = d3.geoScaleBar()
      .left(.45)
      .distance(100);

    const scaleBarKilometers = g.append("g")
      .attr("transform",  `translate(${-110},${Config.height})`);
      const redraw = () => {
        projection.fitSize([Config.width, Config.height], data);
        miles.fitSize([Config.width, Config.height], data).projection(projection);
        scaleBarMiles.call(miles);
        kilometers.fitSize([Config.width, Config.height], data).projection(projection);
        scaleBarKilometers.call(kilometers);
    };

    redraw();
    window.onresize = _ => redraw();

};

export const drawVotesPercentageLegend = (data, layer, svg) => {

    let layerData = topojson.feature(data, data.objects[layer]).features;

    const keys = Object.keys(layerData);
    const values = keys.map( v => layerData[v] );

    const minRate1 = values.reduce(( (a, b) => (a.properties.joined.rate1Color < b.properties.joined.rate1Color) ? a : b ), values[0]);
    const maxRate1 = values.reduce(( (a, b) => (a.properties.joined.rate1Color > b.properties.joined.rate1Color) ? a : b ), values[0]);
    const minRate2 = values.reduce(( (a, b) => (a.properties.joined.rate2Color < b.properties.joined.rate2Color) ? a : b ), values[0]);
    const maxRate2 = values.reduce(( (a, b) => (a.properties.joined.rate2Color > b.properties.joined.rate2Color) ? a : b ), values[0]);
    
    const g = svg.append("g")
        .attr("transform", "translate(290, 40)");
    const g1 = svg.append("g")
        .attr("transform", "translate(0, 40)");

    const x = d3.scaleLinear()
        .domain([minRate1.properties.joined.rate1Color, maxRate1.properties.joined.rate1Color])
        .rangeRound([10, 300]);
    const x1 = d3.scaleLinear()
        .domain([maxRate2.properties.joined.rate2Color, minRate2.properties.joined.rate2Color])
        .rangeRound([10, 300]);

    g.selectAll("rect")
    .data(Utils.pair(x.ticks(10)))
    .enter().append("rect")
        .attr("height", 20)
        .attr("x", d => x(d[0]) )
        .attr("width", d => x(d[1]) - x(d[0]) )
        .style("fill", d => Config.colorScaleRed(d[0]) );
    g1.selectAll("rect")
        .data(Utils.pair(x1.ticks(10)))
        .enter().append("rect")
            .attr("height", 20)
            .attr("x", d => x1(d[0]) )
            .attr("width", d => x1(d[1]) - x1(d[0]) )
            .style("fill", d => Config.colorScaleBlue(d[0]) );

    const xAxisCall = d3.axisBottom(x)
        .ticks(3).tickSize(30);
    g.append("g")
        .attr("class", "x axis")
        .call(xAxisCall);
    const xAxisCall1 = d3.axisBottom(x1)
        .ticks(3).tickSize(30);
    g1.append("g")
        .attr("class", "x axis")
        .call(xAxisCall1);

    g.append("text")
            .attr("class", "caption")
            .attr("x", x.range()[0] + 30 )
            .attr("y", -6)
            .attr("class", "bubble-label")
            .attr("text-anchor", "start")
            .attr("font-weight", "bold")
            .text(`${maxRate1.properties.joined.candidate1} %` );
    g1.append("text")
            .attr("class", "caption")
            .attr("x", x1.range()[0])
            .attr("y", -6)
            .attr("class", "bubble-label")
            .attr("text-anchor", "start")
            .attr("font-weight", "bold")
            .text(`${maxRate1.properties.joined.candidate2} %` );

};

export const drawVotesByPopulationLegend = (data, layer, svg) => {
    // http://www.ralphstraumann.ch/projects/swiss-population-cartogram/

    let layerData = topojson.feature(data, data.objects[layer]).features;

    const keys = Object.keys(layerData);
    const values = keys.map( v => layerData[v] );
    layerData = values.sort( (a, b) => b.properties.joined.totValidVotes - a.properties.joined.totValidVotes );

    const margin = { left:5, right:5, top:10, bottom:15 };

    const g = svg.append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

    const x = d3.scaleLinear()
        .domain([0, d3.max(layerData, d => d.properties.joined.totValidVotes )])
        .range([0, 450]);

    const y = d3.scaleBand()
        .domain(layerData.map( d => d.properties.joined.districtAbbr ))
        .rangeRound([18, Config.height])
        .padding(0.1);

    const xAxisCall = d3.axisTop(x)
        .ticks(5).tickSize(5);
    g.append("g")
        .attr("class", "x-axis")
        .attr("transform", d => "translate(55,20)" )
        .call(xAxisCall)
        .selectAll("text")
            .attr("y", "-5");

    const yAxisCall = d3.axisLeft(y)
        .ticks(10).tickSize(0)
    g.append("g")
        .attr("class", "y-axis")
        .attr("transform", d => "translate(60,0)" ) 
        .call(yAxisCall);

    const bar = g.selectAll("g.bar")
        .data(layerData)
        .enter()
        .append("g")
        .attr("class", "bar")
        .attr("transform", d => `translate(60,${y(d.properties.joined.districtAbbr)})` );
    
    bar.append("rect")
        .attr("width", d => x(d.properties.joined.totValidVotes) )
        .attr("height", y.bandwidth())
        .attr("class", "bar-county")
        .attr("class", d => `CO-${d.properties.joined.code}` )
        .attr("fill", d => Utils.colorLayers(d))
        .attr("d", Config.path)
        .on("mouseover", d => Utils.highlight(d)) 
        .on("mouseout", d => Utils.unHighlight(d));

    bar.append("text")
        .attr("class", "value")
        .attr("x", d => x(d.properties.joined.totValidVotes) )
        .attr("y", y.bandwidth() / 2)
            .attr("dx", +3)
            .attr("dy", ".35em")
            .attr("text-anchor", "begin")
            .text( d => d3.format(",.0f")(d.properties.joined.totValidVotes) );

};

export const drawCountiesTreemap = (data, svg) => {
    // https://bl.ocks.org/mbostock/4063582

    const keys = Object.keys(data);
    data = keys.map( v => {
        data[v].county = v; 
        return { name: data[v]['Județ'], value: data[v].c };
    });

    data = { 
        "name": "România",
        "children": data
    };

    const color = d3.scaleOrdinal(d3.schemeCategory10);
    const format = d3.format(",d");

    const treemap = data => d3.treemap()
    .tile(d3.treemapResquarify)
    .size([Config.width, Config.height])
    .padding(1)
    .round(true)
        (d3.hierarchy(data)
            .eachBefore( d => { d.data.id = (d.parent ? d.parent.data.id + "." : "") + d.data.name; })
            .sum(d => d.value)
            .sort((a, b) => b.value - a.value))

    const root = treemap(data);

    const leaf = svg.selectAll("g")
      .data(root.leaves())
      .join("g")
        .attr("transform", d => `translate(${d.x0},${d.y0})`);
  
    leaf.append("title")
        .text(d => `${d.ancestors().reverse().map(d => d.data.name).join("/")}\n${format(d.value)} votes`);
  
    leaf.append("rect")
        .attr("id", d => d.data.id)
        .attr("fill", d => { while (d.depth > 1) d = d.parent; return color(d.data.name); })
        .attr("fill-opacity", 0.6)
        .attr("width", d => d.x1 - d.x0)
        .attr("height", d => d.y1 - d.y0)
        .on("mouseover", function(d) {
            d3.select(this)     
                .attr("style", "stroke: #00ffff; stroke-width: 2px; fill-opacity: 0.8; cursor: pointer;");
            })
        .on("mouseout", function(d) {
            d3.select(this)
                .attr("style", "stroke: none; cursor: none;");
            });
  
    leaf.append("clipPath")
        .attr("id", d => `clip-${d.data.id}`)
        .append("use")
            .attr("xlink:href", d => `#${d.data.id}`);
  
    leaf.append("text")
        .attr("font-size", 10 + "px")
        .attr("clip-path", d => `url(#clip-${d.data.id})`)
        .selectAll("tspan")
        .data(d => d.data.name.split(/(?=[A-Z][^A-Z])/g).concat(format(d.value)))
        .join("tspan")
            .attr("x", 3)
            .attr("y", (d, i, nodes) => `${(i === nodes.length - 1) * 0.3 + 1.1 + i * 0.9}em`)
            .attr("fill-opacity", (d, i, nodes) => i === nodes.length - 1 ? 0.7 : null)
            .text(d => d);
  
};

export const drawCandidatesDonut = (data, svg) => {
    // bl.ocks.org/nbremer/b603c3e0f7a74794da87/519786faa068384a3b9a08c45ba3a8f356b84407

    const radius = Math.min(Config.width, Config.height) / 2 - 40;

    const color = d3.scaleOrdinal()
        .range(d3.schemeDark2);

    const keys = Object.keys(data);
    data = keys.map( v => {
        data[v].candidate = v; 
        return { name: v, value: data[v].total, percent: data[v].rateCountry  }; 
    });
    
    const g = svg.append("g")
        .attr("transform", `translate(${Config.width / 2},${Config.height / 2})`);

    const pie = d3.pie()
        .sort(null)
        .value( d => d.value );

    const arc = d3.arc()
        .outerRadius(radius * 0.5)
        .innerRadius(radius * 0.8);
    
    const path = g.selectAll('path')
        .data(pie(data))
        .enter()
        .append("g")
        .on("mouseover", function(d) {
              let g = d3.select(this)
                .append("g")
                .attr("class", "text-group");
         
              g.append("text")
                .attr("class", "name-text")
                .text(`${d.data.name}`)
                .attr('text-anchor', 'middle')
                .attr('dy', '-1.2em');
          
              g.append("text")
                .attr("class", "value-text")
                .text(`${d3.format(",.0f")(d.data.value)} votes ( ${d3.format(",.2f")(+d.data.percent)} % )`)
                .attr('text-anchor', 'middle')
                .attr('dy', '.6em');
            })
            .on("mouseout",function(d) {
                d3.select(this)
                    .attr("style", "stroke: none; cursor: none;")
                    .select(".text-group").remove();
                })
            .append('path')
            .attr('d', arc)
            .attr('fill', (d,i) => color(i))
            .on("mouseover", function(d) {
                d3.select(this)     
                    .attr("style", "stroke: #00ffff; stroke-width: 2px; fill-opacity: 0.8; cursor: pointer;");
                })
            .on("mouseout", function(d) {
                d3.select(this)
                    .attr("style", "stroke: none; cursor: none;");
                })
            .each( function(d, i) { 
                    this._current = i;
                    const firstArcSection = /(^.+?)L/;
                    let newArc = firstArcSection.exec( d3.select(this).attr("d") )[1];
                    newArc = newArc.replace(/,/g , " ");
                    if (d.endAngle > 90 * Math.PI/180) {
                        const startLoc 	= /M(.*?)A/,
                            middleLoc 	= /A(.*?)0 0 1/,
                            endLoc 		= /0 0 1 (.*?)$/;
                        const newStart = endLoc.exec( newArc )[1];
                        const newEnd = startLoc.exec( newArc )[1];
                        const middleSec = middleLoc.exec( newArc )[1];
                        newArc = `M${newStart}A${middleSec}0 0 0${newEnd}`;
                    }
            svg.append("path")
                .attr("class", "hiddenDonutArcs")
                .attr("id", "donutArc"+i)
                .attr("d", newArc)
                .style("fill", "none");
            });
        
        g.selectAll(".donutText")
            .data(pie(data))
                .enter()
                    .append("text")
                    .attr("font-size", 10 + "px")
                    .attr("class", "donutText")
                    .attr("dy", (d,i) => d.endAngle > 90 * Math.PI/180 ? 18 : -11 )
                    .append("textPath")
                    .attr("startOffset","50%")
                    .style("text-anchor","start")
                    .attr("xlink:href", (d,i) => `#donutArc${i}`)
                    .text( d => d.data.name );
        
};

export const drawAreaLegend = (args) => {
    // https://bl.ocks.org/HarryStevens/b779b431075d1a2c5710e9b826736650/9060c2bdd4e553ed445dbdc0d3bec43c71ec37da

    const data = args.data,
        variable = args.variable,
        maxCircleSize = args.maxCircleSize,
        maxData = d3.max(data, d => d.properties.joined[variable]),
        circleScale = d3.scaleLinear()
            .range([5, maxCircleSize])
            .domain([0, maxData]),
        legendTextLeftPad = 8,
        legendWidth = maxCircleSize * 3,
        legendHeight = maxCircleSize * 2 + 10,
        legend = args.svg.append("g")
                    .attrs({
                        transform: d => `translate(${10},${Config.height - 200})`
                    })
                    .attr("width", legendWidth)
                    .attr("height", legendHeight),
        legendData = [maxData, args.legendData[0], args.legendData[1]],
        legendCircle = (args.typeOfArea === "circle")
            ? legend.selectAll(".legend-circle")
                .data(legendData)
                    .enter().append("circle")
                        .attr("class", "legend-circle")
                        .attr("cy", d => circleScale(d) + 1)
                        .attr("cx", circleScale(maxData) + 1)
                        .attr("r", d => circleScale(d))
            : legend.selectAll(".legend-circle")
                .data(legendData)
                    .enter().append("rect")
                        .attr("class", "legend-circle")
                        .attr("cy", d => circleScale(d) + 1)
                        .attr("cx", circleScale(maxData) + 1)
                        .attr("width", d => { return circleScale(d); })
                        .attr("height", d => { return circleScale(d); }),
        legendDottedLine = (args.typeOfArea === "circle")
            ? legend.selectAll(".legend-dotted-line")
                .data(legendData)
                    .enter().append("line")
                        .attr("class", "legend-dotted-line")
                        .attr("x1", circleScale(maxData) + 1)
                        .attr("x2", circleScale(maxData) * 2 + legendTextLeftPad)
                        .attr("y1", d => circleScale(d) * 2 + 1)
                        .attr("y2", d => circleScale(d) * 2 + 1)
            : legend.selectAll(".legend-dotted-line")
                .data(legendData)
                    .enter().append("line")
                        .attr("class", "legend-dotted-line")
                        .attr("x1", circleScale(maxData) + 1)
                        .attr("x2", circleScale(maxData) + legendTextLeftPad)
                        .attr("y1", d => circleScale(d))
                        .attr("y2", d => circleScale(d)),
        legendNumber = (args.typeOfArea === "circle")
            ? legend.selectAll(".legend-number")
                .data(legendData)
                    .enter().append("text")
                        .attr("class", "legend-number")
                        .attr("x", circleScale(maxData) * 2 + legendTextLeftPad)
                        .attr("y", d => circleScale(d) * 2 + 5)
                        .text((d, i) => d + (i == legendData.length - 1 ? " " + variable : ""))
            : legend.selectAll(".legend-number")
                .data(legendData)
                    .enter().append("text")
                        .attr("class", "legend-number")
                        .attr("x", circleScale(maxData) + legendTextLeftPad)
                        .attr("y", d => circleScale(d) + 5)
                        .text((d, i) => d + (i == legendData.length - 1 ? " " + variable : ""));
    
    return 1;

};