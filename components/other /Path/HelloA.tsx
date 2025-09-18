// HelloAnimation.js

import React, { useEffect, useRef, useState } from 'react';
import { Animated, Dimensions, StyleSheet, View } from 'react-native';

// Получаем размеры экрана для случайного позиционирования
const { width, height } = Dimensions.get('window');

// Список приветствий на разных языках
const GREETINGS = [
    'Hello', '你好', 'Hola', 'Bonjour', 'Ciao', 'こんにちは', '안녕하세요', 'Привет', 'Olá', 'Guten Tag', 'שלום', 'مرحبا'
];

const HelloAnimation = () => {
    // 1. СОСТОЯНИЕ И REFS
    // Индекс текущего слова в массиве GREETINGS
    const [currentIndex, setCurrentIndex] = useState(0);

    // Animated-значения для анимации. Используем useRef, чтобы они не пересоздавались при каждом рендере.
    // Opacity (прозрачность)
    const opacity = useRef(new Animated.Value(0)).current;
    // Позиция X и Y
    const position = useRef(new Animated.ValueXY({ x: 0, y: 0 })).current;

    // 2. ЛОГИКА АНИМАЦИИ В useEffect
    useEffect(() => {
        // Эта функция будет запускаться каждый раз, когда меняется `currentIndex`

        // Сбрасываем значения перед началом новой анимации
        opacity.setValue(0);
        // Задаем случайную начальную позицию для нового слова
        position.setValue({
            x: (Math.random() - 0.5) * (width / 2),
            y: (Math.random() - 0.5) * (height / 2),
        });

        // 3. СОЗДАНИЕ ПОСЛЕДОВАТЕЛЬНОСТИ АНИМАЦИЙ
        const animationSequence = Animated.sequence([
            // A. Анимация появления и движения
            Animated.parallel([
                // Появление (opacity от 0 до 1)
                Animated.timing(opacity, {
                    toValue: 1,
                    duration: 1500, // Длительность 1.5 сек
                    useNativeDriver: true, // Важно для производительности
                }),
                // Плавное движение к центру
                Animated.spring(position, {
                    toValue: { x: 0, y: 0 },
                    friction: 4, // Коэффициент трения (меньше -> больше "пружинит")
                    useNativeDriver: true,
                }),
            ]),

            // Б. Пауза
            Animated.delay(2000), // Ждем 2 секунды

            // В. Анимация исчезновения
            Animated.timing(opacity, {
                toValue: 0,
                duration: 1500,
                useNativeDriver: true,
            }),
        ]);

        // 4. ЗАПУСК АНИМАЦИИ И ПЕРЕХОД К СЛЕДУЮЩЕМУ СЛОВУ
        animationSequence.start(({ finished }) => {
            // Когда анимация завершилась, обновляем индекс.
            // Используем оператор %, чтобы зациклить массив.
            if (finished) {
                setCurrentIndex((prevIndex) => (prevIndex + 1) % GREETINGS.length);
            }
        });

        // Функция очистки (выполняется при размонтировании компонента)
        return () => {
            animationSequence.stop();
        };
    }, [currentIndex]); // Перезапускаем эффект при смене currentIndex

    // 5. СТИЛИ И РЕНДЕРИНГ
    // Применяем анимированные значения к стилям
    const animatedStyle = {
        opacity: opacity,
        transform: position.getTranslateTransform(),
    };

    return (
        <View style={styles.container}>
            <Animated.Text style={[styles.text, animatedStyle]}>
                {GREETINGS[currentIndex]}
            </Animated.Text>
        </View>
    );
};

// Стили
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#000', // Черный фон, как у Apple
    },
    text: {
        fontSize: 56,
        fontWeight: 'bold',
        color: '#FFF', // Белый текст
        position: 'absolute', // Позиционируем абсолютно, чтобы transform работал корректно
    },
});

export default HelloAnimation;