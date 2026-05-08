export async function requestNotificationPermission(): Promise<boolean> {
  if (!('Notification' in window)) {
    console.log('This browser does not support desktop notification');
    return false;
  }

  if (Notification.permission === 'granted') {
    return true;
  }

  if (Notification.permission !== 'denied') {
    try {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    } catch (err) {
      console.warn("Notification request blocked (likely due to iframe):", err);
      // Fails gracefully in iframes
      return false;
    }
  }

  return false;
}

export function sendLocalNotification(title: string, body: string) {
  if (Notification.permission === 'granted') {
    const notification = new Notification(title, {
      body,
      icon: '/icon.svg',
      badge: '/icon.svg',
      vibrate: [200, 100, 200]
    });
    
    notification.onclick = function() {
      window.focus();
      this.close();
    };
  }
}

export function scheduleDailyReminder(currentDay: number) {
  // In a full production PWA, this would register a sync event or a background periodic task
  // to trigger a local notification.
  // For the frontend-only environment, we will fire it on next app load conceptually, 
  // or via Web Push subscriptions handled by a hypothetical backend.
  console.log(`[SYS] Scheduled push for Day ${Math.min(currentDay + 1, 30)}`);
}
