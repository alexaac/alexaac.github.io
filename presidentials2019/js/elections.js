import * as Config from './Config.js'
import * as Utils from './Utils.js'
import mapDataFactory from './MapFactory.js'
import * as DrawLegend from './DrawLegend.js'
import * as DrawMaps from './DrawMaps.js'

(() => {
    // const mapArea = d3.select("#chart").append('map-area');

    let geographicData, electionsData2019Round1, electionsData2019Round2;
    let electionsDate = "2019-11-10";

    d3.select("#rounds-btn")
        .on("click", function(){
            var button = d3.select(this);
            if (button.text() == "See Elections Results From Round 1"){
                button.text("See Elections Results From Round 2");
                changeView(electionsData2019Round1, '2019-11-10');
            }
            else {
                button.text("See Elections Results From Round 1");
                changeView(electionsData2019Round2, '2019-11-24');
            }
        })

    const promises = [
        d3.json("./data/counties_bundle.json"),
        d3.csv("./data/pv_RO_PRSD_FINAL.csv"),
        d3.csv("./data/pv_SR_PRSD_FINAL.csv"),
        d3.csv("./data/pv2_RO_PRSD_FINAL.csv"),
        d3.csv("./data/pv2_SR_PRSD_FINAL.csv"),
    ]

    Promise.all(promises).then( data => {
        geographicData = data[0];
        const electionsData2019RORound1 = data[1],
              electionsData2019SRRound1 = data[2],
              electionsData2019RORound2 = data[3],
              electionsData2019SRRound2 = data[4];

        electionsData2019Round1 = [...electionsData2019RORound1, ...electionsData2019SRRound1];
        electionsData2019Round2 = [...electionsData2019RORound2, ...electionsData2019SRRound2];

        changeView(electionsData2019Round1, electionsDate);
    }).catch( 
        // error => console.log(error) 
    );

    const changeView = (electionsData, electionsDate) => {

        const mapVehicle = mapDataFactory(geographicData, electionsData, electionsDate);

        const svgs = Utils.repaint();
        let svg1, svg2, svg3, svg4, svg5, svg6, svg7, svg8, svg9, svg10;
        [svg1, svg2, svg3, svg4, svg5, svg6, svg7, svg8, svg9, svg10] = [...svgs];

        mapVehicle(DrawLegend.drawVotesPercentageLegend, 'counties_wgs84', svg1);
        mapVehicle(DrawLegend.drawVotesByPopulationLegend, 'counties_wgs84', svg2);

        mapVehicle(DrawMaps.draw, 'counties_wgs84', svg3);
        mapVehicle(DrawMaps.draw, 'counties_cart_wgs84', svg4);
        mapVehicle(DrawMaps.draw, 'counties_cart_hex_10000_wgs84', svg5);
        mapVehicle(DrawMaps.drawDorling, 'counties_wgs84', svg6);
        mapVehicle(DrawMaps.drawDemers, 'counties_wgs84', svg7);
        mapVehicle(DrawMaps.drawNonCont, 'counties_wgs84', svg8);

        mapVehicle(DrawLegend.drawScaleBar, 'counties_wgs84', svg3);
        mapVehicle(DrawLegend.drawCandidatesDonut, 'counties_wgs84', svg9);
        mapVehicle(DrawLegend.drawCountiesTreemap, 'counties_wgs84', svg10);

    };

}).call(this);