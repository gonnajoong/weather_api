import React, {Component} from 'react';
import { Text, View, TextInput, Image, ImageBackground, Alert, TouchableOpacity, PermissionsAndroid } from 'react-native';
import Geolocation from "react-native-geolocation-service";

//style
import main from '../Assets/views/_main';
import axios from "axios";

// import {result} from '../server/api/v1/river/get';

class Main extends Component {
    constructor(props) {
        super(props);
        this.state = {
            searchText: '',
            currPos: {latitude: 0.0, longitude: 0.0}, // 최초 좌표
            riverTemp: '',
        };
    }
    async componentDidMount() {
        await this.requestLocationPermission();
        this.getsLocation();
        await this.getRiverTemp();
        // await this.setState({riverTemp: result});
        // console.log('console.log '+result);
    }

    handler = (e, key) => {
        let temp = [];
        temp[key] = e;
        this.setState(temp);
    }
    
    getsLocation = () => {
        Geolocation.getCurrentPosition( (position) => {
            this.setState({currPos: position.coords});
        }, (error) => {
            alert('error : ' + error.message);
            //퍼미션 없을 시 실패 AndroidManifest.xml 에서 추가할 것
        });
    }

    async getRiverTemp () {
        await axios.get('https://api.qwer.pw/request/hangang_temp?apikey=guest').then(
            async (response) => {
                let data = response['data'];

                // for(let key in response) {
                //     console.log('객체배열 ' + response + ' 구분선 ' + key);
                //     console.log(response[key]);
                // }
                console.log('객체 ' + data[0].result);
                if(data[0].result == 'success') {
                    console.log('성공');
                    let riverTemp = {riverTemp: data[1].respond.temp};

                    await this.setState(riverTemp);
                } else {
                    console.log('실패');
                    alert('수온 요청 실패');
                }
            }
        ).catch(function (error){
            console.log('에라 ' + error);
        });
    }
    
    async requestLocationPermission () {
    //    동적 퍼미션
        const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION);
        if(!granted) {
            try {
                //퍼미션 요청 다이얼로그 보이기
                if(granted == PermissionsAndroid.RESULTS.GRANTED) {
                    alert('위치정보 사용을 허가하셨습니다.');
                } else {
                    alert('위치정보 사용을 거부하셨습니다.\n앱의 기능이 제한됩니다.');
                }
            } catch (err) {
                alert('퍼미션 작업 에러');
            }
        }

    }


    render() {
        const {searchText, currPos, riverTemp} = this.state;
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
                            <Text style={main.weatherTemp}>26°</Text>
                        </View>
                        <View style={main.weatherTempRightWrap}>
                            <Text style={main.weatherTempDetailText}>맑음</Text>
                            <Text style={main.weatherTempDetailText}>27° / 14°</Text>
                            <Text style={main.weatherTempDetailText}>체감온도 23°</Text>
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
                        / 위도 : {currPos.latitude} 경도 : {currPos.longitude}
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