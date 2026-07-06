self.addEventListener("push", (event) => {
  let payload = { title: "DispatchFlow", body: "", url: "/" };
  try {
    payload = event.data ? event.data.json() : payload;
  } catch {
    payload.body = event.data?.text() ?? "";
  }

  event.waitUntil(
    self.registration.showNotification(payload.title, {
      body: payload.body,
      icon: "/dispatchflow-icon.svg",
      data: { url: payload.url },
    }),
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const url = event.notification.data?.url ?? "/";
  event.waitUntil(clients.openWindow(url));
});
