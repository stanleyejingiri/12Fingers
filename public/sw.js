//12fingers28th/public/sw.js
self.addEventListener('push', (event) => {
  console.log('🔔 Push event received');
  
  let data = {};
  if (event.data) {
    data = event.data.json();
    console.log('📦 Push data:', data);
  }
  
  const title = data.title || '12Fingers';
  const options = {
    body: data.body || 'You have a new notification',
    icon: '/favicon.ico',
    badge: '/favicon.ico',
    data: {
      url: data.url || '/dashboard'
    }
  };
  
  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const urlToOpen = event.notification.data?.url || '/dashboard';
  event.waitUntil(
    clients.openWindow(urlToOpen)
  );
});
/*
self.addEventListener('push', (event) => {
  const data = event.data.json();
  const title = data.title || '12Fingers';
  const options = {
    body: data.body,
    icon: '/favicon.ico',
    badge: '/favicon.ico',
    data: {
      url: data.url || '/dashboard'
    }
  };
  
  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const urlToOpen = event.notification.data?.url || '/dashboard';
  event.waitUntil(
    clients.openWindow(urlToOpen)
  );
});

self.addEventListener('push', (event) => {
  console.log('🔔 Push event received');
  const data = event.data.json();
  console.log('📦 Push data:', data);
  
  event.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: '/favicon.ico',
      data: { url: data.url || '/dashboard' }
    })
  );
});*/