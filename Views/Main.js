import React, {Component} from 'react';
import { Text, View, TextInput, Image, ImageBackground, Alert, TouchableOpacity, PermissionsAndroid, ActivityIndicator, ScrollView, RefreshControl, ToastAndroid } from 'react-native';
import Geolocation from "react-native-geolocation-service";
import NetInfo from "@react-native-community/netinfo";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {Cache} from 'react-native-cache';
import SplashScreen from "react-native-splash-screen";

import riverManager from "./managers/river";
import weatherManager from "./managers/weather";
import coronaManager from "./managers/corona";

import constant from "../Utils/constant";
import {date} from "../Utils/filter";
import {author, ment} from "../Utils/goodMents";

//style
import main from '../Assets/views/_main';

const cache = new Cache({
    namespace: "myapp",
    policy: {
        maxEntries: 50000
    },
    backend: AsyncStorage
});

const icons = {
    "01d": require('../images/icons/01d.png'),
    "01n": require('../images/icons/01n.png'),
    "02d": require('../images/icons/02d.png'),
    "02n": require('../images/icons/02n.png'),
    "03d": require('../images/icons/03d.png'),
    "03n": require('../images/icons/03n.png'),
    "04d": require('../images/icons/04d.png'),
    "04n": require('../images/icons/04n.png'),
    "09d": require('../images/icons/09d.png'),
    "09n": require('../images/icons/09n.png'),
    "10d": require('../images/icons/10d.png'),
    "10n": require('../images/icons/10n.png'),
    "11d": require('../images/icons/11d.png'),
    "11n": require('../images/icons/11n.png'),
    "13d": require('../images/icons/13d.png'),
    "13n": require('../images/icons/13n.png'),
    "50d": require('../images/icons/50d.png'),
    "50n": require('../images/icons/50n.png'),
}

class Main extends Component {
    constructor(props) {
        super(props);
        this.state = {
            searchText: '',
            lat: 0,
            lon: 0,
            riverTemp: '',
            name: '',
            weatherType: '', //?????? ??????
            w_icon: '', //?????? ?????????
            temp_max: '',
            temp_min: '',
            temp: '',
            s_temp: '', // ?????? ??????
            refreshDate: this.dateFormat(),
            nowTime: new Date(), // ?????? ??????
            loadingToggle: false,
            refreshing: false,
            author: author,
            mentArr: ment,
            ment: '',
            authorName: '',
            refreshStay: '',
            deathCnt: 0,
            totalCnt: 0,
            previousDay: 0,
            baseDate: '',
        };
    }
    async componentDidMount() {
        setTimeout(() => {
            SplashScreen.hide();
        }, 500);
        await this.requestLocationPermission();
        await this.cacheToState();
        await this.getData();
    }

    handler = (e, key) => {
        let temp = [];
        temp[key] = e;
        this.setState(temp);
    }

    async cacheToState () {
        let weatherCache = await cache.get('weather');
        let riverCache = await cache.get('riverTemp');
        let coronaCache = await cache.get('corona');
        try {
            if(typeof(weatherCache) !== 'undefined' && typeof(riverCache) !== 'undefined' && typeof(coronaCache) !== 'undefined') {
                let cacheData = {
                    name: weatherCache.name,
                    w_icon: weatherCache.w_icon,
                    weatherType: weatherCache.weatherType,
                    temp_max: weatherCache.temp_max,
                    temp_min: weatherCache.temp_min,
                    temp: weatherCache.temp,
                    s_temp: weatherCache.s_temp, // ?????? ??????
                    riverTemp: riverCache.riverTemp, // ??? ??????
                    deathCnt: coronaCache.deathCnt,
                    totalCnt: coronaCache.totalCnt,
                    previousDay: coronaCache.previousDay,
                    baseDate: coronaCache.baseDate,
                };
                await this.setState(cacheData);
            } else {
                await this.getNeighborhoodTemp();
            }
        } catch(err) {
            console.log(err);
        }

    }

    async getRiverTemp () {
        let query = {apikey: constant.apikey}
        const {status, data} = await riverManager.get(query);
        if(status === 200) {
            if(data[0].result == "success") {
                let riverTemp = {riverTemp: data[1].respond.temp};
                await this.setState(riverTemp);
                await cache.set('riverTemp', riverTemp);
            } else {
                console.log('?????? ?????? ??????');
            }
        } else {
            console.log('??????');
        }
    }

    async getNeighborhoodTemp () {
        await Geolocation.getCurrentPosition( async (position) => {
            let lat = position.coords.latitude;
            let lon = position.coords.longitude;
            let query = {
                lat: lat,
                lon: lon,
                appid: constant.weatherKey,
                lang: 'kr'
            };
            const {status, data} = await weatherManager.get(query);
            if(status === 200) {
                let weather = data.weather;
                let main = data.main;
                let wind = data.wind;
                let weatherData = {
                    w_icon: weather[0].icon,
                    weatherType: weather[0].description, //?????? ??????
                    temp_max: this.Kconvert(main.temp_max),
                    temp_min: this.Kconvert(main.temp_min),
                    temp: this.Kconvert(main.temp),
                    s_temp: this.windChillTemp(main.temp, wind.speed), // ?????? ??????
                    name: data.name,
                };
                await this.setState(weatherData);
                await cache.set('weather', weatherData);
            } else {
                console.log('??????');
            }
        }, (error) => {
            alert('?????? ?????? ?????? ???????????????\n??????????????????. ?????? ????????? ??????????????????.');
            console.log('ERROR :' + error.message);
            //????????? ?????? ??? ?????? AndroidManifest.xml ?????? ????????? ???
        });
    }

    Kconvert (kelvin) {
        let kelvinZero = parseFloat(273.15);
        let celsius = 0;
        celsius = parseFloat(kelvin - kelvinZero);
        return celsius.toFixed(1);
    }

    windChillTemp (kelvin, wind) {
        //??????????????? ?????? API??? ????????? kelvin ?????? ??????
        let kelvinZero = parseFloat(273.15);

        let t2 = 0;
        let v2 = wind;
        let windChill = 0;

        t2 = parseFloat(kelvin - kelvinZero);

        let v3 = Math.pow(v2*3.6, 0.16);
        windChill = 13.12 + 0.6215*t2 - (11.37*v3)+0.3965*v3*t2;
        return windChill.toFixed(1);
    }

    dateFormat () {
        let sampleTimestamp = Date.now(); //???????????? ??????????????? 13?????? ???)1599891939914
        let date = new Date(sampleTimestamp); //?????????????????? ????????? ?????? Date ?????? ??????
        let week = ['?????????', '?????????', '?????????', '?????????', '?????????', '?????????', '?????????'];
        let month = ("0" + (date.getMonth() + 1)).slice(-2); //??? 2?????? (01, 02 ... 12)
        let day = ("0" + date.getDate()).slice(-2); //??? 2?????? (01, 02 ... 31)
        let hour = ("0" + date.getHours()).slice(-2); //??? 2?????? (00, 01 ... 23)
        let minute = ("0" + date.getMinutes()).slice(-2); //??? 2?????? (00, 01 ... 59)

        let today = new Date().getDay();
        let todayLabel = week[today];

        let refreshTime = month+'??? '+day+'??? '+todayLabel+' '+ hour+':'+minute;

        return refreshTime;
    }
    
    async requestLocationPermission () {
    //    ?????? ?????????
        const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION);
        if(!granted) {
            try {
                //????????? ?????? ??????????????? ?????????
                if(granted != PermissionsAndroid.RESULTS.GRANTED) {
                    alert('???????????? ????????? ?????????????????????.\n?????? ????????? ???????????????.');
                }
            } catch (err) {
                alert('????????? ?????? ??????');
            }
        }
    }

    async getData () {
        await this.getRiverTemp();
        await this.coronaApiFilter();
        await this.randomMent();
    }

    async refreshButton (e) {
        e.preventDefault();
        await this.setState({refreshDate: this.dateFormat(), loadingToggle: true});
        await this.getNeighborhoodTemp();
        await this.getRiverTemp();
        await this.coronaApiFilter();
        await this.setState({loadingToggle: false});
    }

    async refreshData () {
        await this.setState({refreshDate: this.dateFormat()});
        await this.getNeighborhoodTemp();
        await this.getRiverTemp();
        await this.coronaApiFilter();
        await this.randomMent();
    }

    wait = (timeout) => {
        return new Promise(resolve => setTimeout(resolve, timeout));
    }

    _onRefresh = async () => {
        await NetInfo.fetch().then(async state => {
            if(state.isConnected){
                //    ????????? ??????
                await this.setState({refreshing: true});
                await this.wait(0).then( async() => {
                    await this.refreshData();
                });
            } else {
                //    ????????? ?????? ??????
                ToastAndroid.showWithGravityAndOffset(
                    "???????????? ?????????????????????",
                    ToastAndroid.SHORT,
                    ToastAndroid.BOTTOM,
                    25,
                    100
                );
            }
        });
    }

    async coronaApiFilter () {
        let coronaCache = await cache.get('corona');
        try {
            if(typeof(coronaCache) == 'undefined') {
                await this.getCoronaData();
            } else {
                let splitDate = (coronaCache.baseDate).split(' ');
                let dateObj = [];
                for(let i in splitDate) {
                    dateObj.push(splitDate[i].slice(0, -1));
                }
                let date = new Date();
                let cacheDate = new Date(dateObj[0], dateObj[1], dateObj[2], dateObj[3]);
                let toDay = new Date(date.getFullYear(), date.getMonth()+1, date.getDate(), date.getHours());
                if((toDay - cacheDate)/(60*60*1000) > 24) {
                    await this.getCoronaData();
                }
            }
        } catch (e) {
            console.log('undefined Error');
        }
    }

    async getCoronaData () {
        let query = {
            ServiceKey: constant.coronaKey,
            pageNo: '1',
            numOfRows: '10',
            startCreateDt: date(new Date(),'yyyyMMdd'),
            endCreateDt: date(new Date(),'yyyyMMdd'),
        };

        const {status, data} = await coronaManager.get(query);
        if(status === 200) {
            try {
                let resultCode = data.response.header.resultCode;
                let itemExist = false;
                if(typeof(data.response.body) !== 'undefined'){
                    itemExist = true;
                }
                if(resultCode == "00" ){
                    let xmlArrays = data.response.body.items.item;
                    let total = '';
                    for (let i in xmlArrays) {
                        if(Array.isArray(xmlArrays) && xmlArrays[i].gubun == '??????') {
                            total = xmlArrays[i];
                        }
                    }
                    let coronaData = {
                        deathCnt: total.deathCnt.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","),
                        totalCnt: total.defCnt.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","),
                        previousDay: total.incDec.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","),
                        baseDate: total.stdDay,
                    };
                    await this.setState(coronaData);
                    await cache.set('corona', coronaData);
                    await this.setState({refreshing: false});
                } else {
                    let coronaData = cache.get('corona');
                    await this.setState(coronaData);
                    await this.setState({refreshing: false});
                }
            } catch(err) {
                console.log('error ' + err);
            }
        } else {
            console.log('Corona Get Error');
        }
    }

    async randomMent () {
        let {author, mentArr} = this.state;
        let mentLength = mentArr.length;
        let randomNum = Math.floor(Math.random() * mentLength);
        let ment = mentArr[randomNum];
        let authorName = author[randomNum];

        await this.setState({ment: ment, authorName: authorName});
    }

    render() {
        const {searchText, riverTemp, name, weatherType, temp_max, temp_min,
            temp, s_temp, refreshDate, nowTime, loadingToggle, w_icon,
            deathCnt, totalCnt, previousDay, baseDate, ment, authorName} = this.state;
        return (
            <ScrollView refreshControl={
                <RefreshControl
                    refreshing={this.state.refreshing}
                    onRefresh={this._onRefresh}
                />
            }>
            <View style={main.container}>
                <View style={main.weatherIconWrap}>
                    <View style={main.weatherTempDetailWrap}>
                        <View style={main.weatherTempLeftWrap}>
                            <Image
                                style={main.weatherIcon}
                                source={icons[w_icon]}
                            />
                            <Text style={main.weatherTemp}>{temp ? temp : '0'}??</Text>
                        </View>
                        <View style={main.weatherTempRightWrap}>
                            <Text style={main.weatherTempDetailText}>{name ? name : '-'}</Text>
                            <Text style={main.weatherTempDetailText}>{weatherType ? weatherType : '-'}</Text>
                            <Text style={main.weatherTempDetailText}>{temp_max ? temp_max : '0'}?? / {temp_min ? temp_min : '0'}??</Text>
                            <Text style={main.weatherTempDetailText}>???????????? {s_temp ? s_temp : '0'}??</Text>
                        </View>
                    </View>
                    <View style={main.weatherRefreshWrap}>
                        <Text style={main.weatherRefreshText}>{refreshDate}</Text>
                        <TouchableOpacity style={main.weatherRefresh} onPressOut={e => this.refreshButton(e)}>
                            {
                                loadingToggle ?
                                    <ActivityIndicator size="small" color="#ccc" />
                                    :
                                    <Image style={main.weatherRefreshImage} source={require('../images/icons/refresh_icon.png')}/>
                            }
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={main.riverTempWrap}>
                    <ImageBackground style={main.riverTempBack} source={nowTime.getHours() > 6 || nowTime.getHours() < 18 ? require('../images/commons/river_morning.jpg') : require('../images/commons/river_night.jpg')}>
                        <View style={main.riverTextWrap}>
                            <Text style={main.riverTempText}>?????? ?????? ??????</Text>
                            <Text style={main.riverTemperature}>{riverTemp} ??C</Text>
                        </View>
                    </ImageBackground>
                </View>
                <View style={main.coronaWrap}>
                    <View style={main.coronaTop}>
                        <View style={main.coronaTextWrap}>
                            <Text>????????? ??? ?????????</Text>
                            <Text style={main.coronaSplitText}>{totalCnt}<Text style={main.coronaHighlight}> ( +{previousDay})</Text></Text>
                        </View>
                        <View style={main.coronaTextWrap}>
                            <Text>????????? ??? ?????????</Text>
                            <Text style={main.coronaSplitText}>{deathCnt}</Text>
                        </View>
                    </View>
                    <View style={main.coronaBottom}>
                        <Text style={main.coronaBottomText}>????????? {baseDate}</Text>
                    </View>
                </View>
                <View style={main.hopeTextWrap}>
                    <Text style={main.hopeText}>
                        {ment}
                    </Text>
                    {
                        authorName ?
                            <Text style={main.hopeTextAuthor}>
                                {authorName}
                            </Text>
                            :
                            null
                    }
                </View>
            </View>
            </ScrollView>
        );
    }
}

export default Main;