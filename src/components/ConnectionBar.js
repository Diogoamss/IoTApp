import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

const ConnectionBar = ({ isConnected, host, onHistoryPress, historyCount }) => {
  return (
    <View style={styles.bar}>
      <View style={styles.left}>
        <View style={[styles.dot, isConnected ? styles.dotOn : styles.dotOff]} />
        <View>
          <Text style={styles.status}>
            {isConnected ? 'Broker Conectado' : 'Desconectado'}
          </Text>
          {host && isConnected && (
            <Text style={styles.host} numberOfLines={1}>{host}</Text>
          )}
        </View>
      </View>

      <TouchableOpacity style={styles.historyBtn} onPress={onHistoryPress}>
        <FontAwesome name="clipboard" size={16} color="#8888AA" />
        {historyCount > 0 && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{historyCount > 9 ? '9+' : historyCount}</Text>
          </View>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#1e1e1e',
    borderRadius: 16,
    padding: 14,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#2A2A4A',
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  dotOn: {
    backgroundColor: '#00C896',
    shadowColor: '#00C896',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 6,
    elevation: 4,
  },
  dotOff: {
    backgroundColor: '#444466',
  },
  status: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
  },
  host: {
    color: '#555577',
    fontSize: 11,
    marginTop: 2,
    maxWidth: 220,
  },
  historyBtn: {
    position: 'relative',
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1E1E38',
    borderRadius: 12,
  },
  historyIcon: {
    fontSize: 16,
    color: '#8888AA',
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: '#00C896',
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 3,
  },
  badgeText: {
    color: '#000',
    fontSize: 9,
    fontWeight: '800',
  },
});

export default ConnectionBar;
