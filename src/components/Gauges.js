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
    row: { flexDirection: 'row', justifyContent: 'space-between',
        width: '100%',
    },
    gaugeBox: { backgroundColor: '#1E1E1E', padding: 15,
        borderRadius: 20, alignItems: 'center', width: '48%',
    },
    label: { color: '#AAA', marginTop: 10,
        fontSize: 14,
    },
});