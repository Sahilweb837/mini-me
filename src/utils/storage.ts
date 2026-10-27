import { CharacterConfig } from '../types/character';
import { DEFAULT_CHARACTER, CHARACTER_PRESETS } from '../constants/presets';

const STORAGE_KEY = 'minime_saved_characters_v1';
const ACTIVE_CHAR_KEY = 'minime_active_character_v1';

export const loadSavedCharacters = (): CharacterConfig[] => {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      const data = window.localStorage.getItem(STORAGE_KEY);
      if (data) {
        const parsed = JSON.parse(data);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    }
  } catch (e) {
    console.warn('Failed to load characters from localStorage', e);
  }
  return [...CHARACTER_PRESETS];
};

export const saveCharactersToStorage = (characters: CharacterConfig[]): void => {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(characters));
    }
  } catch (e) {
    console.warn('Failed to save characters to localStorage', e);
  }
};

export const saveCurrentCharacter = (character: CharacterConfig): CharacterConfig[] => {
  const all = loadSavedCharacters();
  const existingIndex = all.findIndex(c => c.id === character.id);
  let updated: CharacterConfig[];
  
  if (existingIndex >= 0) {
    updated = [...all];
    updated[existingIndex] = { ...character, createdAt: Date.now() };
  } else {
    // Generate a unique ID if it's default or new
    const newChar = {
      ...character,
      id: 'char_' + Date.now().toString(36) + Math.random().toString(36).substring(2, 6),
      createdAt: Date.now()
    };
    updated = [newChar, ...all];
  }

  saveCharactersToStorage(updated);
  return updated;
};

export const deleteCharacterFromStorage = (id: string): CharacterConfig[] => {
  const all = loadSavedCharacters();
  const filtered = all.filter(c => c.id !== id);
  saveCharactersToStorage(filtered);
  return filtered;
};

export const loadLastActiveCharacter = (): CharacterConfig => {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      const data = window.localStorage.getItem(ACTIVE_CHAR_KEY);
      if (data) {
        return JSON.parse(data);
      }
    }
  } catch (e) {
    console.warn('Failed to load active character', e);
  }
  return DEFAULT_CHARACTER;
};

export const saveLastActiveCharacter = (character: CharacterConfig): void => {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem(ACTIVE_CHAR_KEY, JSON.stringify(character));
    }
  } catch (e) {
    console.warn('Failed to save active character', e);
  }
};
