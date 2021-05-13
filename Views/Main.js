import React, {Component} from 'react';
import { Text, View, TextInput, Image, ImageBackground, Alert, TouchableOpacity, PermissionsAndroid } from 'react-native';
import Geolocation from "react-native-geolocation-service";

//style
import main from '../Assets/views/_main';
import axios from "axios";

class Main extends Component {
    constructor(props) {
        super(props);
        this.state = {
            searchText: '',
            lat: 0,
            lon: 0,
            riverTemp: '',
            weatherType: '', //날씨 상태
            temp_max: '',
            temp_min: '',
            temp: '',
            s_temp: '', // 체감 온도
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
                await this.setState({
                    weatherType: weather[0].description, //날씨 상태
                    temp_max: this.Kconvert(main.temp_max),
                    temp_min: this.Kconvert(main.temp_min),
                    temp: this.Kconvert(main.temp),
                    s_temp: 0, // 체감 온도
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


    render() {
        const {searchText, riverTemp, weatherType, temp_max, temp_min, temp, s_temp} = this.state;
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
                        <Text style={main.weatherRefreshText}>05.12 오후 2:22</Text>
                        <TouchableOpacity style={main.weatherRefresh} onPressOut={() => Alert.alert('클릭 테스트')}>
                            <Image style={main.weatherRefreshImage} source={require('../images/icons/refresh_icon.png')}/>
                        </TouchableOpacity>
                    </View>
                    <Text style={main.weatherFavoritText}>
                        따듯한 한강 주변 지역
                    </Text>
                </View>
                <View style={main.riverTempWrap}>
                    <ImageBackground style={main.riverTempBack}>
                        <Text style={main.riverTempText}>현재 한강 수온</Text>
                        <Text style={main.riverTemperature}>{riverTemp} °C</Text>
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