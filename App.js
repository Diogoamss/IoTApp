import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  StatusBar,
  RefreshControl,
} from 'react-native';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import MQTTService from './src/services/mqttService';
import { loadAllStates, saveAllStates } from './src/services/storageService';
import StatusModal from './src/components/StatusModal';
import LightConnection from './src/components/LightConnection';
import Gauges from './src/components/Gauges';
import HistoryModal from './src/components/HistoryModal';
import ConnectionBar from './src/components/ConnectionBar';

const MQTT_CONFIG = {
  host: '6dbcf1087cac4854922b27e97131891d.s1.eu.hivemq.cloud',
  port: 8884,
  path: '/mqtt',
  user: 'Diogo_teste134',
  pass: 'M3ss1ass',
  clientId: 'RN_App_' + Math.random().toString(16).slice(2),
};


const TOPICS = {
  TEMP: 'casa/temp',
  HUM: 'casa/umid',
  LIGHT: 'casa/luz',
};

const mqtt = new MQTTService();

export default function App() {
  // Estados MQTT
  const [isConnected, setIsConnected] = useState(false);
  const [showError, setShowError] = useState(false);
  const [connecting, setConnecting] = useState(false);

  // Estados dos "sensores"
  const [isLightOn, setIsLightOn] = useState(false);
  const [temp, setTemp] = useState(0);
  const [hum, setHum] = useState(0);

  // Histórico / Storage
  const [lastSeen, setLastSeen] = useState(null);
  const [history, setHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [refreshing, setRefreshing] = useState(false);


  // Ref para evitar stale closure no handler MQTT

  const messageHandlerRef = useRef(null);

  // Atualiza a ref sempre que os estados mudarem
  useEffect(() => {
    messageHandlerRef.current = async (topic, message) => {
      if (topic === TOPICS.TEMP) {
        setTemp(parseFloat(message) || 0);
      } else if (topic === TOPICS.HUM) {
        setHum(parseFloat(message) || 0);
      } else if (topic === TOPICS.LIGHT) {
        setIsLightOn(message === '1');
      }

      await saveAllStates({
        light: topic === TOPICS.LIGHT ? message === '1' : isLightOn,
        temp:  topic === TOPICS.TEMP  ? parseFloat(message) || 0 : temp,
        hum:   topic === TOPICS.HUM   ? parseFloat(message) || 0 : hum,
      });
      const saved = await loadAllStates();
      setLastSeen(saved.lastSeen);
      setHistory(saved.history);
    };
  }, [isLightOn, temp, hum]);


  // Carrega estados salvos no boot

  useEffect(() => {
    const loadSaved = async () => {
      const saved = await loadAllStates();
      setIsLightOn(saved.light);
      setTemp(saved.temp);
      setHum(saved.hum);
      setLastSeen(saved.lastSeen);
      setHistory(saved.history);
    };
    loadSaved();
  }, []);


  // Conecta ao MQTT na inicialização
  useEffect(() => {
    const timer = setTimeout(() => {
      console.log('⏳ Iniciando conexão MQTT após delay de inicialização...');
      startConnection();
    }, 500); // Pequeno delay para garantir que Paho está pronto
    
    return () => {
      clearTimeout(timer);
      mqtt.disconnect();
    };
  }, []);

  const startConnection = useCallback(() => {
    setConnecting(true);
    setShowError(false);

    mqtt.connect(
      MQTT_CONFIG,
      // sempre delega para a ref atualizada
      (topic, message) => {
        messageHandlerRef.current?.(topic, message);
      },
      // onConnect
      () => {
        setIsConnected(true);
        setConnecting(false);
        setShowError(false);
        mqtt.subscribe(TOPICS.TEMP);
        mqtt.subscribe(TOPICS.HUM);
        mqtt.subscribe(TOPICS.LIGHT);
        console.log('✅ Conectado ao HiveMQ!');
      },
      // onFailure
      (err) => {
        setIsConnected(false);
        setConnecting(false);
        setShowError(true);
        console.log('❌ Erro ao conectar MQTT:', err);
      }
    );
  }, []);


  // Alterna estado da luz

  const toggleLight = useCallback(() => {
    if (!isConnected) return;
    const newState = isLightOn ? '0' : '1';
    mqtt.publish(TOPICS.LIGHT, newState);
  }, [isConnected, isLightOn]);

  // Pull-to-refresh

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    const saved = await loadAllStates();
    setHistory(saved.history);
    setLastSeen(saved.lastSeen);
    setRefreshing(false);
  }, []);

  return (
    <SafeAreaProvider>
    <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="light-content" backgroundColor="#0A0A18" />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#00C896"
            colors={['#00C896']}
          />
        }
        showsVerticalScrollIndicator={false}
      >
        {/* Header*/}
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.appTitle}>Smart Home IoT</Text>
            <Text style={styles.appSubtitle}>Dashboard de Controle</Text>
          </View>
          <View style={styles.protocolBadge}>
            <Text style={styles.protocolText}>MQTT</Text>
          </View>
        </View>

        {/*Barra de conexão + botão histórico*/}
        <ConnectionBar
          isConnected={isConnected}
          host={MQTT_CONFIG.host}
          onHistoryPress={() => setShowHistory(true)}
          historyCount={history.length}
        />

        {/*Controle de Luz*/}
        <LightConnection
          isLightOn={isLightOn}
          onToggle={toggleLight}
          disabled={!isConnected}
        />

        {/*Gauges de Sensores*/}
        <Gauges temp={temp} hum={hum} />

        {/*Info dos topicos*/}
        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>Tópicos Monitorados</Text>
          {[
            { topic: 'casa/luz', desc: 'Controle do LED' },
            { topic: 'casa/temp', desc: 'Temperatura (DHT)' },
            { topic: 'casa/umid', desc: 'Umidade (DHT)' },
          ].map((item) => (
            <View key={item.topic} style={styles.infoRow}>
              <Text style={styles.infoTopic}>{item.topic}</Text>
              <Text style={styles.infoDesc}>{item.desc}</Text>
            </View>
          ))}
        </View>

        {/* ── Rodapé ── */}
        <Text style={styles.footer}>
          ETEC Bento Quirino · Diogo André Messias
        </Text>
      </ScrollView>

      {/*Modal de Conexão*/}
      <StatusModal
        visible={showError || connecting}
        connecting={connecting}
        onRetry={startConnection}
        onLater={() => setShowError(false)}
      />

      {/*Modal de Histórico*/}
      <HistoryModal
        visible={showHistory}
        history={history}
        lastSeen={lastSeen}
        onClose={() => setShowHistory(false)}
        onClear={() => setHistory([])}
      />
    </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#121212',
  },
  scroll: {
    flex: 1,
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
    marginTop: 8,
  },
  appTitle: {
    color: '#FFFFFF',
    fontSize: 26,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  appSubtitle: {
    color: '#555577',
    fontSize: 13,
    marginTop: 4,
  },
  protocolBadge: {
    backgroundColor: 'rgba(0,200,150,0.15)',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: 'rgba(0,200,150,0.3)',
  },
  protocolText: {
    color: '#00C896',
    fontWeight: '800',
    fontSize: 13,
    letterSpacing: 1,
  },
  infoCard: {
    backgroundColor: '#1e1e1e',
    borderRadius: 24,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#2A2A4A',
    gap: 12,
  },
  infoTitle: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 4,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  infoTopic: {
    color: '#00C896',
    fontSize: 13,
    fontFamily: 'monospace',
  },
  infoDesc: {
    color: '#666688',
    fontSize: 12,
  },
  footer: {
    color: '#333355',
    fontSize: 11,
    textAlign: 'center',
    marginTop: 8,
  },
});