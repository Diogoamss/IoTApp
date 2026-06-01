import React from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

const StatusModal = ({ visible, connecting, onRetry, onLater }) => {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.card}>
          <View style={styles.iconWrap}>
            <FontAwesome name="bolt" size={32} color="#FFC800" />
          </View>

          <Text style={styles.title}>
            {connecting ? 'Conectando...' : 'Falha na Conexão'}
          </Text>

          <Text style={styles.message}>
            {connecting
              ? 'Aguarde enquanto estabelecemos a conexão com o Broker HiveMQ.'
              : 'Não foi possível conectar ao Broker.\nVerifique suas credenciais e conexão com a internet.'}
          </Text>

          {connecting ? (
            <ActivityIndicator color="#00C896" size="large" style={{ marginTop: 20 }} />
          ) : (
            <View style={styles.btnRow}>
              <TouchableOpacity style={styles.btnRetry} onPress={onRetry}>
                <Text style={styles.btnText}>Tentar Novamente</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.btnLater} onPress={onLater}>
                <Text style={styles.btnTextSecondary}>Mais Tarde</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.85)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    backgroundColor: '#1e1e1e',
    borderRadius: 24,
    padding: 32,
    width: '85%',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#2A2A4A',
  },
  iconWrap: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#12122A',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  iconText: {
    fontSize: 32,
    color: '#FFC800',
  },
  title: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 12,
    textAlign: 'center',
  },
  message: {
    color: '#8888AA',
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 22,
  },
  btnRow: {
    width: '100%',
    marginTop: 28,
    gap: 12,
  },
  btnRetry: {
    backgroundColor: '#00C896',
    borderRadius: 14,
    padding: 16,
    alignItems: 'center',
  },
  btnLater: {
    backgroundColor: '#2A2A4A',
    borderRadius: 14,
    padding: 16,
    alignItems: 'center',
  },
  btnText: {
    color: '#000',
    fontWeight: '700',
    fontSize: 15,
  },
  btnTextSecondary: {
    color: '#8888AA',
    fontWeight: '600',
    fontSize: 15,
  },
});

export default StatusModal;
