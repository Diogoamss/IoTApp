import React from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Alert,
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { clearHistory } from '../services/storageService';

const HistoryModal = ({ visible, history, lastSeen, onClose, onClear }) => {
  const handleClear = () => {
    Alert.alert(
      'Limpar Histórico',
      'Deseja apagar todos os registros salvos?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Limpar',
          style: 'destructive',
          onPress: async () => {
            await clearHistory();
            onClear();
          },
        },
      ]
    );
  };

  const renderItem = ({ item, index }) => (
    <View style={[styles.row, index % 2 === 0 && styles.rowAlt]}>
      <View style={styles.rowLeft}>
        <Text style={styles.rowTime}>{item.time}</Text>
        <View style={[styles.lightDot, { backgroundColor: item.light ? '#00C896' : '#333355' }]} />
      </View>
      <View style={styles.rowRight}>
        <View style={styles.sensorContainer}>
          <FontAwesome name="thermometer" size={12} color="#E74C3C" />
          <Text style={styles.tempVal}>{item.temp}°C</Text>
        </View>
        <View style={styles.sensorContainer}>
          <FontAwesome name="tint" size={12} color="#3498DB" />
          <Text style={styles.humVal}>{item.hum}%</Text>
        </View>
      </View>
    </View>
  );

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.sheet}>
          {/* Header */}
          <View style={styles.header}>
            <View>
              <Text style={styles.title}>Histórico de Estados</Text>
              {lastSeen && (
                <Text style={styles.subtitle}>Última atualização: {lastSeen}</Text>
              )}
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <FontAwesome name="times" size={14} color="#8888AA" />
            </TouchableOpacity>
          </View>

          {/* Column headers */}
          {history.length > 0 && (
            <View style={styles.colHeader}>
              <Text style={styles.colText}>Data / Luz</Text>
              <Text style={styles.colText}>Temp / Umidade</Text>
            </View>
          )}

          {/* List */}
          {history.length === 0 ? (
            <View style={styles.empty}>
              <FontAwesome name="inbox" size={48} color="#555577" />
              <Text style={styles.emptyText}>Nenhum registro salvo ainda.</Text>
              <Text style={styles.emptyHint}>
                Os dados são salvos automaticamente ao receber mensagens do ESP32.
              </Text>
            </View>
          ) : (
            <FlatList
              data={history}
              keyExtractor={(_, i) => String(i)}
              renderItem={renderItem}
              style={styles.list}
              showsVerticalScrollIndicator={false}
            />
          )}


          {history.length > 0 && (
            <TouchableOpacity style={styles.clearBtn} onPress={handleClear}>
              <View style={styles.clearBtnContent}>
                <FontAwesome name="trash" size={14} color="#CC4444" />
                <Text style={styles.clearText}>Limpar Histórico</Text>
              </View>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.75)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: '#1e1e1e',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 24,
    maxHeight: '80%',
    borderWidth: 1,
    borderColor: '#2A2A4A',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '800',
  },
  subtitle: {
    color: '#555577',
    fontSize: 12,
    marginTop: 4,
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#2A2A4A',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeText: {
    color: '#8888AA',
    fontSize: 14,
    fontWeight: '700',
  },
  colHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 4,
    marginBottom: 8,
  },
  colText: {
    color: '#555577',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  list: {
    flexGrow: 0,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 12,
    marginBottom: 4,
  },
  rowAlt: {
    backgroundColor: '#171616',
  },
  rowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  rowTime: {
    color: '#8888AA',
    fontSize: 11,
    flex: 1,
  },
  lightDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  rowRight: {
    flexDirection: 'row',
    gap: 16,
    alignItems: 'center',
  },
  sensorVal: {
    color: '#8888AA',
    fontSize: 13,
  },
  sensorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  tempVal: {
    color: '#E74C3C',
    fontWeight: '700',
  },
  humVal: {
    color: '#3498DB',
    fontWeight: '700',
  },
  empty: {
    alignItems: 'center',
    paddingVertical: 40,
    gap: 12,
  },
  emptyIcon: {
    marginBottom: 8,
  },
  emptyText: {
    color: '#8888AA',
    fontSize: 15,
    fontWeight: '600',
  },
  emptyHint: {
    color: '#444466',
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 18,
    paddingHorizontal: 20,
  },
  clearBtn: {
    marginTop: 16,
    backgroundColor: '#381e1e',
    borderRadius: 14,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#3A1A1A',
  },

  trashIcon: {
    marginRight: 4,
  },
  clearBtnContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    justifyContent: 'center',
  },

  clearText: {
    color: '#CC4444',
    fontWeight: '600',
    fontSize: 14,
    marginLeft: 4,
  },
});

export default HistoryModal;
