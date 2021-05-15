import React from 'react';
import { SafeAreaView, StatusBar, ScrollView, RefreshControl} from 'react-native';

// Views
import Main from "./Views/Main";

// Style
import index from "./Assets/views/_index";

// drag to down
const wait = (timeout) => {
    return new Promise(resolve => setTimeout(resolve, timeout));
}



const App = () => {
    const [refreshing, setRefreshing] = React.useState(false);
    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        wait(2000).then(() => setRefreshing(false));
    }, []);

    return (
        <SafeAreaView style={index.container}>
                <StatusBar hidden />
                <Main/>
        </SafeAreaView>
      );
};

export default App;