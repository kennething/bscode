export default defineNuxtRouteMiddleware(async (to, from) => {
  const userStore = useUserStore();

  if (from.fullPath !== to.fullPath) return;

  userStore.files = JSON.parse(localStorage.getItem("files") ?? "{}");
});
