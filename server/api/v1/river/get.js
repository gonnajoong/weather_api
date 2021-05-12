import axios from 'axios';

const open_API_river = "https://api.qwer.pw/request/hangang_temp";
const apiKey = "apikey=guest";
let result = "";

let response = axios.get(open_API_river + '?' + apiKey);
console.log('리스폰스 ' + response.respond);
if(response[0].result == "success") {
    result = response[1].respond;
} else {
    result = "fail"
}

export default get;