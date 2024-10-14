<template>
  <main>
    <div>
      <RouterLink to="/sign-in">To sign in page</RouterLink>
      <RouterLink to="/sign-up">To sign up page</RouterLink>
    </div>

    <p>Current route path is: {{ $route.fullPath }}</p>

    <RouterView />
  </main>
</template>
