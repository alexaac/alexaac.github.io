import * as Config from './Config.js'
import * as Stats from './Stats.js'

const formatCountyData = (data, votesByCounties, electionsDate) => {
    const electoralDataByDistrict = Stats.groupElectoralDataByDistrict(votesByCounties, electionsDate);

    Config.LAYERLIST.forEach( layer => {
        data.objects[layer].geometries = data.objects[layer].geometries
        .filter( d => { 
            if (typeof(electoralDataByDistrict.get(d.properties.cod_birou)) != "undefined") {
                return d;
            };
        });
        data.objects[layer].geometries
        .forEach( d => {
            try {

                d.properties.joined = electoralDataByDistrict.get(d.properties.cod_birou);
                d.properties.joined.code = d.properties.cod_birou;
                d.properties.joined.districtAbbr = d.properties.abbr;
                d.properties.joined.vvot_sqkm = d.properties.vvot_sqkm;

                return d;
            } catch (error) {
                // console.log(error);
            };
        });
    });

    return data;
}

const mapDataFactory = (data, electionsData, electionsDate) => {

    const votesByCounties = Stats.groupvotesByCounties(electionsData),
        votesByCandidates = Stats.groupVotesByCandidates(votesByCounties);

    const formattedData = formatCountyData(data, votesByCounties, electionsDate);

    const votesStats = {
        formattedData: formattedData,
        votesByCounties: votesByCounties,
        votesByCandidates: votesByCandidates,
        // electoralDataByDistrict: electoralDataByDistrict
    };

    return (callback, layer, svg) => {
        return callback(votesStats, layer, svg);
    }
};

export default mapDataFactory;