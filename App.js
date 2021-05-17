import React from 'react';
import { SafeAreaView, StatusBar, ScrollView, RefreshControl} from 'react-native';


// Views
import Main from "./Views/Main";

// Style
import index from "./Assets/views/_index";

const App = () => {

    return (
        <SafeAreaView style={index.container}>
                <StatusBar/>
                <Main/>
        </SafeAreaView>
      );
};

export default App;