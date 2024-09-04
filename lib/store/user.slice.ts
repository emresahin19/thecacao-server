import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { UserPayloadObject } from './store.props'

interface StateUser {
  name: string
  email: string
}

interface MainState {
  user: StateUser
}

const initialState: MainState = {
  user: {
    name: '',
    email: '',
  },
}

export const mainSlice = createSlice({
  name: 'main',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<UserPayloadObject>) => {
      state.user.name = action.payload.name
      state.user.email = action.payload.email
    },
    clearUser(state) {
      state.user = {
        name: '',
        email: '',
      }
    },
  },
})

// Action creators are generated for each case reducer function
export const { setUser, clearUser } = mainSlice.actions

export default mainSlice.reducer
