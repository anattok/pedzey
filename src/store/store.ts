import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slice/authSlice";
import usersReducer from "./slice/usersSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    users: usersReducer,
  },
});

// Определяем типы для использования в хуках useSelector и useDispatch
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
