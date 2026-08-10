import AsyncStorage from '@react-native-async-storage/async-storage';

const KEYS = {
  CHILD_PROFILE: '@empasi_child_profile',
  SMAD_HISTORY: '@empasi_smad_history',
  STUNTING_HISTORY: '@empasi_stunting_history',
  QUESTIONNAIRE_PROGRESS: '@empasi_questionnaire_progress',
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

  // Ambil status progress kuisioner (LMS flow: Pre-Test -> Baca Materi -> Post-Test)
  async getQuestionnaireProgress() {
    try {
      const data = await AsyncStorage.getItem(KEYS.QUESTIONNAIRE_PROGRESS);
      return data ? JSON.parse(data) : { hasCompletedPretest: false, hasReadMaterials: false };
    } catch (e) {
      console.error('Error getting questionnaire progress:', e);
      return { hasCompletedPretest: false, hasReadMaterials: false };
    }
  },

  // Simpan status Pre-Test
  async setPretestCompleted(status = true) {
    try {
      const current = await this.getQuestionnaireProgress();
      const updated = { ...current, hasCompletedPretest: status };
      await AsyncStorage.setItem(KEYS.QUESTIONNAIRE_PROGRESS, JSON.stringify(updated));
      return updated;
    } catch (e) {
      console.error('Error setting pretest status:', e);
      return null;
    }
  },

  // Simpan status Selesai Baca Materi Edukasi
  async setMaterialsCompleted(status = true) {
    try {
      const current = await this.getQuestionnaireProgress();
      const updated = { ...current, hasReadMaterials: status };
      await AsyncStorage.setItem(KEYS.QUESTIONNAIRE_PROGRESS, JSON.stringify(updated));
      return updated;
    } catch (e) {
      console.error('Error setting materials status:', e);
      return null;
    }
  },

  // Reset progress kuisioner (untuk kebutuhan pengujian)
  async resetQuestionnaireProgress() {
    try {
      const initial = { hasCompletedPretest: false, hasReadMaterials: false };
      await AsyncStorage.setItem(KEYS.QUESTIONNAIRE_PROGRESS, JSON.stringify(initial));
      return initial;
    } catch (e) {
      console.error('Error resetting questionnaire progress:', e);
      return null;
    }
  },
};
