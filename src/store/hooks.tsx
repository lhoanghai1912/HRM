// src/store/hooks.ts
// Typed Redux hooks for use throughout the app

import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from './index';

/**
 * Typed version of useDispatch hook
 * Use this instead of plain `useDispatch` for proper type inference
 */
export const useAppDispatch = () => useDispatch<AppDispatch>();

/**
 * Typed version of useSelector hook
 * Use this instead of plain `useSelector` for proper type inference
 */
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
