import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';

const LightConnection = ({ isLightOn, onToggle }) => {
    return (
        <View style={styles.card}>
            <View style={styles.header}>
                <Text style={styles.cardTitle}> Controle de Luz</Text>
                
                <View style={[styles.badge, isLightOn ? styles.badgeOn : styles.badgeOff]}>
                    <Text style={styles.bagdeText}>{isLightOn ? 'Ligada' : 'Desligada'}</Text>
                </View>
            </View>

            <TouchableOpacity 
                style={[styles.bulbBtn, isLightOn && styles.bulbBtnOn]}
                onPress={onToggle}
                activeOpacity={0.8}
            >
                <FontAwesome5
                    name="lightbulb"
                    size={56}
                    color={isLightOn ? '#F1C40F' : '#555'}
                />
                
                <View style={isLightOn ? styles.glowRing : null}/>
            </TouchableOpacity>

            <Text style={styles.hint}>
                {`Toque para ${isLightOn ? 'desligar' : 'ligar'}`}
            </Text>

            <View style={styles.topicRow}>
                <Text style={styles.topicLabel}>Tópico:</Text>
                <Text style={styles.topicValue}>casa/luz</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#1e1e1e',
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#2A2A4A',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: 24,
  },
  cardTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  badgeOn: {
    backgroundColor: 'rgba(0,200,150,0.2)',
  },
  badgeOff: {
    backgroundColor: 'rgba(100,100,130,0.2)',
  },
  badgeText: {
    color: '#00C896',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1,
  },
  bulbBtn: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#1E1E38',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#2A2A4A',
    marginBottom: 16,
  },
  bulbBtnOn: {
    backgroundColor: 'rgba(255, 200, 0, 0.12)',
    borderColor: 'rgba(255, 200, 0, 0.4)',
    shadowColor: '#FFC800',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 20,
    elevation: 10,
  },
  bulbIcon: {
    fontSize: 52,
  },
  glowRing: {
    position: 'absolute',
    width: 130,
    height: 130,
    borderRadius: 65,
    borderWidth: 1,
    borderColor: 'rgba(255, 200, 0, 0.15)',
  },
  hint: {
    color: '#555577',
    fontSize: 13,
    marginBottom: 16,
  },
  topicRow: {
    flexDirection: 'row',
    gap: 6,
  },
  topicLabel: {
    color: '#444466',
    fontSize: 12,
  },
  topicValue: {
    color: '#00C896',
    fontSize: 12,
    fontFamily: 'monospace',
  },
  disabled: {
    opacity: 0.4,
  },
});

export default LightConnection;
