import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { LineChart } from 'react-native-chart-kit';

const screenWidth = Dimensions.get('window').width;

const EEGChart = ({ data }) => {
  return (
    <View style={styles.chartContainer}>
      <LineChart
        data={{
          labels: data.labels,
          datasets: [{
            data: data.values,
          }],
        }}
        width={screenWidth - 30}
        height={300}
        yAxisLabel=""
        yAxisSuffix=""
        chartConfig={{
          backgroundColor: '#ffffff',
          backgroundGradientFrom: '#ffffff',
          backgroundGradientTo: '#ffffff',
          decimalPlaces: 0,
          color: (opacity = 1) => `rgba(134, 65, 244, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          propsForBackgroundLines: {
            strokeWidth: 0,
          },
          propsForHorizontalLines: {
            strokeWidth: 0,
          },
          propsForVerticalLines: {
            strokeWidth: 0,
          },
        }}
        bezier
        style={styles.lineChart}
      />
    </View>
  );
};

const styles = StyleSheet.create({
    chartContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    lineChart: {
        borderRadius: 16,
        paddingBottom: 30
    },
  });

export default EEGChart;
