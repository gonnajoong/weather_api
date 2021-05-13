import React, {Component} from 'react';
import { Text, View, TextInput, Image, ImageBackground, Alert, TouchableOpacity, PermissionsAndroid, ActivityIndicator } from 'react-native';
import Geolocation from "react-native-geolocation-service";

//style
import main from '../Assets/views/_main';
import axios from "axios";

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
            weatherType: '', //날씨 상태
            w_icon: '', //날씨 아이콘
            temp_max: '',
            temp_min: '',
            temp: '',
            s_temp: '', // 체감 온도
            refreshDate: this.dateFormat(),
            nowTime: new Date(), // 현재 시간
            loadingToggle: false,
        };
    }
    async componentDidMount() {
        await this.requestLocationPermission();
        await this.getsLocation();
        await this.getRiverTemp();
        await this.getNeighborhoodTemp(this.state.lat, this.state.lon);

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
        await axios.get('https://api.qwer.pw/request/hangang_temp?apikey=guest').then(
            async (response) => {
                let data = response['data'];
                if(data[0].result == 'success') {
                    let riverTemp = {riverTemp: data[1].respond.temp};
                    await this.setState(riverTemp);
                } else {
                    alert('수온 요청 실패');
                }
            }
        ).catch(function (error){
            console.log('에라 ' + error);
        });
    }

    async getNeighborhoodTemp (lat, lon) {
        let getUrl = 'https://api.openweathermap.org/data/2.5/weather?lat='+lat+'&lon='+lon+'&appid=8347650a0034f9608ff315324c80721b'+'&lang=kr';
        console.log('주소 - '+ getUrl);
        await axios.get(getUrl).then(
            async (response) => {
                let data = response['data'];
                console.log('날씨 - ' + data.name);
                alert('지역명' + data.name);
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
            }
        ).catch(function (error){
            console.log('에라 ' + error);
        });
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
        await this.setState({refreshDate: this.dateFormat(), loadingToggle: true});
        await this.getsLocation();
        await this.getNeighborhoodTemp();
        await this.getRiverTemp();
        await this.setState({loadingToggle: false});
        alert('갱신!');
    }


    render() {
        const {searchText, riverTemp, weatherType, temp_max, temp_min, temp, s_temp, refreshDate, nowTime, loadingToggle, w_icon} = this.state;
        return (
            <View style={main.container}>
                <View style={main.searchWrap}>
                    <TextInput
                        style={main.searchBar}
                        placeholder='지역 날씨 검색'
                        value={searchText}
                        onChangeText={e => this.handler(e, 'searchText')}
                    />
                    <TouchableOpacity style={main.searchIcon} onPressOut={() => Alert.alert('검색내용 : '+searchText)}>
                        <Image style={main.searchIconImage} source={require('../images/icons/search_icon.png')}/>
                    </TouchableOpacity>
                </View>
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
                    <Text style={main.weatherFavoritText}>
                        따듯한 한강 주변 지역
                    </Text>
                </View>
                <View style={main.riverTempWrap}>
                    <ImageBackground style={main.riverTempBack} source={nowTime.getHours() > 6 || nowTime.getHours() < 18 ? require('../images/commons/river_morning.jpg') : require('../images/commons/river_night.jpg')}>
                        <View style={main.riverTextWrap}>
                            <Text style={main.riverTempText}>현재 한강 수온</Text>
                            <Text style={main.riverTemperature}>{riverTemp} °C</Text>
                        </View>
                    </ImageBackground>
                </View>
                <View style={main.hopeTextWrap}>
                    <Text style={main.hopeText}>
                        띵언 및 좋은 문구들
                    </Text>
                    <Text style={main.hopeTextAuthor}>
                        문구 만든놈
                    </Text>
                </View>
            </View>
        );
    }
}

export default Main;