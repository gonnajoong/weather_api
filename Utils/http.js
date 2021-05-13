import axios from 'axios';

const generateQuery = query => {
    if (query && query instanceof Object) {
        const keys = Object.keys(query);
        if (keys.length) {
            let queryString = '?';
            keys.forEach(function (key, index) {
                if (index) queryString += '&';
                queryString += key + '=' + encodeURIComponent(query[key]);
            });
            return queryString;
        } else {
            return '';
        }
    } else {
        return '';
    }
};

class Http {
    constructor(url) {
        this.url = url;
        this.options = {};
    }


    get(query) {

        return new Promise(async (resolve, reject) => {
            resolve(axios.get(this.url + generateQuery(query), this.options));
        });
    }
}

export default (url) => {
    return new Http(url);
};