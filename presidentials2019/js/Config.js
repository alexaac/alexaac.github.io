import * as Utils from './Utils.js'

export const COL_LEGEND = {
    'a': 'Numărul total al alegătorilor prevăzut în lista electorală permanentă existentă în secția de votare',
    'b': 'Numărul total al alegătorilor care s-au prezentat la urne',
    'b1': 'Numărul total al alegătorilor care s-au prezentat la urne, înscriși în lista electorală permanentă',
    'b2': 'Numărul total al alegătorilor care s-au prezentat la urne și nu sunt cuprinși în lista electorală permanentă, înscriși în lista electorală suplimentară',
    'b3': 'Numărul total al alegătorilor care au votat utilizând urna specială, înscriși în extrasul din listele electorale',
    'c': 'Numărul total al voturilor valabil exprimate',
    'd': 'Numărul voturilor nule',
    'e': 'Numărul buletinelor de vot primite',
    'f': 'Numărul buletinelor de vot neîntrebuințate și anulate'
};

export const CANDIDATES_2019 = {
    'g1': 'KLAUS-WERNER IOHANNIS',
    'g2': 'THEODOR PALEOLOGU',
    'g3': 'ILIE-DAN BARNA',
    'g4': 'HUNOR KELEMEN',
    'g5': 'VASILICA-VIORICA DĂNCILĂ',
    'g6': 'CĂTĂLIN-SORIN IVAN',
    'g7': 'NINEL PEIA',
    'g8': 'SEBASTIAN-CONSTANTIN POPESCU',
    'g9': 'JOHN-ION BANU',
    'g10': 'MIRCEA DIACONU',
    'g11': 'BOGDAN-DRAGOS-AURELIU MARIAN-STANOEVICI',
    'g12': 'RAMONA-IOANA BRUYNSEELS',
    'g13': 'VIOREL CATARAMĂ',
    'g14': 'ALEXANDRU CUMPĂNAŞU' 
};

export const CANDIDATES_2014 = {};

export const LAYERLIST = [
    'counties_wgs84', 
    'counties_cart_wgs84', 
    'counties_cart_hex_10000_wgs84',
    'counties_cart_hex_10000d_wgs84'
];

export const width = 620,
height = 660;

export const colorScaleRed = d3.scaleThreshold()
.domain( [0, 10, 20, 30, 40, 50, 55, 60, 65, 70, 75, 80, 85, 90, 95, 100 ] )
.range(d3.schemeReds[9]);

export const colorScaleBlue = d3.scaleThreshold()
.domain( [0, 10, 20, 30, 40, 50, 55, 60, 65, 70, 75, 80, 85, 90, 95, 100 ] )
.range(d3.schemeBlues[9]);

export const projection = d3.geoAlbers()
.center([24.7731, 45.7909])
.rotate([-14, 3.3, -10])
.parallels([37, 54])
.scale(5000);

export const path = d3.geoPath()
.projection(projection);

export const fieldMap = (d) => {

    return {
        code: {
            'alegeri_2014': d['Cod Birou Electoral'],
            'alegeri_2019': d['Cod birou electoral']
        },
        totValidVotes: {
            'alegeri_2014': d['Numărul total al voturilor valabil exprimate'],
            'alegeri_2019': d['c']
        },
        vote1: {
            'alegeri_2014': d['VICTOR-VIOREL PONTA'],
            'alegeri_2019': d['g5']
        },
        candidate1: {
            'alegeri_2014': CANDIDATES_2014['g5'],
            'alegeri_2019': CANDIDATES_2019['g5'],
        },
        vote2: {
            'alegeri_2014': d['KLAUS-WERNER IOHANNIS'],
            'alegeri_2019': d['g1']
        },
        candidate2: {
            'alegeri_2014': CANDIDATES_2014['g1'],
            'alegeri_2019': CANDIDATES_2019['g1'],
        },
        electoralDistrict: {
            'alegeri_2014': d['Nume Judet'],
            'alegeri_2019': d['Județ']
        },
        rate1: {
            'alegeri_2014': d['VICTOR-VIOREL PONTA'] / d['Numărul total al voturilor valabil exprimate'] * 100,
            'alegeri_2019': d.g5 / d.c * 100,
        },
        rate1Color: {
            'alegeri_2014': Utils.roundToNearestMultipleOf(5)(d['VICTOR-VIOREL PONTA'] / d['Numărul total al voturilor valabil exprimate'] * 100),
            'alegeri_2019': Utils.roundToNearestMultipleOf(5)(d.g5 / d.c * 100),
        },
        rate2: {
            'alegeri_2014': d['KLAUS-WERNER IOHANNIS'] / d['Numărul total al voturilor valabil exprimate'] * 100,
            'alegeri_2019': d.g1 / d.c * 100,
        },
        rate2Color: {
            'alegeri_2014': Utils.roundToNearestMultipleOf(5)(d['KLAUS-WERNER IOHANNIS'] / d['Numărul total al voturilor valabil exprimate'] * 100),
            'alegeri_2019': Utils.roundToNearestMultipleOf(5)(d.g1 / d.c * 100)
        }
    }
}

// MapFactory.js

const formatCountyData = (data, votesByCode) => {
    LAYERLIST.forEach( layer => {
        data.objects[layer].geometries = data.objects[layer].geometries
        .filter( d => { 
            if (typeof(votesByCode.get(d.properties.cod_birou)) != "undefined") {
                return d;
            };
        });
        data.objects[layer].geometries
        .forEach( d => {
            try {
                d.properties.joined = {
                    code: d.properties.cod_birou,
                    districtAbbr: d.properties.abbr,
                    totValidVotes: votesByCode.get(d.properties.cod_birou).totValidVotes,
                    vote1: votesByCode.get(d.properties.cod_birou).vote1,
                    vote2: votesByCode.get(d.properties.cod_birou).vote2,
                    candidate1: votesByCode.get(d.properties.cod_birou).candidate1,
                    candidate2: votesByCode.get(d.properties.cod_birou).candidate2,
                    electoralDistrict: votesByCode.get(d.properties.cod_birou).electoralDistrict,
                    rate1: votesByCode.get(d.properties.cod_birou).rate1,
                    rate1Color: votesByCode.get(d.properties.cod_birou).rate1Color,
                    rate2: votesByCode.get(d.properties.cod_birou).rate2,
                    rate2Color: votesByCode.get(d.properties.cod_birou).rate2Color
                };

                return d;
            } catch (error) {
                // console.log(error);
            };
        });
    });

    return data;
}

const mapDataFactory = (data, votesByCode) => {
    
    const formattedData = formatCountyData(data, votesByCode);

    return (callback, layer, svg) => {
        return callback(formattedData, layer, svg, votesByCode);
    }
};

export default mapDataFactory;

// DrawLegend.js

export const drawScaleBar = (data, layer, svg) => {
    //https://bl.ocks.org/HarryStevens/8c8d3a489aa1372e14b8084f94b32464

    data = topojson.feature(data, {
        type: "GeometryCollection",
        geometries: data.objects[layer].geometries
    });

    const g = svg.append("g");
    const projection = projection;
    
    const miles = d3.geoScaleBar()
      .units("miles")
      .left(.45);
    const scale_bar_miles = g.append("g")
        .attr("transform",  `translate(${-110},${height - 40})`);

    const kilometers = d3.geoScaleBar()
      .left(.45)
      .distance(100);

    const scale_bar_kilometers = g.append("g")
      .attr("transform",  `translate(${-110},${height})`);
      const redraw = () => {
        projection.fitSize([width, height], data);
        miles.fitSize([width, height], data).projection(projection);
        scale_bar_miles.call(miles);
        kilometers.fitSize([width, height], data).projection(projection);
        scale_bar_kilometers.call(kilometers);
    };

    redraw();
    window.onresize = _ => redraw();

};

export const drawVotesPercentageLegend = (data, layer, svg) => {

    let layerData = topojson.feature(data, data.objects[layer]).features;

    const keys = Object.keys(layerData);
    const values = keys.map( v => layerData[v] );

    const min_rate1 = values.reduce(( (a, b) => (a.properties.joined.rate1Color < b.properties.joined.rate1Color) ? a : b ), values[0]);
    const max_rate1 = values.reduce(( (a, b) => (a.properties.joined.rate1Color > b.properties.joined.rate1Color) ? a : b ), values[0]);
    const min_rate2 = values.reduce(( (a, b) => (a.properties.joined.rate2Color < b.properties.joined.rate2Color) ? a : b ), values[0]);
    const max_rate2 = values.reduce(( (a, b) => (a.properties.joined.rate2Color > b.properties.joined.rate2Color) ? a : b ), values[0]);
    
    const g = svg.append("g")
        .attr("transform", "translate(290, 40)");
    const g1 = svg.append("g")
        .attr("transform", "translate(0, 40)");

    const x = d3.scaleLinear()
        .domain([min_rate1.properties.joined.rate1Color, max_rate1.properties.joined.rate1Color])
        .rangeRound([10, 300]);
    const x1 = d3.scaleLinear()
        .domain([max_rate2.properties.joined.rate2Color, min_rate2.properties.joined.rate2Color])
        .rangeRound([10, 300]);

    g.selectAll("rect")
    .data(Utils.pair(x.ticks(10)))
    .enter().append("rect")
        .attr("height", 20)
        .attr("x", d => x(d[0]) )
        .attr("width", d => x(d[1]) - x(d[0]) )
        .style("fill", d => colorScaleRed(d[0]) );
    g1.selectAll("rect")
        .data(Utils.pair(x1.ticks(10)))
        .enter().append("rect")
            .attr("height", 20)
            .attr("x", d => x1(d[0]) )
            .attr("width", d => x1(d[1]) - x1(d[0]) )
            .style("fill", d => colorScaleBlue(d[0]) );

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
            .text(`${max_rate1.properties.joined.candidate1} %` );
    g1.append("text")
            .attr("class", "caption")
            .attr("x", x1.range()[0])
            .attr("y", -6)
            .attr("class", "bubble-label")
            .attr("text-anchor", "start")
            .attr("font-weight", "bold")
            .text(`${max_rate1.properties.joined.candidate2} %` );

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
        .rangeRound([18, height])
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
        .attr("d", path)
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
    .size([width, height])
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

    const radius = Math.min(width, height) / 2 - 40;

    const color = d3.scaleOrdinal()
        .range(d3.schemeDark2);

    const keys = Object.keys(data);
    data = keys.map( v => {
        data[v].candidate = v; 
        return { name: v, value: data[v].total, percent: data[v].rateCountry  }; 
    });
    
    const g = svg.append("g")
        .attr("transform", `translate(${width / 2},${height / 2})`);

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
                        transform: d => `translate(${10},${height - 200})`
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


// DrawMaps.js


export const draw = (data, layer, svg) => {
    const nodes = topojson.feature(data, data.objects[layer]).features;

    const mapFeatures = svg.append("g")
        .attr("class", "features")
        .selectAll("path")
            .data(nodes);

    mapFeatures.enter()
        .append("path")
        .attr("fill", d => Utils.colorLayers(d))
            .attr("d", path)
                .attr("class", d => `CO-${d.properties.joined.code}`)
                .on("mouseover", d => Utils.highlight(d)) 
                .on("mouseout", d => Utils.unHighlight(d));

    let dataForLabels = nodes;
    if (layer === 'counties_cart_hex_10000_wgs84') {
        const hexDissolved = topojson.feature(data, data.objects['counties_cart_hex_10000d_wgs84']).features;

        const mapOverlayFeatures = svg.append("g")
            .attr("class", "features-overlay")
            .selectAll("path")
                .data(hexDissolved);

        mapOverlayFeatures.enter()
            .append("path")
                .attr("fill", "none")
                .attr("d", path);

        dataForLabels = hexDissolved;
    };

    svg.selectAll(".feature-label")
        .data(dataForLabels)
        .enter().append("text")
            .attr("class", "feature-label" )
            .attr("transform", d => `translate(${path.centroid(d)})`)
            .attr("dy", ".35em")
            .text( d => d.properties.joined.districtAbbr);

    if (layer !== "counties_wgs84") {
        if (layer.match("counties_cart_")) {
            drawAreaLegend( {
                "typeOfArea": 'circle',
                "data": nodes, 
                "variable": "totValidVotes",
                "maxCircleSize": 55, 
                "svg": svg,
                "legendData": [300000, 100000]
            });
        } else {
            drawAreaLegend( {
                "typeOfArea": 'square',
                "data": nodes, 
                "variable": "totValidVotes",
                "maxCircleSize": 120, 
                "svg": svg,
                "legendData": [300000, 100000]
            });
        }
    }
};

export const drawDorling = (geo_data, layer, svg) => {
    // https://bl.ocks.org/nitaku/49a6bde57d8d8555b6823c8c6d05c5a8/ac5cc21562ba29d015a6375d9a8e854020eede1f

    const zoomable_layer = svg.append('g');
    const radius = d3.scaleSqrt().range([0, 55]);

    const simulation = d3.forceSimulation()
        .force('collision', d3.forceCollide( d => {
        return d.r + 0.35;
    })).force('attract', d3.forceAttract().target( d => {
        return [d.foc_x, d.foc_y];
    }));

    const contents = zoomable_layer.append('g');

    const getGeo = () => {
        const land = topojson.merge(geo_data, geo_data.objects.counties_wgs84.geometries);
        contents.append('path').attrs({ "class": 'land', d: path(land) });

        const nodes = topojson.feature(geo_data, geo_data.objects[layer]).features;
        nodes.forEach( d => {
            if (d.geometry.type === 'Polygon') {
                return d.main = d;
            } else if (d.geometry.type === 'MultiPolygon') {
                const subpolys = [];
                d.geometry.coordinates.forEach( p => {
                    const sp = {};
                    sp = {
                        coordinates: p,
                        properties: d.properties,
                        type: 'Polygon'
                    };
                    sp.area = d3.geoArea(sp);
                    return subpolys.push(sp);
                });
                return d.main = subpolys.reduce(( (a, b) => {
                    return (a.area > b.area) ? a : b;
                }), subpolys[0]);
            }
        });

        const getBubbles = () => {
            const population_data = [];
            nodes.forEach( d => {
                return population_data.push({
                    parent: 'romania',
                    country: d,
                    properties: d.properties,
                    totValidVotes: +d.properties.joined.totValidVotes,
                });
            });

            radius.domain([ 0, d3.max(population_data, d => d.totValidVotes) ]);
            population_data.forEach( d => { 
                return d.r = radius(d.totValidVotes); 
            });
            population_data.forEach( d => {
                d.centroid = projection(d3.geoCentroid(d.country.main));
                d.x = d.centroid[0];
                d.y = d.centroid[1];
                d.foc_x = d.centroid[0];
                return d.foc_y = d.centroid[1];
            });

            const bubbles = zoomable_layer.selectAll('.bubble')
                .data(population_data);
            const enBubbles = bubbles.enter()
                .append('circle')
                .attrs({
                    "class": d => `bubble CO-${d.properties.joined.code}`,
                    r: d => d.r,
                    fill: d => Utils.colorLayers(d) })
                .on("mouseover", d => Utils.highlight(d)) 
                .on("mouseout", d => Utils.unHighlight(d));

            const labels = zoomable_layer.selectAll('.feature-label')
                .data(population_data);
            const enLabels = labels.enter()
                .append('g')
                .attrs({ "class": 'feature-label' });
            enLabels.append('text')
                .text( d => d.properties.joined.districtAbbr)
                .attrs({ dy: '0.35em' });

            simulation.nodes(population_data).stop();

            let j = 0;
            for (let i = j = 0, ref = Math.ceil(Math.log(simulation.alphaMin()) / Math.log(1 - simulation.alphaDecay())); 0 <= ref ? j < ref : j > ref; i = 0 <= ref ? ++j : --j) {
                simulation.tick();
            }

            enBubbles.attrs({
                transform: d => `translate(${d.x},${d.y})`
            });
            return enLabels.attrs({
                transform: d => `translate(${d.x},${d.y})`
            });

        };

        drawAreaLegend( {
            "typeOfArea": 'circle',
            "data": nodes, 
            "variable": "totValidVotes", 
            "maxCircleSize": 55, 
            "svg": svg,
            "legendData": [300000, 100000]
        });

        return getBubbles();
    };

    getGeo();
    
};

export const drawDemers = (geo_data, layer, svg) => {
    // https://bl.ocks.org/martgnz/34880f7320eb5a6745e2ed7de7914223

    const padding = 3;
    const land = topojson.merge(geo_data, geo_data.objects.counties_wgs84.geometries);
    svg.append('path').attrs({ "class": 'land', d: path(land) });

    const nodes = topojson.feature(geo_data, geo_data.objects[layer]).features;
    const font = d3.scaleLinear()
        .range([6, 20])
        .domain(d3.extent(nodes, d => d.properties.joined.totValidVotes));
    const size = d3.scaleSqrt()
        .range([5, 120])
        .domain(d3.extent(nodes, d => d.properties.joined.totValidVotes));

    nodes.forEach( d => {
        d.pos = path.centroid(d);
        d.area = size(d.properties.joined.totValidVotes);
        [d.x, d.y] = d.pos;
    });

    const collide = () => {
        for (let k = 0, iterations = 4, strength = 0.5; k < iterations; ++k) {
            for (let i = 0, n = nodes.length; i < n; ++i) {
                for (let a = nodes[i], j = i + 1; j < n; ++j) {
                    let b = nodes[j],
                        x = a.x + a.vx - b.x - b.vx,
                        y = a.y + a.vy - b.y - b.vy,
                        lx = Math.abs(x),
                        ly = Math.abs(y),
                        r = a.area / 2 + b.area / 2 + padding;
                    if (lx < r && ly < r) {
                        if (lx > ly) {
                            lx = (lx - r) * (x < 0 ? -strength : strength);
                            (a.vx -= lx), (b.vx += lx);
                        } else {
                            ly = (ly - r) * (y < 0 ? -strength : strength);
                            (a.vy -= ly), (b.vy += ly);
                        }
                    }
                }
            }
        }
    };

    const simulation = d3.forceSimulation(nodes)
        .force('x', d3.forceX(d => d.x).strength(0.1))
        .force('y', d3.forceY(d => d.y).strength(0.1))
        .force('collide', collide);
    for (let i = 0; i < 120; ++i) simulation.tick();

    const rect = svg
        .selectAll('g')
        .data(nodes)
        .enter()
            .append('g')
            .attr('transform', d => `translate(${d.x}, ${d.y})`);
    rect
        .append('rect')
        .attr("class", d => `bubble CO-${d.properties.joined.code}`)
        .attr('width', d => d.area)
        .attr('height', d => d.area)
        .attr('x', d => -d.area / 2)
        .attr('y', d => -d.area / 2)
        .attr('fill', d => Utils.colorLayers(d))
        .attr('rx', 2)
            .on("mouseover", d => Utils.highlight(d)) 
            .on("mouseout", d => Utils.unHighlight(d));
    rect
        .append('text')
        .attr("class", "feature-label" )
        .filter(d => d.area > 18)
        .style('font-family', 'sans-serif')
        .style('font-size', d => `${font(d.properties.joined.totValidVotes)}px`)
        .attr('text-anchor', 'middle')
        .attr('dy', 2)
        .text(d => d.properties.joined.districtAbbr);

    const node = svg.selectAll("rect")
        .data(nodes)
        .enter().append("rect")
        .attr("width", d => { return d.r * 2; })
        .attr("height", d => { return d.r * 2; });

    const tick = (e) => {
        node.attr("x", d => { return d.x - d.r; })
            .attr("y", d => { return d.y - d.r; });
    };

    drawAreaLegend( {
        "typeOfArea": 'square',
        "data": nodes, 
        "variable": "totValidVotes", 
        "maxCircleSize": 120, 
        "svg": svg,
        "legendData": [300000, 100000]
    });
};

export const drawNonCont = (data, layer, svg) => {
    // https://strongriley.github.io/d3/ex/cartogram.html

    const nodes = topojson.feature(data, data.objects[layer]).features;
    
    svg.append("g")
        .attr("class", "black")
        .selectAll("path")
            .data(nodes)
            .enter()
            .append("path")
            .attr("d", path);
    svg.append("g")
        .attr("class", "land")
        .selectAll("path")
            .data(nodes)
            .enter()
            .append("path")
            .attr("d", path);

    svg.append("g")
        .attr("class", "white")
        .selectAll("path")
            .data(nodes)
            .enter()
            .append("path")
            .attr("fill", d => Utils.colorLayers(d))
            .attr("transform", d => {
                const centroid = path.centroid(d),
                    x = centroid[0],
                    y = centroid[1];
                return `translate(${x},${y})`
                    + `scale(${Math.sqrt(d.properties.joined.totValidVotes / 300000) || 0})`
                    + `translate(${-x},${-y})`;
            })
            .attr("d", path)
            .attr("class", d => `CO-${d.properties.joined.code}` )
                .on("mouseover", d => Utils.highlight(d)) 
                .on("mouseout", d => Utils.unHighlight(d));

    const labels = svg.selectAll(".feature-label")
        .data(nodes)
        .enter().append("text")
            .attr("class", "feature-label" )
            .attr("transform", d => `translate(${path.centroid(d)})`)
            .attr("dy", ".35em")
            .text( d => d.properties.joined.districtAbbr);

        nodes.forEach( d => {
            d.properties.joined.totValidVotes_rate = Math.ceil( d.properties.joined.totValidVotes / Math.sqrt(d.properties.joined.totValidVotes / 300000) );
        });

        drawAreaLegend( {
            "typeOfArea": 'square',
            "data": nodes, 
            "variable": "totValidVotes_rate",
            "maxCircleSize": 120, 
            "svg": svg,
            "legendData": [300000, 100000]
        });

};


// Stats.js

export const groupvotesByCounties = (data) => {

    let resultByCounty = [];
    data.reduce( (res, data_row) => {
        const columns = ['c', 'g1', 'g2', 'g3', 'g4', 'g5', 'g6', 'g7', 'g8', 'g9', 'g10', 'g11', 'g12', 'g13', 'g14'];

        if (!res[data_row['Cod birou electoral']]) {
            res[data_row['Cod birou electoral']] = {
               'Cod birou electoral': data_row['Cod birou electoral'],
               'Județ': data_row['Județ']
            };
            columns.forEach( col => {
                res[data_row['Cod birou electoral']][col] = 0;               
            });
            res[data_row['Cod birou electoral']]

            resultByCounty.push(res[data_row['Cod birou electoral']]);
        };
        columns.forEach( col => {
            res[data_row['Cod birou electoral']][col] += Number(data_row[col]);
        });

        return res;
    }, {});

    return resultByCounty;
}

export const groupVotesByCandidates = (resultByCounty) => {

    const resultByCandidates = [];
    const columns = ['g1', 'g2', 'g3', 'g4', 'g5', 'g6', 'g7', 'g8', 'g9', 'g10', 'g11', 'g12', 'g13', 'g14'];
    columns.forEach( col => {
        const result = resultByCounty.reduce( (res, data_row) => {
            if (!res[data_row[col]]) {
                res[data_row['Județ']] = data_row[col];
            };

            return res;
        }, {});

        const keys = Object.keys(result);
        const votes = keys.map( v =>  result[v] );
        const total = votes.reduce((a, b) => a + b, 0);
        result.total = total;

        resultByCandidates[CANDIDATES_2019[col]] = result;
    });

    let keys = Object.keys(resultByCandidates);

    let totCountry = 0;
    keys.forEach( k => totCountry += resultByCandidates[k].total );
    keys.forEach( k => {
        resultByCandidates[k].totalCountry = totCountry;
        resultByCandidates[k].rateCountry = ((resultByCandidates[k].total/totCountry) * 100).toFixed(3);
    });

    return resultByCandidates;
};

export const setVotesByCodeGroup = (data, an) => {
    let votesByCode = d3.map();
    data.forEach( d => {
        let fieldMap = fieldMap(d);
        votesByCode.set(fieldMap['Cod birou electoral'][an], {
            'totValidVotes': fieldMap.totValidVotes[an],
            'vote1': fieldMap.vote1[an],
            'candidate1': fieldMap.candidate1[an],
            'vote2': fieldMap.vote2[an],
            'candidate2': fieldMap.candidate2[an],
            'electoralDistrict': fieldMap.electoralDistrict[an],
            'rate1': fieldMap.rate1[an],
            'rate1Color': fieldMap.rate1Color[an],
            'rate2': fieldMap.rate2[an],
            'rate2Color': fieldMap.rate2Color[an],
        });
    });

    return votesByCode;
}

// Utils.js

export const roundToNearestMultipleOf = m => n => Math.ceil(Math.round(n/m)*m);

export const pair = (array) => {
    return array.slice(1).map( (b, i) => {
        return [array[i], b];
    });
}

export const colorLayers = (d) => {
    return ( d.properties.joined.rate1 > d.properties.joined.rate2 ) 
                ? colorScaleRed(d.properties.joined.rate1) 
                : colorScaleBlue(d.properties.joined.rate2);
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

