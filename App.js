import React from 'react';
import { SafeAreaView, StatusBar} from 'react-native';

// Views
import Main from "./Views/Main";

const App = () => {
  return (
    <SafeAreaView>
      <StatusBar hidden />
      <Main/>
    </SafeAreaView>
  );
};

export default App;