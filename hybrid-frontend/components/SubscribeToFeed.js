import * as ActionCable from "@rails/actioncable";

const NGROK_URL = process.env.NGROK_URL;
const websocketURL = NGROK_URL.replace(/^https/, "wss");

const cable = ActionCable.createConsumer(`${websocketURL}/cable`);

export const subscribeToFeed = (currentUserId, onMessageReceived) => {
  
  console.log("LOS SIGUIENTES MENSAJES SON DESDE SubscribeToFeed.js");
  
  console.log("currentUserId", currentUserId);
  console.log("NGROK_URL", NGROK_URL);
  console.log("websocketURL", websocketURL);

  const subscription = cable.subscriptions.create(
    { channel: "FeedChannel", user_id: currentUserId },
    {
      connected: () => {
        console.log("Connected to FeedChannel for user", currentUserId);
        //console.log("cable", cable);
      },
      disconnected: () => {
        console.log("Disconnected from FeedChannel for user", currentUserId);
      },
      rejected: () => {
        console.log("Subscription rejected by FeedChannel for user", currentUserId);
      },
      received(message) {
        console.log("Received message from FeedChannel>", message);
        onMessageReceived(message);
      },
    }
  );

  return () => {
    if (subscription) subscription.unsubscribe();
  };
};
