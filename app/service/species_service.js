import axios from "axios";
import appConfig from '../../app.json'

exports.getSpeciesDetails = (scientificName) => {
    const findUrl = appConfig.app.backend.url + appConfig.app.backend.endpoints.findSpeciesByScientificName
    return axios.get(findUrl, {params: {speciesScientificName: scientificName}})
}