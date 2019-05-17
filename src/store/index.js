import Vue from "vue"
import Vuex from "vuex"
import VueResource from 'vue-resource'

import mapConfig from '../../map-config.json'
import placeData from '../data-preprocessed/places.csv'

Vue.use(Vuex)
Vue.use(VueResource)

const defaultMapConfig = {
    baseLayer:  mapConfig.baseLayers[0],
    overlayMap:  null,
    overlayMapOpacity: 0.75,
    markerType: 'circle',
    showGenesis: false,
    showBible: false,
    showParadiseLost: false,
    active: false
}

const firstMapConfig = {...defaultMapConfig}
firstMapConfig.active = true
firstMapConfig.overlayMap = mapConfig.overlayMaps[0]
firstMapConfig.showParadiseLost = true

export default new Vuex.Store({
    state: {
       
        menuCollapsed: false,

        selectedPlace: null,
        passagePaneOpen: false,
        activeDetailTab: "tab-passages",

        mapCenter: null,
        mapZoom: 3,

        mapViewChanging: null,

        mapConfigs: {
            1: firstMapConfig,
            2: {...defaultMapConfig},
            3: {...defaultMapConfig},
            4: {...defaultMapConfig}
        },
        maps: [1, 2, 3, 4],
        selectedMap: 1,

        colorSchemeIndex: 0
    },
    getters: {
        menuCollapsed: state => state.menuCollapsed,

        baseLayer: state => state.mapConfigs[state.selectedMap].baseLayer,
        overlayMap: state => state.mapConfigs[state.selectedMap].overlayMap ,

        markerType: state => state.mapConfigs[state.selectedMap].markerType,

        selectedPlace: state => {
        	return state.selectedPlace || placeData.find((place) => place["Place"] === state.route.hash.substring(1))
        },
        passagePaneOpen: state => state.passagePaneOpen,
        activeDetailTab: state => state.activeDetailTab,
        showGenesis: state => state.mapConfigs[state.selectedMap].showGenesis,
        showBible: state => state.mapConfigs[state.selectedMap].showBible,
        showParadiseLost: state => state.mapConfigs[state.selectedMap].showParadiseLost,

        overlayMapOpacity: state => state.mapConfigs[state.selectedMap].overlayMapOpacity,

        mapCenter: state => state.mapCenter,
        mapZoom: state => state.mapZoom,

        mapViewChanging: state => state.mapViewChanging,

        maps: state => state.maps,
        selectedMap: state => state.selectedMap,
        selectedMapIndex: state => state.maps.indexOf(state.selectedMap),
        selectedMapConfig: state => state.mapConfigs[state.selectedMap],

        mapConfigs: state => state.mapConfigs,
        activeMaps: state => state.maps.filter(n => state.mapConfigs[n].active),

        colorScheme: state => mapConfig.colorSchemes[state.colorSchemeIndex],
        colorSchemeIndex: state => state.colorSchemeIndex
    },
    mutations: {
        setMenuCollapsed: (state, collapsed) => state.menuCollapsed = collapsed,

    	setBaseLayer: (state, layerID) => state.mapConfigs[state.selectedMap].baseLayer = layerID,
    	setOverlayMap: (state, mapID) => state.mapConfigs[state.selectedMap].overlayMap = mapID,
        setMarkerType: (state, type) => state.mapConfigs[state.selectedMap].markerType = type,

    	setSelectedPlace: (state, place) => state.selectedPlace = place,
    	setPassagePaneOpen: (state, open) => state.passagePaneOpen = open,
        setActiveDetailTab: (state, id) => state.activeDetailTab = id,
    	setShowGenesis: (state, show) => state.mapConfigs[state.selectedMap].showGenesis = show,
        setShowBible: (state, show) => state.mapConfigs[state.selectedMap].showBible = show,
        setShowParadiseLost: (state, show) => state.mapConfigs[state.selectedMap].showParadiseLost = show,

    	setOverlayMapOpacity: (state, opacity) => state.mapConfigs[state.selectedMap].overlayMapOpacity = opacity,

        setMapCenter: (state, centerInfo) => state.mapCenter = centerInfo,
        setMapZoom: (state, zoomInfo) => state.mapZoom = zoomInfo,

        mapViewChanging: (state, n) => state.mapViewChanging = n,

        setSelectedMap: (state, n) => state.selectedMap = n,
        setSelectedMapIndex: (state, i) => {state.selectedMap = state.maps[i]; console.log("x"+i)},

        addMap: (state, n) => state.maps.push(n),
        removeMap: (state, n) => state.mapConfigs[n].active = false, //state.maps.splice(state.maps.indexOf(n), 1),

        setMapConfig: (state, {n, config}) => state.mapConfigs[n] = config,
        removeMapConfig: (state, n) => delete state.mapConfig[n],

        setColorSchemeIndex: (state, colorSchemeIndex) => state.colorSchemeIndex = colorSchemeIndex

    },
    actions: {
    	unselectPlace: (context) => {
    		context.commit('setSelectedPlace', null)
    		context.commit('setPassagePaneOpen', false)
    	},
        showPassages: (context) => {
            context.commit('setPassagePaneOpen', true)
            context.commit('setActiveDetailTab', "tab-passages")
        },
        showRelated: (context) => {
            context.commit('setPassagePaneOpen', true)
            context.commit('setActiveDetailTab', "tab-related")
        },
        setMapView: (context, {center, zoom, source}) => {
            context.commit('setMapCenter', {center: center, source: source})
            context.commit('setMapZoom', {zoom: zoom, source: source})
        },
        addMap: (context) => {
   
            for (let map in context.state.maps) {
                const n = context.state.maps[map]
                if (context.state.mapConfigs[n].active) continue

                context.state.mapConfigs[n].active = true
                context.commit('setSelectedMap', n)
                break
            }

        },
        removeMap: (context, n) => {
            console.log("remove " + n)
            const selectedMap = context.state.selectedMap
            const indexToRemove = context.state.maps.indexOf(n)
            if (context.state.maps.indexOf(selectedMap) <= indexToRemove) {
                context.commit('setSelectedMap', context.state.maps[indexToRemove - 1])
            }
            context.commit('removeMap', n)
        },
        selectMap: (context, n) => {
            //context.commit('setSelectedMapConfig', context.state.mapConfigs[n])
            context.commit('setSelectedMap', n)
        }
    }
})