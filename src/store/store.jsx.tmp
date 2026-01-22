import defu from "defu";
import { createContext, useContext, useRef } from "react";
import { create, useStore } from "zustand";
import { immer } from "zustand/middleware/immer";

immer(() => { });
/**
 * Define a store instance with default values and immer middleware.
 *
 * @param store Function that creates a store instance
 * @param defaults Default values for the store
 * @returns A function that creates a store instance with the provided defaults
 */
export function defineStoreInstance(store, defaults) {
    return (initial) => {
        const state = defu(initial, defaults);

        return create(store(state));
    };
}

/**
 * Create a store context with a provider and hook for consuming the store.
 *
 * @param instance Provide a store instance created with `defineStoreInstance`
 * @returns An array containing the StoreProvider, useStoreContext, withStoreProvider, and StoreContext
 */
export function createStoreContext(instance) {
    const StoreContext = createContext(null);


    function StoreProvider({ children, initial }) {
        const storeRef = useRef();
        if (!storeRef.current) {
            storeRef.current = instance(initial);
        }

        return (
            <StoreContext.Provider value={storeRef.current}>
                {children}
            </StoreContext.Provider>
        );
    }

    function useStoreContext(selector) {
        const store = useContext(StoreContext);

        if (!store) {
            throw new Error("useStore must be used within a StoreProvider");
        }

        return useStore(store, selector);
    }

    function withStoreProvider(component, initial) {
        const Component = component;

        return props => (
            <StoreProvider initial={initial}>
                <Component {...props} />
            </StoreProvider>
        );
    }

    return [StoreProvider, useStoreContext, withStoreProvider, StoreContext];
}
