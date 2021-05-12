import React, {Component} from 'react';
import { Text, View, TextInput, Image, ImageBackground, Alert, TouchableOpacity } from 'react-native';

import main from '../Assets/views/_main';

const backRiver = { uri: ''}

class Main extends Component {


    render() {
        return (
            <View style={main.container}>
                <View style={main.searchWrap}>
                    <TextInput
                        style={main.searchBar}
                        placeholder='지역 날씨 검색'
                    />
                    <TouchableOpacity style={main.searchIcon} onPressOut={() => Alert.alert('클릭 테스트')}>
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
                    </Text>
                </View>
                <View style={main.riverTempWrap}>
                    <ImageBackground source={backRiver} style={main.riverTempBack}>
                        <Text style={main.riverTempText}>현재 한강 수온</Text>
                        <Text style={main.riverTemperature}>16.2 °C</Text>
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