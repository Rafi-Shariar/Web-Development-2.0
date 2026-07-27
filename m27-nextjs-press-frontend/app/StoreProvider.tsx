/* eslint-disable react-hooks/refs */
'use client'
import { add } from '@/lib/store/features/cart/cartSlice'
import { AppStore, makeStore } from '@/lib/store/store'
import { ReactNode, useRef } from 'react'
import { Provider } from 'react-redux'


export default function StoreProvider({ children,}: { children: ReactNode}) {
  const storeRef = useRef<AppStore>(undefined)
  if (!storeRef.current) {
    // Create the store instance the first time this renders
    storeRef.current = makeStore();
    // storeRef.current.dispatch(add("initialProductId"));
  }

  return <Provider store={storeRef.current}>{children}</Provider>
}