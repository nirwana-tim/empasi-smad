import AsyncStorage from '@react-native-async-storage/async-storage';

const KEYS = {
  CHILD_PROFILE: '@empasi_child_profile',
  SMAD_HISTORY: '@empasi_smad_history',
  STUNTING_HISTORY: '@empasi_stunting_history',
};

export const StorageService = {
  // Simpan data profil anak
  async saveChildProfile(profile) {
    try {
      await AsyncStorage.setItem(KEYS.CHILD_PROFILE, JSON.stringify(profile));
      return true;
    } catch (e) {
      console.error('Error saving child profile:', e);
      return false;
    }
  },

  // Ambil data profil anak
  async getChildProfile() {
    try {
      const data = await AsyncStorage.getItem(KEYS.CHILD_PROFILE);
      return data ? JSON.parse(data) : null;
    } catch (e) {
      console.error('Error getting child profile:', e);
      return null;
    }
  },

  // Simpan riwayat cek SMAD
  async saveSmadHistory(record) {
    try {
      const existing = await this.getSmadHistory();
      const newRecord = {
        id: 'smad_' + Date.now(),
        timestamp: new Date().toISOString(),
        ...record,
      };
      const updated = [newRecord, ...existing].slice(0, 50); // Simpan max 50 catatan terakhir
      await AsyncStorage.setItem(KEYS.SMAD_HISTORY, JSON.stringify(updated));
      return newRecord;
    } catch (e) {
      console.error('Error saving SMAD history:', e);
      return null;
    }
  },

  // Ambil riwayat cek SMAD
  async getSmadHistory() {
    try {
      const data = await AsyncStorage.getItem(KEYS.SMAD_HISTORY);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.error('Error getting SMAD history:', e);
      return [];
    }
  },

  // Simpan riwayat kalkulator stunting
  async saveStuntingHistory(record) {
    try {
      const existing = await this.getStuntingHistory();
      const newRecord = {
        id: 'stunting_' + Date.now(),
        timestamp: new Date().toISOString(),
        ...record,
      };
      const updated = [newRecord, ...existing].slice(0, 50);
      await AsyncStorage.setItem(KEYS.STUNTING_HISTORY, JSON.stringify(updated));
      return newRecord;
    } catch (e) {
      console.error('Error saving stunting history:', e);
      return null;
    }
  },

  // Ambil riwayat kalkulator stunting
  async getStuntingHistory() {
    try {
      const data = await AsyncStorage.getItem(KEYS.STUNTING_HISTORY);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.error('Error getting stunting history:', e);
      return [];
    }
  },
};
