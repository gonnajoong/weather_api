import resource from "../../Utils/constant";
import http from "../../Utils/http";

const getRiverTemp = resource.riverGetTemp;

const get = data => {
    return new Promise(async (resolve, reject) => {
        try {
            const req = http(getRiverTemp);
            resolve(await req.get(data));
        } catch (e) {
            resolve(e);
        }
    });
    // console.log('한강 온도 재는 함수 ');
    // return new Promise(async (resolve, reject) => {
    //     try {
    //         resolve(await axios.river('https://api.qwer.pw/request/hangang_temp?apikey=guest').then(
    //             (response) => {
    //                 let data = response['data'];
    //                 if(data[0].result == 'success') {
    //                     let riverTemp = {riverTemp: data[1].respond.temp};
    //                     this.setState(riverTemp);
    //                 } else {
    //                     alert('수온 요청 실패');
    //                 }
    //             }
    //         ).catch(function (error){
    //             console.log('에라 ' + error);
    //         }));
    //     } catch (e) {
    //         resolve(e);
    //     }
    // })
}

export {
    get
};

export default {
    get
}