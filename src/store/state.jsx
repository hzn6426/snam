import { immer } from "zustand/middleware/immer";
import defaultSettings from '../../config/defaultSettings';
import { createStoreContext, defineStoreInstance } from "@/store/store";

function current(state) {
    return JSON.parse(JSON.stringify(state));
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
    view:{
        navTheme: defaultSettings.navTheme,
        layout: defaultSettings.layout,
        contentWidth: defaultSettings.contentWidth,
        fixedHeader: defaultSettings.fixedHeader,
        fixSiderbar: defaultSettings.fixSiderbar,
        pwa: defaultSettings.pwa,
        headerHeight: defaultSettings.headerHeight,
        siderWidth: defaultSettings.siderWidth,
        isTabs: defaultSettings.isTabs,
        colorPrimary: defaultSettings.colorPrimary,
        splitMenus: defaultSettings.splitMenus,
    }
});
export const [ApplicationStateProvider, useApplicationState] = createStoreContext(applicationStateInstance);

