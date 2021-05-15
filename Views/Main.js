import React, {Component} from 'react';
import { Text, View, TextInput, Image, ImageBackground, Alert, TouchableOpacity, PermissionsAndroid, ActivityIndicator, ScrollView, RefreshControl } from 'react-native';
import Geolocation from "react-native-geolocation-service";
import riverManager from "./managers/river";
import weatherManager from "./managers/weather";
import coronaManager from "./managers/corona";

import constant from "../Utils/constant";
import {date} from "../Utils/filter";
import {author, ment} from "../Utils/goodMents";

//style
import main from '../Assets/views/_main';

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

const wait = (timeout) => {
    return new Promise(resolve => setTimeout(resolve, timeout));
}

class Main extends Component {
    constructor(props) {
        super(props);
        this.state = {
            searchText: '',
            lat: 0,
            lon: 0,
            riverTemp: '',
            weatherType: '', //날씨 상태
            w_icon: '', //날씨 아이콘
            temp_max: '',
            temp_min: '',
            temp: '',
            s_temp: '', // 체감 온도
            refreshDate: this.dateFormat(),
            nowTime: new Date(), // 현재 시간
            loadingToggle: false,
            refreshing: false,
            author: author,
            mentArr: ment,
            ment: '',
            authorName: '',
        };
    }
    async componentDidMount() {
        await this.requestLocationPermission();
        await this.getsLocation();
        await this.getRiverTemp();
        await this.getNeighborhoodTemp(this.state.lat, this.state.lon);
        await this.getCorona();
        await this.randomMent();

    }

    handler = (e, key) => {
        let temp = [];
        temp[key] = e;
        this.setState(temp);
    }
    
    getsLocation = async () => {
        await Geolocation.getCurrentPosition( async (position) => {

            await this.setState({lat: position.coords.latitude, lon: position.coords.longitude});
        }, (error) => {
            alert('error : ' + error.message);
            //퍼미션 없을 시 실패 AndroidManifest.xml 에서 추가할 것
        });
    }

    async getRiverTemp () {
        let query = {apikey: constant.apikey}
        const {status, data} = await riverManager.get(query);
        if(status === 200) {
            if(data[0].result == "success") {
                let riverTemp = {riverTemp: data[1].respond.temp};
                await this.setState(riverTemp);
            } else {
                console.log('정보 요청 실패');
            }
        } else {
            console.log('에러');
        }
    }

    async getNeighborhoodTemp (lat, lon) {
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
            await this.setState({
                w_icon: weather[0].icon,
                weatherType: weather[0].description, //날씨 상태
                temp_max: this.Kconvert(main.temp_max),
                temp_min: this.Kconvert(main.temp_min),
                temp: this.Kconvert(main.temp),
                s_temp: this.windChillTemp(main.temp, wind.speed), // 체감 온도
            });
        } else {
            console.log('에러');
        }
    }

    Kconvert (kelvin) {
        let kelvinZero = parseFloat(273.15);
        let celsius = 0;
        celsius = parseFloat(kelvin - kelvinZero);
        return celsius.toFixed(1);
    }

    windChillTemp (kelvin, wind) {
        //켈빈온도를 받는 API라 변수도 kelvin 으로 받음
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
        let sampleTimestamp = Date.now(); //현재시간 타임스탬프 13자리 예)1599891939914
        let date = new Date(sampleTimestamp); //타임스탬프를 인자로 받아 Date 객체 생성
        let week = ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'];
        let month = ("0" + (date.getMonth() + 1)).slice(-2); //월 2자리 (01, 02 ... 12)
        let day = ("0" + date.getDate()).slice(-2); //일 2자리 (01, 02 ... 31)
        let hour = ("0" + date.getHours()).slice(-2); //시 2자리 (00, 01 ... 23)
        let minute = ("0" + date.getMinutes()).slice(-2); //분 2자리 (00, 01 ... 59)

        let today = new Date().getDay();
        let todayLabel = week[today];

        let refreshTime = month+'월 '+day+'일 '+todayLabel+' '+ hour+':'+minute;

        return refreshTime;
    }
    
    async requestLocationPermission () {
    //    동적 퍼미션
        const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION);
        if(!granted) {
            try {
                //퍼미션 요청 다이얼로그 보이기
                if(granted != PermissionsAndroid.RESULTS.GRANTED) {
                    alert('위치정보 사용을 거부하셨습니다.\n앱의 기능이 제한됩니다.');
                }
            } catch (err) {
                alert('퍼미션 작업 에러');
            }
        }
    }

    async refreshButton (e) {
        e.preventDefault();
        const {lat, lon} = this.state;
        await this.setState({refreshDate: this.dateFormat(), loadingToggle: true});
        await this.getsLocation();
        await this.getNeighborhoodTemp(lat, lon);
        await this.getRiverTemp();
        await this.getCorona();
        await this.setState({loadingToggle: false});
    }

    refreshData () {
        const {lat, lon} = this.state;
        this.setState({refreshDate: this.dateFormat()});
        this.getsLocation();
        this.getNeighborhoodTemp(lat, lon);
        this.getRiverTemp();
        this.getCorona();
        this.randomMent();
    }

    _onRefresh = () => {
        this.setState({refreshing: true});
        wait(2000).then(() => {
            this.refreshData();
            this.setState({refreshing: false});
        });
    }

    async getCorona () {
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
                let xmlArrays = data.response.body.items.item;
                let total = '';

                for (let i in xmlArrays) {
                    if(Array.isArray(xmlArrays) && xmlArrays[i].gubun == '합계') {
                        total = xmlArrays[i];
                    }
                }
                await this.setState({
                    deathCnt: total.deathCnt.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","),
                    totalCnt: total.defCnt.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","),
                    previousDay: total.incDec.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","),
                    baseDate: total.stdDay,
                });
            } catch(err) {
                console.log('error ' + err);
                return false;
            }
        } else {
            console.log('에라 코드 ');
            return false;
        }
    }

    async randomMent () {
        let {author, mentArr} = this.state;
        let mentLength = mentArr.length;
        let ment = mentArr[Math.floor(Math.random() * mentLength)];
        let authorName = author[Math.floor(Math.random() * mentLength)];

        await this.setState({ment: ment, authorName: authorName});
    }

    render() {
        const {searchText, riverTemp, weatherType, temp_max, temp_min,
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
                            <Text style={main.weatherTemp}>{temp ? temp : '-'}°</Text>
                        </View>
                        <View style={main.weatherTempRightWrap}>
                            <Text style={main.weatherTempDetailText}>{weatherType ? weatherType : '-'}</Text>
                            <Text style={main.weatherTempDetailText}>{temp_max ? temp_max : '-'}° / {temp_min ? temp_min : '-'}°</Text>
                            <Text style={main.weatherTempDetailText}>체감온도 {s_temp ? s_temp : '-'}°</Text>
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
                            <Text style={main.riverTempText}>현재 한강 수온</Text>
                            <Text style={main.riverTemperature}>{riverTemp} °C</Text>
                        </View>
                    </ImageBackground>
                </View>
                <View style={main.coronaWrap}>
                    <View style={main.coronaTop}>
                        <View style={main.coronaTextWrap}>
                            <Text>코로나 확진자 총</Text>
                            <Text style={main.coronaSplitText}>{totalCnt}<Text style={main.coronaHighlight}> ( +{previousDay})</Text></Text>
                        </View>
                        <View style={main.coronaTextWrap}>
                            <Text>코로나 사망자 총</Text>
                            <Text style={main.coronaSplitText}>{deathCnt}</Text>
                        </View>
                    </View>
                    <View style={main.coronaBottom}>
                        <Text style={main.coronaBottomText}>집계일 {baseDate}</Text>
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