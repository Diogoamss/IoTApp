import React, { useState, useMemo } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Alert,
  Dimensions,
  ScrollView,
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { LineChart } from 'react-native-chart-kit';
import { clearHistory } from '../services/storageService';

const screenWidth = Dimensions.get('window').width;
const CHART_WIDTH = screenWidth - 64;

const HistoryModal = ({ visible, history, lastSeen, onClose, onClear }) => {
  const [activeTab, setActiveTab] = useState('dashboard');

  const chartData = useMemo(() => {
    if (history.length < 2) return null;

    const reversed = [...history].reverse();
    const labels = reversed.map((_, i) => {
      if (reversed.length > 8 && i % Math.ceil(reversed.length / 6) !== 0) return '';
      return reversed[i].time.split(', ')[1]?.split(':').slice(0, 2).join(':') || '';
    });
    const tempData = reversed.map((e) => e.temp);
    const humData = reversed.map((e) => e.hum);

    return { labels, tempData, humData };
  }, [history]);

  const stats = useMemo(() => {
    if (history.length === 0) return null;
    const temps = history.map((e) => e.temp);
    const hums = history.map((e) => e.hum);
    return {
      tempMin: Math.min(...temps).toFixed(1),
      tempMax: Math.max(...temps).toFixed(1),
      tempAvg: (temps.reduce((a, b) => a + b, 0) / temps.length).toFixed(1),
      humMin: Math.min(...hums).toFixed(0),
      humMax: Math.max(...hums).toFixed(0),
      humAvg: (hums.reduce((a, b) => a + b, 0) / hums.length).toFixed(0),
    };
  }, [history]);

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

          <View style={styles.tabRow}>
            <TouchableOpacity
              style={[styles.tab, activeTab === 'dashboard' && styles.tabActive]}
              onPress={() => setActiveTab('dashboard')}
            >
              <FontAwesome
                name="bar-chart"
                size={13}
                color={activeTab === 'dashboard' ? '#00C896' : '#555577'}
              />
              <Text style={[styles.tabText, activeTab === 'dashboard' && styles.tabTextActive]}>
                Dashboard
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tab, activeTab === 'list' && styles.tabActive]}
              onPress={() => setActiveTab('list')}
            >
              <FontAwesome
                name="list"
                size={13}
                color={activeTab === 'list' ? '#00C896' : '#555577'}
              />
              <Text style={[styles.tabText, activeTab === 'list' && styles.tabTextActive]}>
                Registros
              </Text>
            </TouchableOpacity>
          </View>

          <ScrollView
            style={styles.scrollArea}
            showsVerticalScrollIndicator={false}
            nestedScrollEnabled
          >
            {activeTab === 'dashboard' ? (
              <View style={styles.dashboard}>
                {history.length < 2 ? (
                  <View style={styles.empty}>
                    <FontAwesome name="bar-chart" size={48} color="#555577" />
                    <Text style={styles.emptyText}>
                      {history.length === 0
                        ? 'Nenhum dado para exibir no gráfico.'
                        : 'São necessários ao menos 2 registros para gerar o gráfico.'}
                    </Text>
                    <Text style={styles.emptyHint}>
                      Os dados são salvos automaticamente ao receber mensagens do ESP32.
                    </Text>
                  </View>
                ) : (
                  <>
                    <Text style={styles.chartTitle}>Temperatura × Umidade</Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                      <LineChart
                        data={{
                          labels: chartData.labels,
                          datasets: [
                            {
                              data: chartData.tempData,
                              color: (opacity = 1) => `rgba(231, 76, 60, ${opacity})`,
                              strokeWidth: 2,
                            },
                            {
                              data: chartData.humData,
                              color: (opacity = 1) => `rgba(52, 152, 219, ${opacity})`,
                              strokeWidth: 2,
                            },
                          ],
                          legend: ['Temperatura (°C)', 'Umidade (%)'],
                        }}
                        width={Math.max(CHART_WIDTH, history.length * 50)}
                        height={220}
                        chartConfig={{
                          backgroundColor: '#1e1e1e',
                          backgroundGradientFrom: '#1e1e1e',
                          backgroundGradientTo: '#16162a',
                          decimalCount: 1,
                          color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                          labelColor: (opacity = 1) => `rgba(136, 136, 170, ${opacity})`,
                          propsForDots: { r: '3', strokeWidth: '1' },
                          propsForBackgroundLines: {
                            strokeDasharray: '3 3',
                            stroke: 'rgba(255,255,255,0.05)',
                          },
                        }}
                        bezier
                        style={styles.chart}
                      />
                    </ScrollView>

                    {stats && (
                      <View style={styles.statsGrid}>
                        <View style={styles.statCard}>
                          <FontAwesome name="thermometer-half" size={14} color="#E74C3C" />
                          <Text style={styles.statLabel}>Temperatura</Text>
                          <View style={styles.statRow}>
                            <View style={styles.statItem}>
                              <Text style={[styles.statValue, { color: '#E74C3C' }]}>{stats.tempMin}°</Text>
                              <Text style={styles.statSub}>Mín</Text>
                            </View>
                            <View style={styles.statItem}>
                              <Text style={[styles.statValue, { color: '#E74C3C' }]}>{stats.tempAvg}°</Text>
                              <Text style={styles.statSub}>Média</Text>
                            </View>
                            <View style={styles.statItem}>
                              <Text style={[styles.statValue, { color: '#E74C3C' }]}>{stats.tempMax}°</Text>
                              <Text style={styles.statSub}>Máx</Text>
                            </View>
                          </View>
                        </View>
                        <View style={styles.statCard}>
                          <FontAwesome name="tint" size={14} color="#3498DB" />
                          <Text style={styles.statLabel}>Umidade</Text>
                          <View style={styles.statRow}>
                            <View style={styles.statItem}>
                              <Text style={[styles.statValue, { color: '#3498DB' }]}>{stats.humMin}%</Text>
                              <Text style={styles.statSub}>Mín</Text>
                            </View>
                            <View style={styles.statItem}>
                              <Text style={[styles.statValue, { color: '#3498DB' }]}>{stats.humAvg}%</Text>
                              <Text style={styles.statSub}>Média</Text>
                            </View>
                            <View style={styles.statItem}>
                              <Text style={[styles.statValue, { color: '#3498DB' }]}>{stats.humMax}%</Text>
                              <Text style={styles.statSub}>Máx</Text>
                            </View>
                          </View>
                        </View>
                      </View>
                    )}
                  </>
                )}
              </View>
            ) : (
              <View>
                {history.length > 0 && (
                  <View style={styles.colHeader}>
                    <Text style={styles.colText}>Data / Luz</Text>
                    <Text style={styles.colText}>Temp / Umidade</Text>
                  </View>
                )}
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
                    scrollEnabled={false}
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
            )}
          </ScrollView>
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
    maxHeight: '85%',
    borderWidth: 1,
    borderColor: '#2A2A4A',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
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
  tabRow: {
    flexDirection: 'row',
    backgroundColor: '#161616',
    borderRadius: 12,
    padding: 3,
    marginBottom: 16,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    borderRadius: 10,
  },
  tabActive: {
    backgroundColor: '#2A2A4A',
  },
  tabText: {
    color: '#555577',
    fontSize: 13,
    fontWeight: '600',
  },
  tabTextActive: {
    color: '#00C896',
  },
  scrollArea: {
    flexGrow: 0,
  },
  dashboard: {
    gap: 16,
  },
  chartTitle: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  chart: {
    borderRadius: 16,
  },
  statsGrid: {
    gap: 12,
  },
  statCard: {
    backgroundColor: '#161616',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#2A2A4A',
  },
  statLabel: {
    color: '#8888AA',
    fontSize: 12,
    fontWeight: '600',
    marginTop: 8,
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
    gap: 4,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '800',
  },
  statSub: {
    color: '#555577',
    fontSize: 11,
    fontWeight: '600',
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
  emptyText: {
    color: '#8888AA',
    fontSize: 15,
    fontWeight: '600',
    textAlign: 'center',
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
  },
});

export default HistoryModal;
