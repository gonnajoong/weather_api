import resource from "../../Utils/constant";
import http from "../../Utils/http";

const getCorona = resource.corona;

const get = data => {
    return new Promise(async (resolve, reject) => {
        try {
            const req = http(getCorona);
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
}