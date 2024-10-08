import React, { useState, useEffect, useCallback, useRef } from 'react';
import { View, Text, StyleSheet, Switch, SafeAreaView, ScrollView } from 'react-native';
import axios from 'axios';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import EEGChart from './EEGChart';

const non_epileptic_data_1 = [29,41,57,72,74,62,54,43,31,23,13,11,-3,-5,-9,-14,1,27,60,69,69,50,33,20,15,4,-5,-4,-8,-15,-13,-2,21,39,48,37,10,-23,-47,-71,-80,-74,-59,-44,-30,-17,-3,6,13,20,22,20,14,-15,-38,-53,-62,-69,-77,-75,-85,-87,-76,-66,-59,-42,-29,-19,-19,-27,-37,-39,-26,-7,-5,-18,-36,-54,-66,-52,-37,-6,20,47,47,37,27,19,17,12,8,-11,-34,-31,-19,4,27,66,94,110,107,93,84,83,94,65,17,-38,-65,-61,-36,-2,9,25,38,56,70,70,58,27,-1,-12,-24,-50,-73,-80,-70,-37,7,49,65,64,44,15,-14,-38,-68,-99,-107,-108,-83,-46,0,30,39,44,33,22,8,-13,-33,-61,-70,-75,-74,-58,-18,19,54,71,76,74,65,56,18,-28,-75,-98,-94,-59,-25,-4,2,5,4,-2,2,20];
const non_epileptic_data_2 = [112,114,118,117,116,114,116,119,119,118,117,115,123,135,147,149,139,113,80,51,36,28,27,34,40,47,53,57,61,65,75,79,81,73,64,44,27,10,-7,-25,-36,-39,-44,-45,-47,-51,-59,-66,-73,-76,-73,-67,-61,-61,-63,-67,-72,-78,-82,-82,-89,-87,-87,-92,-94,-99,-102,-97,-83,-69,-48,-29,-15,-6,-2,7,10,15,9,11,7,8,8,6,-1,-4,2,10,14,18,20,19,11,9,4,5,8,10,7,4,-1,-10,-14,-21,-24,-34,-46,-58,-74,-82,-78,-71,-69,-64,-65,-63,-62,-63,-73,-86,-94,-95,-97,-96,-85,-78,-69,-57,-54,-47,-47,-42,-37,-32,-25,-31,-30,-29,-22,-19,-9,-12,-11,-13,-11,-6,-2,5,9,5,2,-6,-7,-15,-23,-29,-40,-50,-52,-50,-52,-52,-47,-40,-41,-42,-48,-52,-51,-43,-34,-26,-16,-8,2,19,39,55]
const non_epileptic_data_3 = [-10,-6,-3,3,9,13,21,25,23,20,17,19,15,12,11,13,17,27,33,36,39,36,27,19,13,1,-10,-20,-29,-41,-53,-60,-68,-73,-74,-72,-69,-66,-56,-52,-46,-41,-45,-51,-57,-55,-53,-44,-34,-23,-10,-1,14,23,38,49,58,60,60,59,63,50,42,35,24,17,6,-5,-12,-11,-8,-17,-16,-22,-26,-33,-29,-28,-27,-22,-23,-28,-32,-36,-39,-42,-44,-47,-47,-50,-48,-49,-50,-48,-48,-47,-49,-51,-57,-54,-40,-30,-18,-15,-12,-14,-16,-11,-18,-22,-19,-17,-23,-22,-18,-9,-4,2,1,1,0,7,15,17,24,27,30,36,47,61,73,89,97,101,100,98,96,93,88,78,60,43,26,4,-13,-23,-40,-52,-63,-67,-68,-66,-63,-65,-72,-80,-79,-82,-82,-79,-76,-76,-76,-73,-69,-58,-44,-31,-20,-12,-4,-1,2,3,10,13,18,23]
const non_epileptic_datas = [non_epileptic_data_1, non_epileptic_data_2, non_epileptic_data_3];
const epileptic_data_1 = [386,382,356,331,320,315,307,272,244,232,237,258,212,2,-267,-605,-850,-1001,-1109,-1090,-967,-746,-464,-152,118,318,427,473,485,447,397,339,312,314,326,335,332,324,310,312,309,309,303,297,295,295,293,286,279,283,301,308,285,252,215,194,169,111,-74,-388,-679,-892,-949,-972,-1001,-1006,-949,-847,-668,-432,-153,72,226,326,392,461,495,513,511,496,479,453,440,427,414,399,385,385,404,432,444,437,418,392,373,363,365,372,385,388,383,371,360,353,334,303,252,200,153,151,143,48,-206,-548,-859,-1067,-1069,-957,-780,-597,-460,-357,-276,-224,-210,-350,-930,-1413,-1716,-1360,-662,-96,243,323,241,29,-167,-228,-136,27,146,229,269,297,307,303,305,306,307,280,231,159,85,51,43,62,63,63,69,89,123,136,127,102,95,105,131,163,168,164,150,146,152,157,156,154,143,129];
const epileptic_data_2 = [-167,-230,-280,-315,-338,-369,-405,-392,-298,-140,27,146,211,223,214,187,167,166,179,192,190,168,129,85,43,4,-28,-47,-43,-24,-7,12,32,43,12,-70,-181,-292,-374,-410,-382,-335,-232,-128,-6,106,233,312,423,550,695,816,839,769,661,525,383,292,267,339,451,537,564,534,444,305,160,27,-74,-147,-205,-242,-274,-304,-331,-355,-372,-380,-370,-341,-299,-257,-235,-249,-300,-381,-399,-345,-183,17,178,274,288,265,229,193,160,106,34,-51,-120,-166,-189,-207,-225,-242,-251,-255,-237,-202,-120,19,186,340,441,465,410,288,130,-16,-123,-194,-232,-255,-272,-266,-255,-209,-168,-142,-148,-169,-180,-174,-107,12,206,419,596,683,679,596,472,330,168,26,-63,-73,-37,25,61,67,53,28,-6,-44,-92,-154,-211,-257,-258,-168,-32,140,277,366,408,416,415,423,434,416,374,319,268,215,165,103]
const epileptic_data_3 = [593,328,88,-106,-456,-732,-921,-782,-522,-248,-68,89,221,342,336,219,82,-32,-83,-114,-134,-134,-113,-101,-109,-112,-117,-103,-83,-20,220,564,957,1162,1125,975,807,715,677,425,40,-553,-950,-993,-554,49,574,816,732,495,61,-312,-497,-463,-258,-73,35,73,66,24,-19,-44,-48,-52,-48,-19,33,94,148,184,206,215,233,228,231,233,226,239,242,265,263,203,66,-108,-272,-373,-422,-406,-363,-309,-257,-207,-178,-151,-134,-69,208,593,918,867,602,220,-163,-553,-888,-1015,-880,-568,-216,76,288,360,284,116,-93,-253,-314,-308,-272,-247,-251,-249,-239,-225,-222,-237,-269,-287,-259,-202,-51,258,610,993,1096,1016,856,721,695,678,477,103,-471,-831,-889,-541,-94,284,436,321,128,-131,-332,-358,-320,-203,-80,23,103,151,169,173,176,173,172,191,217,248,271,312,360,421,445,413,310,177,41,-71]
const epileptic_datas_1 = [epileptic_data_1, epileptic_data_2, epileptic_data_3];
const epileptic_datas_2 = [epileptic_data_3, epileptic_data_1, epileptic_data_2];

const Tab = createBottomTabNavigator();

const HomeScreen = ({ setChartDatas, setProbabilities, setDateTimes }) => {
  let index = 0;
  const [isEnabled, setIsEnabled] = useState(false);
  const intervalRef = useRef(null);

  const sendSingleMessage = useCallback(async (data, userIndex) => {
    try {
      const response = await axios.post('http://192.168.1.242/', data, {
        headers: { 'Content-Type': 'application/json' }
      });

      requestAnimationFrame(() => {
        setProbabilities(prev => {
          const newProbabilities = [...prev];
          newProbabilities[userIndex - 1] = response.data.response.response.toFixed(4);
          return newProbabilities;
        });

        setChartDatas(prev => {
          const newChartData = [...prev];
          newChartData[userIndex - 1] = { labels: [], values: data.eeg_data };
          return newChartData;
        });

        setDateTimes(prev => {
          const newDateTimes = [...prev];
          newDateTimes[userIndex - 1] = data.register_timestamp;
          return newDateTimes;
        });
      });

      console.log('Server response: ', response.data);
    } catch (error) {
      console.error('Error sending message: ', error.message);
    }
  }, [setProbabilities, setChartDatas, setDateTimes]);

  const toggleSwitch = () => setIsEnabled(previousState => !previousState);

  const sendMessages = useCallback(async () => {
    const datetime = new Date();
    const datetimeformat = [
      datetime.getFullYear(),
      datetime.getMonth() + 1,
      datetime.getDate(),
    ].join('-') + ' ' + [
      datetime.getHours(),
      datetime.getMinutes(),
      datetime.getSeconds(),
    ].join(':');

    const data_1 = { fk_user: "1", eeg_data: epileptic_datas_1[index % 3], register_timestamp: datetimeformat };
    const data_2 = { fk_user: "2", eeg_data: non_epileptic_datas[index % 3], register_timestamp: datetimeformat };
    const data_3 = { fk_user: "3", eeg_data: epileptic_datas_2[index % 3], register_timestamp: datetimeformat };

    console.log('Sending messages...');
    await Promise.all([sendSingleMessage(data_1, 1), sendSingleMessage(data_2, 2), sendSingleMessage(data_3, 3)]);
    console.log('Messages sent, waiting for 4 seconds...');
    index++;
  }, [index, sendSingleMessage]);

  useEffect(() => {
    if (isEnabled) {
      intervalRef.current = setInterval(sendMessages, 7000);
    } else {
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [isEnabled, sendMessages]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.headerContainer}>
          <Text style={styles.header}>Real-time EEG analysis</Text>
          <View style={styles.switchContainer}>
            <Text style={styles.label}>Sending OFF</Text>
            <Switch onValueChange={toggleSwitch} value={isEnabled} style={styles.switch} />
            <Text style={styles.label}>Sending ON</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const TabScreen = ({ chartData, probability, dateTime, user }) => (
  <View style={styles.tabContainer}>
    <Text style={styles.tabTitle}>User {user}</Text>
    <Text style={styles.tabText}>Date & Time: {dateTime}</Text>
    <Text style={styles.tabText}>Probability: {probability}</Text>
    <EEGChart style={styles.tabChart} data={chartData} />
  </View>
);

export default function App() {
  const [chartDatas, setChartDatas] = useState([{ labels: [], values: [1] }, { labels: [], values: [1] }, { labels: [], values: [1] }]);
  const [probabilities, setProbabilities] = useState([null, null, null]);
  const [dateTimes, setDateTimes] = useState([null, null, null]);

  return (
    <NavigationContainer>
      <View style={styles.appContainer}>
        <HomeScreen
          setChartDatas={setChartDatas}
          setProbabilities={setProbabilities}
          setDateTimes={setDateTimes}
        />
        <Tab.Navigator
          screenOptions={{
            tabBarStyle: { position: 'absolute', bottom: 0 },
            headerShown: false,
          }}
        >
          <Tab.Screen name="User1">
            {() => <TabScreen chartData={chartDatas[0]} probability={probabilities[0]} dateTime={dateTimes[0]} user={1} />}
          </Tab.Screen>
          <Tab.Screen name="User2">
            {() => <TabScreen chartData={chartDatas[1]} probability={probabilities[1]} dateTime={dateTimes[1]} user={2} />}
          </Tab.Screen>
          <Tab.Screen name="User3">
            {() => <TabScreen chartData={chartDatas[2]} probability={probabilities[2]} dateTime={dateTimes[2]} user={3} />}
          </Tab.Screen>
        </Tab.Navigator>
      </View>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 0.25,
  },
  scrollContainer: {
    flex: 1,
  },
  headerContainer: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    padding: 16,
    paddingTop: 20,
    marginBottom: 10,
  },
  header: {
    fontSize: 27,
    marginBottom: 20,
    fontWeight: 'bold'
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
  },
  switch: {
    transform: [{ scaleX: 1.5 }, { scaleY: 1.5 }],
    marginHorizontal: 30,
  },
  label: {
    fontSize: 13,
  },
  appContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  tabContainer: {
    paddingTop: 20,
    flex: 1,
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  tabTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  tabText: {
    fontSize: 18,
    color: '#555',
    marginTop: 50,
    marginBottom: -10,
  },
});