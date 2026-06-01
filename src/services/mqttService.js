import init from 'react_native_mqtt'
import AsyncStorage from '@react-native-async-storage/async-storage'

console.log('📦 Inicializando react_native_mqtt...');

try {
    init({
        size: 10000,
        storageBackend: AsyncStorage,
        defaultExpires: 1000 * 3600 * 24,
        enableCache: true,
        sync: {},
    });
    console.log('✅ react_native_mqtt inicializado com sucesso');
} catch (error) {
    console.error('❌ Erro ao inicializar react_native_mqtt:', error);
}

export default class MQTTService {
    constructor(){
        this.client = null
    }

    connect(config, onMessage, onConnect, onFailure){
        // Verifica se Paho está disponível (pode estar em global ou window)
        const Paho = global.Paho || window?.Paho;
        
        if (!Paho || !Paho.MQTT || !Paho.MQTT.Client) {
            console.error('❌ Paho não está disponível. Aguardando inicialização...');
            // Tenta novamente após 1 segundo
            setTimeout(() => this.connect(config, onMessage, onConnect, onFailure), 1000);
            return;
        }

        const { host, port, path, user, pass, clientId } = config

        try{
            this.client = new Paho.MQTT.Client(host, port, path, clientId)
            this.client.onMessageArrived = (message) => {
                onMessage(message.destinationName, message.payloadString)
            }

            this.client.onConnectionLost = (response) => {
                if(response.errorCode !== 0){
                    console.log('Conexão perdida: ', response.errorMessage)
                }
            }

            const options = {
                userName: user,
                password: pass,
                useSSL: true,
                onSuccess: onConnect,
                onFailure: onFailure,
                timeout: 5,
                keepAliveInterval: 60,
            }

            console.log('🔄 Conectando ao MQTT:', host);
            this.client.connect(options)
        }catch (e){
            console.error('Erro ao criar cliente MQTT', e)
            onFailure({ errorMessage: e.message})
        }
    }

    subscribe(topic) {
        if(this.client && this.client.isConnected()){
            this.client.subscribe(topic)
        }
    }

    publish(topic, message){
        if(this.client && this.client.isConnected()){
            const msg = new Paho.MQTT.Message(message)
            msg.destinationName = topic
            this.client.send(msg)
        }
    }

    disconnect() {
        if(this.client && this.client.isConnected()){
            this.client.disconnect()
        }
    }

    isConnected(){
        return this.client ? this.client.isConnected() : false
    }
}