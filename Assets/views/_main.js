import {StyleSheet} from 'react-native';
import { Fonts } from "../fonts/Fonts";

const main = StyleSheet.create({
    container: {
        alignItems: 'center',
        height: '100%',
        width: '100%',
        padding: 20,
        paddingTop: 60,
        backgroundColor: '#f1f1f1',
    },
    searchWrap: {
        width: '100%',
        backgroundColor: 'transparent',
        marginBottom: 20,
    },
    searchBar: {
        height: 40,
        width: '100%',
        borderBottomWidth: 1,
        borderColor: '#ccc',
        paddingLeft: 10,
        paddingRight: 40,
    },
    searchIcon: {
        width: 30,
        height: 30,
        position: 'absolute',
        right: 6,
        top: 4.5,
    },
    searchIconImage: {
        width: 30,
        height: 30,
    },
    weatherIconWrap: {
        width: '100%',
        height: 250,
        padding: 10,
        backgroundColor: '#fff',
        alignItems: 'center',
        borderRadius: 10,
        marginBottom: 10,
    },
    weatherTempDetailWrap: {
        width: '100%',
        height: 150,
        padding: 6,
        flexDirection: 'row',
        alignItems: 'center',
    },
    weatherTempLeftWrap: {
        width: '50%',
        flexDirection: 'row',
    },
    weatherTemp: {
        fontSize: 46,
        justifyContent: 'center',
        textAlign: 'center',
        paddingLeft: 10,
        fontFamily: Fonts.NOTOSANSKR,
    },
    weatherTempRightWrap: {
        width: '50%',
    },
    weatherTempDetailText: {
        textAlign: 'right',
        fontFamily: Fonts.NOTOSANSKR,
    },
    weatherIcon: {
        width: 100,
        height: 100,
        backgroundColor: 'gray',
    },
    weatherRefreshWrap: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'flex-end',
        margin: 10,
        marginLeft: 0,
        marginRight: 0,
    },
    weatherRefreshText: {
        width: 100,
    },
    weatherRefresh: {
        width: 20,
        height: 20,
        marginLeft: 6,
    },
    weatherRefreshImage: {
        width: 20,
        height: 20,
    },
    weatherFavoritText: {
        width: '100%',
        fontSize: 16,
        textAlign: 'left'
    },
    riverTempWrap: {
        width: '100%',
        height: 200,
        backgroundColor: '#fff',
        borderRadius: 10,
        marginBottom: 10,
    },
    riverTempBack: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
        justifyContent: 'center',
    },
    riverTempText: {
        fontSize: 20,
        fontFamily: Fonts.NOTOSANSKR,
        position: 'absolute',
        bottom: 50,
        left: 10,
    },
    riverTemperature: {
        fontSize: 52,
        fontFamily: Fonts.NOTOSANSKR,
        position: 'absolute',
        top: 50,
        right: 10,
    },
    hopeTextWrap: {
        width: '100%',
        height: 200,
        borderRadius: 10,
        backgroundColor: '#fff',
        padding: 10,
        justifyContent: 'center',
    },
    hopeText: {
        width: '100%',
        textAlign: 'center',
        justifyContent: 'center',
        fontFamily: Fonts.NOTOSANSKR,
        fontSize: 36,
    },
    hopeTextAuthor: {
        textAlign: 'center',
        fontFamily: Fonts.NOTOSANSKR,
        fontSize: 16,
        marginTop: 10,
    },
});

export default main;