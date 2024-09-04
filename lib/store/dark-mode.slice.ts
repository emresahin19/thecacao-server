import { setLocalStorageItem } from '@asim-ui/utils'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { DarkModeState } from './store.props'

const initialState: DarkModeState = {
  isEnabled: false,
}

export const styleSlice = createSlice({
  name: 'darkMode',
  initialState,
  reducers: {
    setDarkMode: (state, action: PayloadAction<boolean | null>) => {
      state.isEnabled = action.payload ?? !state.isEnabled

      if (typeof document !== 'undefined') {
        document.body.classList[state.isEnabled ? 'add' : 'remove']('dark-theme')
      }
      setLocalStorageItem('darkMode', state.isEnabled)
    },
  },
})

// Action creators are generated for each case reducer function
export const { setDarkMode } = styleSlice.actions

export default styleSlice.reducer
