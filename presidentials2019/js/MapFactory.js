import * as Config from './Config.js'
import * as Stats from './Stats.js'

const formatCountyData = (data, votesByCode) => {
    Config.LAYERLIST.forEach( layer => {
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

const mapDataFactory = (data, electionsData, electionsDate) => {

    const votesByCounties = Stats.groupvotesByCounties(electionsData),
        votesByCandidates = Stats.groupVotesByCandidates(votesByCounties),
        votesByCode = Stats.setVotesByCodeGroup(votesByCounties, electionsDate);

    const formattedData = formatCountyData(data, votesByCode);

    const votesStats = {
        formattedData: formattedData,
        votesByCounties: votesByCounties,
        votesByCandidates: votesByCandidates,
        votesByCode: votesByCode
    };

    return (callback, layer, svg) => {
        return callback(votesStats, layer, svg);
    }
};

export default mapDataFactory;