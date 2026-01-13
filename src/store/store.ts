import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import aziendeReducer from './slices/aziendeSlice';
import detailReducer from './slices/detailSlice';
import osservazioniReducer from './slices/osservazioniSlice';
import schedeReducer from './slices/schedeSlice';
import searchReducer from './slices/searchSlice';
import settingsReducer from './slices/settingsSlice';
import sitiReducer from './slices/sitiSlice';
import themesReducer from './slices/themesSlice';
import tipologiaSitoReducer from './slices/tipologiaSitoSlice';
import trappolReducer from './slices/trappolSlice';

export const store = configureStore({
  reducer: {
    search: searchReducer,
    detail: detailReducer,
    auth: authReducer,
    settings: settingsReducer,
    schede: schedeReducer,
    osservazioni: osservazioniReducer,
    siti: sitiReducer,
    aziende: aziendeReducer,
    trappole: trappolReducer,
    themes: themesReducer,
    tipologiasito: tipologiaSitoReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
