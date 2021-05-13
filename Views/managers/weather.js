import resource from "../../Utils/constant";
import http from "../../Utils/http";

const getWeather = resource.weather;

const get = data => {
    return new Promise(async (resolve, reject) => {
        try {
            const req = http(getWeather);
            resolve(await req.get(data));
        } catch (e) {
            resolve(e);
        }
    });
}

export {
    get
};

export default {
    get
};