<template>

  <div>
    <MapContainer id="mapContainer"/>
    <v-app id="app" class="overlay">
     
    
          <v-content>
            <v-container id="mainContainer" v-bind:class="{menuCollapsed: menuCollapsed}" fluid fill-height>
              <v-card id="menu-container">
                <v-navigation-drawer floating permanent class="elevation-1">
                  <MainPane />
                </v-navigation-drawer>
              </v-card>
             <v-layout justify-end align-end>
              <v-flex shrink class="controls">
               <v-card id="legend-pane" style="" flat class="transparent">
                    <div style="text-align: center; font-weight: bolder">Moral valence</div>
                   <div id="legend" :style="legendStyle"></div>
                   <v-layout justify-space-between>
                       <span>positive</span>
                       <span>neutral</span>
                       <span>negative</span>
                   </v-layout>
               </v-card>
              </v-flex>
             </v-layout>
            </v-container>
          </v-content>
          <v-navigation-drawer app absolute :right="true" v-model="passagePaneOpen" width="420" :disable-resize-watcher="true" :hide-overlay="true" stateless>
           <PassagePane/>
         </v-navigation-drawer>



    </v-app>
  </div>
</template>

<script>

import Map from './Map.vue'
import PassagePane from './PassagePane.vue'
import MainPane from './MainPane.vue'
import MapContainer from './MapContainer.vue'
import {mapGetters} from "vuex";
import AboutDialog from "./AboutDialog.vue";

export default {
  name: "app",
  data: () => ({
    mainPaneOpen: false,
    showAbout: false
  }),
  components: {
    Map, PassagePane, MainPane, MapContainer, AboutDialog
  },
  computed: {
    passagePaneOpen: {
      get() { return this.$store.getters.passagePaneOpen },
      set(value) { this.$store.commit('setPassagePaneOpen', value) }
    },
    selectedPlace() { return this.$store.getters.selectedPlace },
    ...mapGetters(['colorScheme', 'menuCollapsed']),

      legendStyle: {
        get() { return {
            background: [
             `-moz-linear-gradient(left, ${this.colorScheme["good"]} 0%, ${this.colorScheme["good"]} 33%, ${this.colorScheme["neutral"]} 48%, ${this.colorScheme["neutral"]} 52%, ${this.colorScheme["bad"]} 66%, ${this.colorScheme["bad"]} 100%)`,
             `-webkit-linear-gradient(${this.colorScheme["good"]} 0%, ${this.colorScheme["good"]} 33%, ${this.colorScheme["neutral"]} 48%, ${this.colorScheme["neutral"]} 52%, ${this.colorScheme["bad"]} 66%, ${this.colorScheme["bad"]} 100%)`,
             `linear-gradient(to right, ${this.colorScheme["good"]} 0%, ${this.colorScheme["good"]} 33%, ${this.colorScheme["neutral"]} 48%, ${this.colorScheme["neutral"]} 52%, ${this.colorScheme["bad"]} 66%, ${this.colorScheme["bad"]} 100%)`
            ]
        }}
      }
  },
  watch: {
    '$route'(to, from) {
      console.log(to) 
    },
    selectedPlace(place) {
      if (!place) {
        this.$store.commit('setPassagePaneOpen', false)
      }
    }
  },
 
  // created() {
  //   this.$store.dispatch('loadMapConfig')
  // },
};
</script>

<style lang='scss'>

@import url(https://fonts.googleapis.com/css?family=Playfair%20Display:bold,regular);
@import url(https://fonts.googleapis.com/css?family=Lato:bold,black,regular);
@import 'node_modules/leaflet/dist/leaflet';
@import 'node_modules/leaflet.markercluster/dist/MarkerCluster';
@import 'node_modules/leaflet.markercluster/dist/MarkerCluster.Default';

/*@import 'node_modules/vue-material/src/components/MDLayout/mixins';
*/

.app {
  position: relative;
  text-shadow:0 0 1px transparent;
  text-rendering: optimizeLegibility;
}

h1, h2, h3, h4, h5, h6, .headline {
  color: #993333;
  font-family: "Playfair Display";
}

/*.md-title {
  font-size: 1.8em;
  font-weight: bold;
}*/

#mapContainer, .overlay {
  position: absolute;
  top: 0; right: 0; bottom: 0; left: 0;
}

#app {
  background: transparent;
}

#mainContainer {
  padding: 24px;
    &.menuCollapsed {
        padding: 0px 24px 24px 24px;
    }

    transition: padding 0.5s;
}

.overlay {
  z-index: 2;
  pointer-events: none;

  #controls {
    z-index: 4;
  }

  .controls > * {
    pointer-events: auto;
  }
}

#mapContainer {
  z-index: 1;
  flex: 1;
  display: flex;
  overflow: hidden;
  z-index: 1;
  height: 100%;
  flex-wrap: wrap;

}


.content {
  z-index: 1;
}

#menu-container {
  align-self: flex-start;
  width: 247px;

}

.v-navigation-drawer {
    background: linear-gradient(145deg, rgba(255,255,255,0.7) 0%, rgba(255,255,255,0.3) 100%), url(assets/ricepaper_v3_@2X.png) repeat;
}

#legend-pane {
  padding: 8px;
  opacity: 0.85;

  background: rgba(0,0,0,0);

  font-size: 12px;
  font-weight: bold;
}

/*#legend-pane::after {
  content: "";
  background: url(assets/ricepaper_v3_@2X.png) repeat;
  opacity: 0.98;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  position: absolute;
  z-index: -1;   
}*/

#legend {

  width: 185px;
  height: 20px;



  /* Permalink - use to edit and share this gradient: http://colorzilla.com/gradient-editor/#4169e1+0,496fe1+33,767676+48,767676+52,bb2525+66,b22222+100 */
  /*background: rgb(65,105,225);
  background: -moz-linear-gradient(left, rgba(65,105,225,1) 0%, rgba(73,111,225,1) 33%, rgba(118,118,118,1) 48%, rgba(118,118,118,1) 52%, rgba(187,37,37,1) 66%, rgba(178,34,34,1) 100%);
  background: -webkit-linear-gradient(left, rgba(65,105,225,1) 0%,rgba(73,111,225,1) 33%,rgba(118,118,118,1) 48%,rgba(118,118,118,1) 52%,rgba(187,37,37,1) 66%,rgba(178,34,34,1) 100%);
  background: linear-gradient(to right, rgba(65,105,225,1) 0%,rgba(73,111,225,1) 33%,rgba(118,118,118,1) 48%,rgba(118,118,118,1) 52%,rgba(187,37,37,1) 66%,rgba(178,34,34,1) 100%); */

}

/*html, body, .app { height: 100%; margin: 0;}*/

/*body {
  display: flex;
  flex-flow: column wrap;
  background-color: grey;

}

.map {
  flex: 1;
  display: flex;
  overflow: hidden;
  z-index: 1;
  height: 100%;
}

.overlay {
  z-index: 2;
  position: absolute;
  top: 0; right: 0; bottom: 0; left: 0;
  pointer-events: none;


  > * {
    pointer-events: auto;
  }

  background-color: transparent;
}
*/
/*body {
  display: flex;
  flex-flow: column wrap;
  background-color: grey;

  --md-theme-default-background: rgba(0, 0, 0, 0);
}

.app, .map, .overlay {
  flex: 1;
  display: flex;
  overflow: hidden;
}

.map {
  z-index: 1;
}

.overlay {
  z-index: 2;
  position: absolute;
  top: 0; right: 0; bottom: 0; left: 0;
  pointer-events: none;

  align-items: flex-start;

  > * {
    pointer-events: auto;
  }
}

.menu-button {
  @include md-layout-small-and-up {
    display: none;
  }

  margin: 0.5rem;

  .md-icon-button {
    margin: 0;
  }
}

.controls {
  width: auto;

  h1, h2 {
    font-size: 1vw;
  }
}

.passage-pane {
  margin: 1rem;
  width: 33vw;
}*/
</style>