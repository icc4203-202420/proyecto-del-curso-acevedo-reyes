import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';
import { Platform } from 'react-native';

const NGROK_URL = process.env.NGROK_URL;

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

async function registerForPushNotificationsAsync() {

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== 'granted') {
    alert('Failed to get push token for push notification!');
    return;
  }

  // hay q poner el projectId en el app.json pero yo no lo cree asi q quede estancado..
  const projectId = Constants.expoConfig?.extra?.eas?.projectId || 'YOUR_PROJECT_ID';
  const token = (await Notifications.getExpoPushTokenAsync({ projectId })).data;
 
  //console.log(token);

  return token;
}


module.exports = {
    registerForPushNotificationsAsync
}