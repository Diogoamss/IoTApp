import init from 'react_native_mqtt'
import AsyncStorage from '@react-native-async-storage/async-storage'

init({
    size: 10000,
    storageBackend: AsyncStorage,
    defaultExpires: 1000 * 3600 * 24,
    enableCache: true,
    sync: {},
})

export default class MQTTService {
    constructor(){
        this.client = null
    }

    connect(config, onMessage, onConnect, onFailure){
        if (typeof paho === 'undefined'){
            console.error('Paho não está disponivel. Verifique o init() do react_native_mqtt.')
            onFailure({ errorMessage: 'Paho não inicializado'})
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
                onSucess: onConnect,
                onFailure: onFailure,
                timeout: 5,
                keepAliveInterval: 60,
            }

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