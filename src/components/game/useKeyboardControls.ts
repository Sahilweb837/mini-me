import { useState, useEffect } from 'react';

export interface KeyboardState {
  forward: boolean;
  backward: boolean;
  left: boolean;
  right: boolean;
  jump: boolean;
  sprint: boolean;
  interact: boolean;
  emoteDance: boolean;
  emoteCheer: boolean;
}

export function useKeyboardControls(): KeyboardState {
  const [keys, setKeys] = useState<KeyboardState>({
    forward: false,
    backward: false,
    left: false,
    right: false,
    jump: false,
    sprint: false,
    interact: false,
    emoteDance: false,
    emoteCheer: false,
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't capture if typing in an input
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) return;

      switch (e.code) {
        case 'KeyW':
        case 'ArrowUp':
          setKeys(k => ({ ...k, forward: true }));
          break;
        case 'KeyS':
        case 'ArrowDown':
          setKeys(k => ({ ...k, backward: true }));
          break;
        case 'KeyA':
        case 'ArrowLeft':
          setKeys(k => ({ ...k, left: true }));
          break;
        case 'KeyD':
        case 'ArrowRight':
          setKeys(k => ({ ...k, right: true }));
          break;
        case 'Space':
          e.preventDefault();
          setKeys(k => ({ ...k, jump: true }));
          break;
        case 'ShiftLeft':
        case 'ShiftRight':
          setKeys(k => ({ ...k, sprint: true }));
          break;
        case 'KeyE':
          setKeys(k => ({ ...k, interact: true }));
          break;
        case 'Digit1':
          setKeys(k => ({ ...k, emoteDance: true }));
          break;
        case 'Digit2':
          setKeys(k => ({ ...k, emoteCheer: true }));
          break;
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      switch (e.code) {
        case 'KeyW':
        case 'ArrowUp':
          setKeys(k => ({ ...k, forward: false }));
          break;
        case 'KeyS':
        case 'ArrowDown':
          setKeys(k => ({ ...k, backward: false }));
          break;
        case 'KeyA':
        case 'ArrowLeft':
          setKeys(k => ({ ...k, left: false }));
          break;
        case 'KeyD':
        case 'ArrowRight':
          setKeys(k => ({ ...k, right: false }));
          break;
        case 'Space':
          setKeys(k => ({ ...k, jump: false }));
          break;
        case 'ShiftLeft':
        case 'ShiftRight':
          setKeys(k => ({ ...k, sprint: false }));
          break;
        case 'KeyE':
          setKeys(k => ({ ...k, interact: false }));
          break;
        case 'Digit1':
          setKeys(k => ({ ...k, emoteDance: false }));
          break;
        case 'Digit2':
          setKeys(k => ({ ...k, emoteCheer: false }));
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  return keys;
}
