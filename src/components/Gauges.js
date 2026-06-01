import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import CircularProgress from 'react-native-circular-progress-indicator';

const GaugeBox = ({ value, maxValue, title, unit, color, topic }) => (
    <View style={styles.gaugeBox}>
        <Text style={styles.gaugeTitle}>{title}</Text>
        <CircularProgress 
            value={isNaN(value) ? 0 : value}
            maxValue={maxValue}
            radius={52}
            title={unit}
            titleColor='#fff'
            titleStyle={{ fontWeight: '700', fontSize: 13}}
            activeStrokeColor={color}
            activeStrokeSecondaryColor={color + '66'}
            inActiveStrokeColor='#1e1e38'
            inActiveStrokeWidth={8}
            activeStrokeWidth={8}
            progressValueColor='#fff'
            progressValueStyle={{ fontWeight: '800', fontSize: 22}}
            valueSuffix=''
            duration={800}
        />

        <View style={styles.topicRow}>
            <Text style={styles.topicLabel}>Tópico:</Text>
            <Text style={styles.topicValue}>{topic}</Text>
        </View>
    </View>
)

const Gauges = ({ temp, hum }) => {
    return (
        <View style={styles.card}>
            <Text style={styles.cardTitle}>Monitoramento de Sensores</Text>

            <View style={styles.row}>
                <GaugeBox 
                    value={temp}
                    maxValue={50}
                    title="Temperatura"
                    unit="°C"
                    color="#E74C3C"
                    topic="casa/temp"
                />

                <View style={styles.divider} />

                <GaugeBox 
                    value={hum}
                    maxValue={100}
                    title="Umidade"
                    unit="%"
                    color="#3498DB"
                    topic="casa/umid"
                />
                
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#1e1e1e',
    borderRadius: 24,
    padding: 24,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#2A2A4A',
  },
  cardTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 20,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  gaugeBox: {
    alignItems: 'center',
    flex: 1,
    gap: 12,
  },
  divider: {
    width: 1,
    height: 120,
    backgroundColor: '#2A2A4A',
  },
  gaugeTitle: {
    color: '#8888AA',
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  topicRow: {
    flexDirection: 'row',
    gap: 4,
    marginTop: 4,
  },
  topicLabel: {
    color: '#444466',
    fontSize: 11,
  },
  topicValue: {
    color: '#00C896',
    fontSize: 11,
    fontFamily: 'monospace',
  },
});

export default Gauges;
