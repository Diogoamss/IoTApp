import AsyncStorage from "@react-native-async-storage/async-storage";

const KEYS = {
    LIGHT: '@iot:light',
    TEMP: '@iot:temp',
    HUM: '@iot:hum',
    LAST_SEEN: '@iot:lastSeen',
    HISTORY: '@iot:history',
}

export const saveState = async (keyframes, value) => {
    try {
        await AsyncStorage.setItem(keyframes, JSON.stringify(value))
    }catch(e){
        console.log('Erro ao salvar estado', e)
    }
}

export const loadState = async ( key, fallback = null ) => {
    try{
        const val = await AsyncStorage.getItem(key)
        return val !== null ? JSON.parse(val) : fallback
    }catch(e){
        console.log('Erro ao carregar estado', e)
        return fallback
    }
}

export const saveAllStates = async ({ light, temp, hum }) => {
    const now = new Date().toLocaleString('pt-BR')
    await saveState(KEYS.LIGHT, light)
    await saveState(KEYS.TEMP, temp)
    await saveState(KEYS.HUM, hum)
    await saveState(KEYS.LAST_SEEN, now)

    const history = await loadState(KEYS.HISTORY, [])
    const newEntry = { light, temp, hum, time: now }
    const updated = [newEntry, ...history].slice(0, 20)
    await saveState(KEYS.HISTORY, updated)
}

export const loadAllStates = async () => {
    const light = await loadState(KEYS.LIGHT, false)
    const temp = await loadState(KEYS.TEMP, 0)
    const hum = await loadState(KEYS.HUM, 0)
    const lastSeen = await loadState(KEYS.HISTORY, [])
    return { light, temp, hum, lastSeen, history }
}

export const clearHistory = async () => {
    await AsyncStorage.removeItem(KEYS.HISTORY)
}

export { KEYS }