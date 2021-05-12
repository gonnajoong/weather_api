import React from 'react';
import { SafeAreaView, StatusBar, ScrollView} from 'react-native';

// Views
import Main from "./Views/Main";

const App = () => {
  return (
    <SafeAreaView>
      <ScrollView>
          <StatusBar hidden />
          <Main/>
      </ScrollView>
    </SafeAreaView>
  );
};

export default App;