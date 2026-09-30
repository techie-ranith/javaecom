# Aurelia Mobile

Expo React Native customer app for the Aurelia perfume store.

## Stack

- Expo (managed) + Expo Router
- TypeScript
- NativeWind
- TanStack Query
- Axios
- React Hook Form + Zod
- Expo SecureStore
- Lucide React Native
- Reanimated

## Setup

```bash
cd mobile
npm install
```

Create or edit `.env`:

```env
EXPO_PUBLIC_API_URL=http://localhost:8080/api
EXPO_PUBLIC_USE_MOCK=true
```

For a physical device, use your computer's LAN IP:

```env
EXPO_PUBLIC_API_URL=http://192.168.x.x:8080/api
EXPO_PUBLIC_USE_MOCK=false
```

## Run

```bash
npx expo start
```

Mock mode stays on by default so the app works without the Spring Boot server.
When the API is reachable, set `EXPO_PUBLIC_USE_MOCK=false` to use live data only.
With mock enabled, the app still tries the real API first and falls back to mock data on network errors.
