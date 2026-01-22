import { immer } from "zustand/middleware/immer";
import defaultSettings from '../../config/defaultSettings';
import { createStoreContext, defineStoreInstance } from "@/store/store";

function current(state) {
    return JSON.parse(JSON.stringify(state));
}

// 从localStorage加载保存的设置
function loadSettingsFromStorage() {
    try {
        const savedSettings = localStorage.getItem("settings");
        if (savedSettings) {
            const parsedSettings = JSON.parse(savedSettings);
            return {
                ...defaultSettings,
                ...parsedSettings
            };
        }
    } catch (error) {
        console.warn("Failed to load settings from localStorage:", error);
    }
    return defaultSettings;
}

const applicationStateInstance = defineStoreInstance((init) => {
    return immer((set) => ({
        ...init,
        actions: {
            view: {
                setNavTheme: theme => set((state) => {
                    state.view.navTheme = theme;
                }),
                setViewSetting: (view) => set((state) => {
                    state.view = {...view};
                }),
            }
        },
    }));
}, {
    view: loadSettingsFromStorage()
});
export const [ApplicationStateProvider, useApplicationState] = createStoreContext(applicationStateInstance);

