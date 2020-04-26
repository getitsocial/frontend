export default function ({ store, redirect, route }) {
  // If the user is not authenticated
  if (!store.state.accessToken) {
    return redirect('/login')
  }

  const publicRoutes = ['profile', 'profile-settings']

  if (
    !store.getters.haveShop &&
    !publicRoutes.some((name) => name === route.name)
  ) {
    return redirect('/shop/create')
  }
}
