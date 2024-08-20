import { PREFIX } from "./../../helpers/API";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios, { AxiosError } from "axios";
import { saveState, loadState } from "../localStorage/jwt";
import { DATA_PERSISTENT_STATE } from "../localStorage/userData";

interface AuthState {
  _id: string | null;
  accessToken: string | null;
  userName: string | null;
  userSurname: string | null;
  gift: string | null;
  role: string | null;
  coins: number;
  loginErrorMessage?: string | undefined;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  accessToken: "",
  userName: "",
  userSurname: "",
  gift: "",
  role: "",
  coins: 0,
  loading: false,
  _id: null,
  error: null,
};

// Функция для выполнения запроса на сервер
export const loginUser = async (
  userName: string,
  userSurname: string
): Promise<AuthState | undefined> => {
  try {
    const { data } = await axios.post<AuthState>(`${PREFIX}/api/login`, {
      name: userName,
      surname: userSurname,
    });
    return data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw error.response?.data.message || "Непредвиденная ошибка при входе";
    }
  }
};

export const loginAsync = createAsyncThunk(
  "user/login",
  async (
    { userName, userSurname }: { userName: string; userSurname: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await loginUser(userName, userSurname);
      return response;
    } catch (error) {
      // Возвращаем ошибку с помощью rejectWithValue
      return rejectWithValue(error);
    }
  }
);

// Асинхронный thunk для обновления данных пользователя
export const updateUserData = createAsyncThunk(
  "user/update",
  async (_, { getState, rejectWithValue }) => {
    const state = getState() as { auth: AuthState };
    const authData = loadState(DATA_PERSISTENT_STATE); // Загружаем данные из localStorage

    if (!authData) {
      return rejectWithValue("No user data found in localStorage");
    }

    try {
      const { data } = await axios.patch<AuthState>(
        `${PREFIX}/api/users/${state.auth._id}`,
        authData
      );
      return data;
    } catch (error) {
      if (error instanceof AxiosError) {
        return rejectWithValue(
          error.response?.data.message || "Failed to update user data"
        );
      }
      return rejectWithValue("Unexpected error occurred");
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuthData: (state, action: PayloadAction<Partial<AuthState>>) => {
      const { accessToken, userName, userSurname, gift, role, coins } =
        action.payload;
      if (accessToken !== undefined) state.accessToken = accessToken;
      if (userName !== undefined) state.userName = userName;
      if (userSurname !== undefined) state.userSurname = userSurname;
      if (gift !== undefined) state.gift = gift;
      if (role !== undefined) state.role = role;
      if (coins !== undefined) state.coins = coins;

      saveState(DATA_PERSISTENT_STATE, state);
    },
    clearAuthData: (state) => {
      state.accessToken = null;
      state.userName = null;
      state.userSurname = null;
      state.gift = null;
      state.role = null;
      state.coins = 0;
    },
    updateCoins: (state, action: PayloadAction<number>) => {
      state.coins = action.payload;
      saveState(DATA_PERSISTENT_STATE, state);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginAsync.pending, (state) => {
        state.loginErrorMessage = undefined;
      })
      .addCase(loginAsync.fulfilled, (state, action) => {
        const { _id, userName, userSurname, gift, accessToken, coins } =
          action.payload || {};
        state._id = _id ?? null;
        state.userName = userName ?? null;
        state.userSurname = userSurname ?? null;
        state.gift = gift ?? null;
        state.accessToken = accessToken ?? null;
        state.coins = coins ?? 0;

        // Сохранение состояния в localStorage
        saveState(DATA_PERSISTENT_STATE, state); // Передаем ключ и состояние
      })
      .addCase(loginAsync.rejected, (state, action) => {
        state.loginErrorMessage = action.payload as string;
      })
      .addCase(updateUserData.fulfilled, (state, action) => {
        // Если данные пользователя успешно обновлены на сервере, обновляем состояние
        state.userName = action.payload?.userName ?? state.userName;
        state.userSurname = action.payload?.userSurname ?? state.userSurname;
        state.coins = action.payload?.coins ?? state.coins;
        saveState(DATA_PERSISTENT_STATE, state);
      })
      .addCase(updateUserData.rejected, (state, action) => {
        state.error = action.payload as string;
      });
  },
});

export const { setAuthData, clearAuthData, updateCoins } = authSlice.actions;

export default authSlice.reducer;
