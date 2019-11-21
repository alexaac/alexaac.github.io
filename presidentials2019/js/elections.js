import * as Config from './Config.js'
import * as Stats from './Stats.js'
import mapDataFactory from './MapFactory.js'
import * as DrawLegend from './DrawLegend.js'
import * as DrawMaps from './DrawMaps.js'

(() => {
    // const mapArea = d3.select("#chart").append('map-area');

    const width = Config.width,
          height = Config.height;

    const svg1 = d3.select("#legend-percent").append("svg").attr("class", "chart-group").attr("preserveAspectRatio", "xMidYMid").attr("viewBox", "0 0 " + width + " " + 150);
    const svg2 = d3.select("#legend-population").append("svg").attr("class", "chart-group").attr("preserveAspectRatio", "xMidYMid").attr("viewBox", "0 0 " + width + " " + height);
    const svg3 = d3.select("#geography").append("svg").attr("class", "chart-group").attr("preserveAspectRatio", "xMidYMid").attr("viewBox", "0 0 " + width + " " + height);
    const svg4 = d3.select("#gastner-c-cartogram").append("svg").attr("class", "chart-group").attr("preserveAspectRatio", "xMidYMid").attr("viewBox", "0 0 " + width + " " + height);
    const svg5 = d3.select("#gastner-g-cartogram").append("svg").attr("class", "chart-group").attr("preserveAspectRatio", "xMidYMid").attr("viewBox", "0 0 " + width + " " + height);
    const svg6 = d3.select("#dorling-cartogram").append("svg").attr("class", "chart-group").attr("preserveAspectRatio", "xMidYMid").attr("viewBox", "0 0 " + width + " " + height);
    const svg7 = d3.select("#demers-cartogram").append("svg").attr("class", "chart-group").attr("preserveAspectRatio", "xMidYMid").attr("viewBox", "0 0 " + width + " " + height);
    const svg8 = d3.select("#noncont-cartogram").append("svg").attr("class", "chart-group").attr("preserveAspectRatio", "xMidYMid").attr("viewBox", "0 0 " + width + " " + height);
    const svg9 = d3.select("#candidates-donut").append("svg").attr("class", "chart-group").attr("preserveAspectRatio", "xMidYMid").attr("viewBox", "0 0 " + width + " " + height);
    const svg10 = d3.select("#counties-treemap").append("svg").attr("class", "chart-group").attr("preserveAspectRatio", "xMidYMid").attr("viewBox", "0 0 " + width + " " + height);

    let promiseData = [];
    let dataAlegeri = "2019";

    const promises = [
        d3.json("./data/counties_bundle.json"),
        d3.csv("./data/pv_RO_PRSD_FINAL.csv"),
        d3.csv("./data/pv_SR_PRSD_FINAL.csv")
    ]

    Promise.all(promises).then( data => {
        promiseData = data;
        changeView(dataAlegeri, promiseData);
    }).catch( 
        // error => console.log(error) 
    );

    const changeView = (dataAlegeri, data) => {
        const geographicData = data[0],
              electionsData2019RO = data[1],
              electionsData2019SR = data[2];

        const electionsData2019 = [...electionsData2019RO, ...electionsData2019SR];

        let votesByCounties = [],
            votesByCode = {};

        votesByCounties = Stats.groupvotesByCounties(electionsData2019);
        votesByCode = Stats.setVotesByCodeGroup(votesByCounties, 'alegeri_2019');

        const mapVehicle = mapDataFactory(geographicData, votesByCode);

        mapVehicle(DrawLegend.drawVotesPercentageLegend, 'counties_wgs84', svg1);
        mapVehicle(DrawLegend.drawVotesByPopulationLegend, 'counties_wgs84', svg2);
        mapVehicle(DrawMaps.draw, 'counties_wgs84', svg3);
        mapVehicle(DrawMaps.draw, 'counties_cart_wgs84', svg4);
        mapVehicle(DrawMaps.draw, 'counties_cart_hex_10000_wgs84', svg5);
        mapVehicle(DrawMaps.drawDorling, 'counties_wgs84', svg6);
        mapVehicle(DrawMaps.drawDemers, 'counties_wgs84', svg7);
        mapVehicle(DrawMaps.drawNonCont, 'counties_wgs84', svg8);

        mapVehicle(DrawLegend.drawScaleBar, 'counties_wgs84', svg3);

        const votesByCandidates = Stats.groupVotesByCandidates(votesByCounties);
        DrawLegend.drawCandidatesDonut(votesByCandidates, svg9);
        DrawLegend.drawCountiesTreemap(votesByCounties, svg10);
    };

}).call(this);