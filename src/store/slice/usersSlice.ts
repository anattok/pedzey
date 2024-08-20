import { PREFIX } from "../../helpers/API";
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { RootState } from "../store";

export interface User {
  _id: string;
  userName: string;
  userSurname: string;
  coins: string;
  gift: string;
}

interface UsersState {
  users: User[];
  loading: boolean;
  error: string | null;
}

const initialState: UsersState = {
  users: [],
  loading: false,
  error: null,
};

// Асинхронный thunk для получения пользователей
export const fetchUsers = createAsyncThunk("users/fetchUsers", async () => {
  const response = await axios.get(`${PREFIX}/api/users`);
  return response.data;
});

export const updateUserCoins = createAsyncThunk(
  "users/updateUserCoins",
  // async ({ userId, coins }: { userId: string; coins: string }) => {
  //   const response = await axios.patch(`${PREFIX}/api/users/${userId}/coins`, {
  //     coins,
  //   });

  async (
    { userId, coins }: { userId: string; coins: string },
    { dispatch, getState }
  ) => {
    const response = await axios.patch(`${PREFIX}/api/users/${userId}/coins`, {
      coins,
    });

    const updatedUser = response.data;

    // После обновления пользователя проверьте, является ли он текущим пользователем
    const state: RootState = getState() as RootState;
    const currentUser = state.auth;

    if (currentUser._id === userId) {
      // Если это текущий пользователь, обновите состояние auth
      dispatch(updateAuthCoins(updatedUser.coins));
    }

    return updatedUser;
  }
);

const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action: PayloadAction<User[]>) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch users";
      })
      .addCase(updateUserCoins.fulfilled, (state, action) => {
        const updatedUser = action.payload;
        const userIndex = state.users.findIndex(
          (u) => u._id === updatedUser._id
        );
        if (userIndex >= 0) {
          state.users[userIndex].coins = updatedUser.coins;
        }
      });
  },
});

export default usersSlice.reducer;
