import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { loadState, saveState, loadJwtToken } from "../localStorage/jwt";
import { PREFIX } from "../../helpers/API";

import axios, { AxiosError } from "axios";
import { DATA_PERSISTENT_STATE } from "../localStorage/userData";

export interface UserProfile {
  id: string | null;
  accessToken: string | null;
  loginErrorMessage?: string | undefined;
  userName: string | null;
  userSurname: string | null;
  gift: string | null;
}

// Начальное состояние данных пользователя
const initialState: UserProfile = {
  id: loadState<UserProfile>(DATA_PERSISTENT_STATE)?.id ?? null,
  accessToken: loadJwtToken("accessToken"),
  userName: "userName",
  userSurname: "userSurname",
  gift: "gift",
};

// Функция для выполнения запроса на сервер
export const loginUser = async (
  userName: string,
  userSurname: string
): Promise<UserProfile | undefined> => {
  try {
    const { data } = await axios.post<UserProfile>(`${PREFIX}/api/login`, {
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

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    clearUserState: (state) => {
      state.id = null;
      state.userName = null;
      state.userSurname = null;
      state.gift = null;
      state.accessToken = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginAsync.pending, (state) => {
        state.loginErrorMessage = undefined;
      })
      .addCase(loginAsync.fulfilled, (state, action) => {
        const { id, userName, userSurname, gift, accessToken } =
          action.payload || {};
        state.id = id ?? null;
        state.userName = userName ?? null;
        state.userSurname = userSurname ?? null;
        state.gift = gift ?? null;
        state.accessToken = accessToken ?? null;

        // Сохранение состояния в localStorage
        saveState(DATA_PERSISTENT_STATE, state); // Передаем ключ и состояние
      })
      .addCase(loginAsync.rejected, (state, action) => {
        state.loginErrorMessage = action.payload as string;
      });
  },
});

export const { clearUserState } = userSlice.actions;

export default userSlice.reducer;
