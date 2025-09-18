import { NativeScrollEvent, NativeSyntheticEvent } from 'react-native';
import { SharedValue } from 'react-native-reanimated';

/**
 * Создаёт обработчик прокрутки для обновления значения sharedValue.
 * 
 * @param sharedValue - SharedValue<number> из react-native-reanimated, который будет обновляться.
 * @param intensity - Определяет интенсивность изменения значения.
 * @returns Функция-обработчик события прокрутки.
 */
export const createScrollHandler = (sharedValue: SharedValue<number>, intensity: number) => {
    return (event: NativeSyntheticEvent<NativeScrollEvent>) => {
        const y = event.nativeEvent.contentOffset.y;
        const newValue = Math.round(Math.min(100, (y / 400) * intensity));
        if (newValue < 0) return;
        sharedValue.value = newValue;
    };
};
