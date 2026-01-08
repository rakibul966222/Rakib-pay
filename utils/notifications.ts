
export const requestNotificationPermission = async () => {
  if (!("Notification" in window)) {
    console.log("This browser does not support desktop notification");
    return false;
  }

  if (Notification.permission === "granted") return true;

  const permission = await Notification.requestPermission();
  return permission === "granted";
};

export const sendNotification = (title: string, options?: NotificationOptions) => {
  if (Notification.permission === "granted") {
    const notification = new Notification(title, {
      icon: 'https://cdn-icons-png.flaticon.com/512/10438/10438137.png', // A wallet icon
      badge: 'https://cdn-icons-png.flaticon.com/512/10438/10438137.png',
      ...options
    });

    notification.onclick = () => {
      window.focus();
      notification.close();
    };
  }
};
