// import { getLastUpdatets } from '@/API/Kodik/getLatestUpdatets';
// import { getToken } from '@/API/Kodik/getToken';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import * as BackgroundFetch from 'expo-background-fetch';
// import * as BackgroundTask from "expo-background-task";
// import * as Notifications from 'expo-notifications';
// import * as TaskManager from 'expo-task-manager';
// import { useEffect, useRef } from 'react';
// import { AppState, AppStateStatus, Button, View } from 'react-native';

// const TASK_NAME = 'background-fetch-task22';
// const SAVE_KEY = 'lastSavedAnime1';

// Notifications.setNotificationHandler({
//     handleNotification: async () => ({
//         shouldShowBanner: true,
//         shouldShowList: true,
//         shouldPlaySound: false,
//         shouldSetBadge: false,
//     }),
// });

// // TaskManager.getRegisteredTasksAsync().then((tasks) => {
// //     console.log('REGISTERED', tasks);
// // });

// const fetchLastUpdates = async (token: string) => {
//     const rKodik = await getLastUpdatets(token);
//     const result = rKodik[0];
//     const data = {
//         id: result.id,
//         voice: result.translation.id,
//         title: result.title,
//         last_episode: result.last_episode,
//         translation_title: result.translation.title,
//     }
//     return data;
// }

// TaskManager.defineTask(TASK_NAME, async () => {
//     try {
//         const registeredAtStr = await AsyncStorage.getItem('TASK_REGISTERED_AT');
//         if (!registeredAtStr) return BackgroundFetch.BackgroundFetchResult.NoData;

//         const registeredAt = parseInt(registeredAtStr, 10);
//         const now = Date.now();
//         const diffMs = now - registeredAt;
//         const diffMinutes = Math.floor(diffMs / 60000);

//         console.log(`⌛ Задача выполняется. Прошло минут: ${diffMinutes}`);

//         await AsyncStorage.setItem('TASK_REGISTERED_AT', now.toString());

//         const raw = await AsyncStorage.getItem(SAVE_KEY);
//         const item = raw ? JSON.parse(raw) : null;

//         const token = await getToken();

//         if (token && !item) {
//             const response = await fetchLastUpdates(token)
//             return await AsyncStorage.setItem(SAVE_KEY, JSON.stringify(response));

//         } else if (token && item) {
//             const response = await fetchLastUpdates(token)

//             if (item?.id !== response.id && item?.voice !== response.voice) {
//                 await Notifications.scheduleNotificationAsync({
//                     content: {
//                         title: `✨ Новая серия — ${response.title}`,
//                         body: `Серия: ${response.last_episode}\nОзвучка: ${response.translation_title}`,
//                         sound: true,
//                         priority: Notifications.AndroidNotificationPriority.HIGH,
//                         subtitle: " ",
//                     },
//                     trigger: null,
//                 });
//                 await AsyncStorage.setItem('lastAnime2', JSON.stringify(response));
//             } else {
//                 return await Notifications.scheduleNotificationAsync({
//                     content: {
//                         title: `Новых серий нет :(`,
//                         badge: 2,
//                         body: 'уведомим когда будут',
//                         sound: true,
//                     },
//                     trigger: null,
//                 });
//             }
//         } else {
//             return BackgroundFetch.BackgroundFetchResult.Failed;
//         }
//         return BackgroundFetch.BackgroundFetchResult.NewData;
//     } catch (error) {
//         console.error('❌ Background task failed:', error);
//         return BackgroundFetch.BackgroundFetchResult.Failed;
//     }
// });

// export default function App() {
//     const appState = useRef(AppState.currentState);

//     useEffect(() => {
//         const setup = async () => {
//             const { status } = await Notifications.requestPermissionsAsync();
//             if (status !== 'granted') {
//                 console.warn('Нет разрешения на уведомления');
//                 return;
//             }

//             const isRegistered = await TaskManager.isTaskRegisteredAsync(TASK_NAME);

//             const now = Date.now().toString();
//             const registeredAtStr = await AsyncStorage.getItem('TASK_REGISTERED_AT');

//             if (registeredAtStr) {
//                 const registeredAt = Number(registeredAtStr);
//                 const diff = Date.now() - registeredAt;
//                 const diffMinutes = Math.floor(diff / 60000);
//                 console.log(`🕒 С момента регистрации задачи прошло: ${diffMinutes} минут`);
//             } else {
//                 console.log('🆕 Первая регистрация фоновой задачи');
//                 await AsyncStorage.setItem('TASK_REGISTERED_AT', now.toString());
//             }

//             if (!isRegistered) {
//                 await BackgroundTask.registerTaskAsync(TASK_NAME, {
//                     minimumInterval: 15 * 60, // каждые 15 минут
//                 });
//                 console.log('✅ Background fetch task registered');
//             } else {
//                 console.log('ℹ️ Background fetch already registered');
//             }
//         };

//         setup();
//     }, []);

//     useEffect(() => {
//         const appStateSubscription = AppState.addEventListener(
//             "change",
//             (nextAppState: AppStateStatus) => {
//                 if (
//                     appState.current.match(/inactive|background/) &&
//                     nextAppState === "active"
//                 ) {
//                     console.log("App has come to the foreground!");
//                 }
//                 if (appState.current.match(/active/) && nextAppState === "background") {
//                     console.log("App has gone to the background!");
//                 }
//                 appState.current = nextAppState;
//             }
//         );

//         // Cleanup subscription on unmount
//         return () => {
//             appStateSubscription.remove();
//         };
//     }, [])

//     return (
//         <View style={{ paddingTop: 200 }}>
            // <Button
            //     title="Run Background Task (Debug)"
            //     onPress={async () => {
            //         await BackgroundTask.triggerTaskWorkerForTestingAsync();
            //     }}
            // />
//         </View>
//     );
// }
