<template>
  <div class="map-wrap">
    <div class="close-btn" v-if="n > 1">
      <v-tooltip left>
        <v-btn icon slot="activator" class="close" @click="$store.dispatch('removeMap', n)">
          X
        </v-btn>
        <span>close map {{n}}</span>
      </v-tooltip>
    </div>
    <div ref="map" :id="`leaflet-${n}`">
    </div>
  </div>
</template>

<script>
import L from 'leaflet'
import 'leaflet-providers'
import 'leaflet.markercluster'
import 'Leaflet.vector-markers'
import 'Leaflet.sync'

import MapPopup from './MapPopup.vue'
import Vue from 'Vue'

import dataGenesis from '../data-preprocessed/MappableGenesis_2018.csv'
import dataBible from '../data-preprocessed/bible.csv'
import placeData from '../data-preprocessed/places.csv'

import * as d3 from 'd3'
import { arc, pie } from 'd3-shape'

import marked from 'marked';

export default {
  components: { MapPopup },
  props: {
    n: { type: Number, required: true }
  },
  computed: {
    baseLayer() { return this.$store.getters.mapConfigs[this.n].baseLayer },
    overlayMap() { return this.$store.getters.mapConfigs[this.n].overlayMap },
    overlayMapOpacity() { return this.$store.getters.mapConfigs[this.n].overlayMapOpacity },
    showGenesis() { return this.$store.getters.mapConfigs[this.n].showGenesis },
    showBible() { return this.$store.getters.mapConfigs[this.n].showBible },
    showParadiseLost() { return this.$store.getters.mapConfigs[this.n].showParadiseLost },

    colorScheme() { return this.$store.getters.colorScheme },

    selectedPlace() { return this.$store.getters.selectedPlace },
    markerType() { return this.$store.getters.mapConfigs[this.n].markerType },
    mapZoom() { return this.$store.getters.mapZoom },
    mapCenter() { return this.$store.getters.mapCenter },
    mapViewChanging() { return this.$store.getters.mapViewChanging }
  },
  watch: {
    mapZoom: {
      handler(newMapZoomInfo) {
        if (this.mapViewChanging != null && newMapZoomInfo.source != this.n) {
          //this.map.setZoom(newMapZoomInfo.zoom)
        }
      }
    },
    mapCenter: {
      handler(newMapCenterInfo) {
        console.log(newMapCenterInfo.source + " " + this.n)
        if (newMapCenterInfo.source != this.n) {
         
          this.map.flyTo(newMapCenterInfo.center)

        }
      }
    },
    mapViewChanging: {
      handler(newMapN) {
        if (newMapN == null) {
          this.map.on('movestart', this.moveStartHandler)
          this.map.on('moveend', this.moveEndHandler)
          this.map.on('move', this.moveHandler)
        } 
        if (newMapN != this.n) {
          console.log("off")
          this.map.off('movestart', this.moveStartHandler)
          this.map.off('moveend', this.moveEndHandler)
          this.map.off('move', this.moveHandler)
        } 
      }
    },
    baseLayer: {
      deep: true,
      immediate: true,
      handler(newBaseLayer) {
        if (!newBaseLayer || !this.map) return
        this.setBaseLayer(newBaseLayer.id, newBaseLayer.params)
      }
    },
    overlayMap: {
      immediate: true,
      handler(newOverlayMap) {
        if (!this.map) return
        this.setOverlayMap(newOverlayMap)
      }
    },
    markerType: {
      handler(newType) {
        this.paradiseLostMarkers && this.map.removeLayer(this.paradiseLostMarkers)
        this.paradiseLostMarkers = null
        this.toggleParadiseLostMarkers(this.showParadiseLost)
      }
    },
    overlayMapOpacity: {
      handler(newOpacity) {
        this.currentOverlayMap && this.currentOverlayMap.setOpacity(newOpacity)
      }
    },
    showGenesis: {
      handler(showGenesis) {
        this.toggleGenesisMarkers(showGenesis)
      }
    },
    showBible: {
      handler(showBible) {
        this.toggleBibleMarkers(showBible)
      }
    },
    showParadiseLost: {
      handler(showParadiseLost) {
        this.toggleParadiseLostMarkers(showParadiseLost)
      }
    },
    colorScheme: {
      handler(colorScheme) {
        this.toggleParadiseLostMarkers(false)
        this.toggleBibleMarkers(false)
        this.toggleGenesisMarkers(false)

        this.toggleBibleMarkers(this.showBible)
        this.toggleGenesisMarkers(this.showGenesis)
        this.toggleParadiseLostMarkers(this.showParadiseLost)
      }
    },
    selectedPlace: {
      handler(place) {

        console.log("selectedPlace")
        console.log(place)

        if (!this.hasMarkers()) return

        if (place) {
          this.resetRelated()
          this.selectPlaceOnMap(place)
        } else {
          this.unselectMarker()
        }
      }
    }
  },
  created() {

    // this.syncWith(otherMap) {
    //   this.syncedWith = otherMap
    //   this.map.sync(otherMap)
    //   otherMap.sync(this.map)
    // }

    this.hasMarkers = function () {
      return this.paradiseLostMarkers || this.genesisMarkers || this.bibleMarkers
    }

    this.resetRelated = function () {
      this.paradiseLostMarkers && this.paradiseLostMarkers.eachLayer((marker) => marker._icon.classList.remove("related", "unrelated"))
    }

    this.unselectMarker = function () {
      this.map.closePopup()
      this.selectedMarker.unbindPopup()
      this.resetRelated()
      this.selectedMarker = null
    }

    this.selectPlaceOnMap = function(place) {
      console.log("select")
      console.log(place)
      if (!this.paradiseLostMarkers) return
      this.selectedMarker = this.paradiseLostMarkers.getLayers().find((layer) =>  layer.options.title === place["Place"])
      if (!this.selectedMarker) return
      this.selectedMarker.bindPopup(this.makePopup(place))
      this.selectedMarker.openPopup()

      if (place["Related"]) {
        this.paradiseLostMarkers.eachLayer((marker) => {
          if (marker.options.place["Related"] === place["Related"]) {
            marker._icon.classList.add("related")
          } else {
            marker._icon.classList.add("unrelated")
          }
        })
      }
    }

    this.setBaseLayer = function(id, params) {
      params = params || {}
      this.currentBaseLayer && this.map.removeLayer(this.currentBaseLayer)
      this.currentBaseLayer = L.tileLayer.provider(id, params).addTo(this.map).bringToBack()
    }

    this.setOverlayMap = function(overlayMap) {
      this.currentOverlayMap && this.map.removeLayer(this.currentOverlayMap)
      if (overlayMap) {
        this.currentOverlayMap = L.tileLayer(overlayMap.url, {
          maxZoom: 19,
          className: 'tile-layer'
        }).addTo(this.map).setOpacity(this.overlayMapOpacity).bringToFront()

        // this.map.flyToBounds(overlayMap.bounds)
      }
    }

    this.getMoralityProportions = function(markers) {
      const good = markers.reduce((sum, marker) =>  marker.options.morality === "good" ? sum + marker.options.weight : sum, 1)
      const bad = markers.reduce((sum, marker) =>  marker.options.morality === "bad" ? sum + marker.options.weight : sum, 1)
      const neutral = markers.reduce((sum, marker) =>  marker.options.morality === "neutral" ? sum + marker.options.weight : sum, 1)

      const max_weight = markers.reduce((max, marker) => Math.max(max, marker.options.weight), 0)
      const cumulated_weight = markers.reduce((weight, marker) => weight + marker.options.weight, 0)

      const total = good + bad + neutral
      return {
        good: good/total,
        bad: bad/total,
        neutral: neutral/total
      }
    }

    this.getIconSize = (length) => 30 + length

    // https://css-tricks.com/creating-vue-js-component-instances-programmatically/
    this.makePopup = (place) => {
      const PopupComp = Vue.extend(MapPopup)
      const popup = new PopupComp({})
      popup.name = place["Place"]
      popup.comments = place["Comments"]
      popup.$store = this.$store
      popup.$on('opendetail', () => this.$store.dispatch('showPassages'))
      popup.$on('openrelated', () => this.$store.dispatch('showRelated'))
      popup.$mount()
      return popup.$el
    }

    this.makeSVGIconOptions = (width, height, svgContent, options) => ({
      iconSize: [ width, height ],
      className: 'vector-marker',
      html:`
        <div style="position: relative;">
          <svg width="${width}px" height="${height}px" viewbox="0 0 ${width} ${height}">
              ${svgContent}
          </svg>
        </div>
      `,
      ...options
    })

    this.makeSVGCircle = (radius, strokeWidth, opacity, fillColor) => `
      <circle cx="${radius}" cy="${radius}" r="${radius - strokeWidth}" stroke="black" stroke-width="${strokeWidth}" style="opacity: ${opacity}" fill="${fillColor}" />
    `

   this.toggleParadiseLostMarkers = (show) => {
      if (show == false && this.paradiseLostMarkers) {
        this.map.removeLayer(this.paradiseLostMarkers)
        this.paradiseLostMarkers = null
      } else if (show == true) {

        this.paradiseLostMarkers = L.featureGroup()


        const addPlaceMarkers = (data) => {

          data.forEach(place =>  {
            const m = {}
            m[place["Postive"]] = "good"
            m[place["Negative"]] = "bad"
            m[place["Neutral"]] = "neutral"

            const max = Object.keys(m).reduce((max, key) => {return `${Math.max(max, key)}`}, 0)


            const colorScheme = this.colorScheme
            const scaleForWeight = (size, weight) => size + parseInt(weight) * 3

            const markerOptions = {
              opacity: 0.8,
              weight: parseInt(place["Weight"]),
              title: place["Place"],
              place: place
            }

            const latLng = [place["Latitude"], place["Longitude"]]

            const makeSVGIconOptions = this.makeSVGIconOptions
            const makeSVGCircle = this.makeSVGCircle

            const markerGenerators = {
              "pie": function() {
                const good = parseInt(place["Postive"])
                const bad = parseInt(place["Negative"])
                const neutral = parseInt(place["Neutral"])

                const weight = good + bad + neutral


                const w = scaleForWeight(27, weight)
                const h = w

                const piedata = [good, bad, neutral]

                const border = 2

                const color = d3.scaleOrdinal()
                .range([colorScheme["good"], colorScheme["bad"], colorScheme["neutral"]]);

                const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')

                 const svg2 = d3.select(svg)
                              .attr('width', w + border)
                              .attr('height', h + border)
                              .append('g')
                              .attr('transform', `translate(${(w + border) / 2},${(h + border) / 2} )`)

                const theArc = arc()
                                .innerRadius(w / 2)
                                .outerRadius(0)

                const thePie = pie()
                              .value((d) => {console.log(d); return d})
                              .sort(null)

                const path = svg2.selectAll('path')
                              .data(thePie(piedata))
                              .enter()
                              .append('path')
                              .attr('d', theArc)
                              .attr('fill', (d, i) => color(i))
                        .attr('stroke', () => 'gray')
                        .attr('stroke-width', (d, i) => {
                          console.log(d)
                          return isNaN(d.data) || d.data == 0 ? 0 : border
                        })

                const iconOptions = {
                  iconSize: [ w + border, h + border],
                  className: 'vector-marker',
                  extraIconClasses: 'pie-marker-icon',
                  extraDivClasses: 'pie-marker',
                  html: `
                  <div style="position: relative;">
                    <div style="position: absolute; width: ${w + border}px; height: ${h + border}px; top: 0; left: 0;">
                        ${(new window.XMLSerializer()).serializeToString(svg)}
                    </div>
                  </div>`
                }

                //
                
                return L.marker(latLng, {...markerOptions, icon: L.divIcon(iconOptions)})
              },
              "pin": function() {

                const good = parseInt(place["Postive"])
                const bad = parseInt(place["Negative"])
                const neutral = parseInt(place["Neutral"])

                const weight = good + bad + neutral



                const w = scaleForWeight(40, weight)
                const h = w

                const piedata = [good / weight, bad / weight, neutral / weight]

                const iconOptions = {
                  iconSize: [ w, h ],
                  iconAnchor: [ 15, 50 ],
                  popupAnchor: [ 2, -40 ],
                  shadowAnchor: [ 39, 45 ],
                  shadowSize: [ w + 4, h + 4 ],
                  className: 'vector-marker',
                  prefix: 'fa',
                  spinClass: 'fa-spin',
                  extraIconClasses: '',
                  extraDivClasses: '',
                  icon: 'home',
                  markerColor: 'blue',
                  iconColor: 'white',
                  viewBox: `0 0 ${w} ${h}`,
                  html: `
                  <div style="position: relative;"><svg width="${w}px" height="${h}px" viewbox="0 0 50 50">
                  <path style="fill: white;}; opacity: 1;" d="M16,1c-8.285,0,-15,6.656,-15,14.865c0,8.211,15,35.135,15,35.135c0,0,15,-26.924,15,-35.135c0,-8.209,-6.718,-14.865,-15,-14.865l0,0z" />
                    <path style="fill: ${colorScheme['good']}; opacity: ${piedata[0]};" d="M16,1c-8.285,0,-15,6.656,-15,14.865c0,8.211,15,35.135,15,35.135c0,0,15,-26.924,15,-35.135c0,-8.209,-6.718,-14.865,-15,-14.865l0,0z" />
                    <path style="fill: ${colorScheme['bad']}; opacity: ${piedata[1]};" d="M16,1c-8.285,0,-15,6.656,-15,14.865c0,8.211,15,35.135,15,35.135c0,0,15,-26.924,15,-35.135c0,-8.209,-6.718,-14.865,-15,-14.865l0,0z" />
                    <path style="fill: ${colorScheme['neutral']}; opacity: ${piedata[2]};" d="M16,1c-8.285,0,-15,6.656,-15,14.865c0,8.211,15,35.135,15,35.135c0,0,15,-26.924,15,-35.135c0,-8.209,-6.718,-14.865,-15,-14.865l0,0z" />
                    
                  </svg></div>`
                }

                return L.marker(latLng, {...markerOptions, icon: L.divIcon(iconOptions)})
              },
              "circle": function() {
                const good = parseInt(place["Postive"])
                const bad = parseInt(place["Negative"])
                const neutral = parseInt(place["Neutral"])

                const weight = good + bad + neutral



                const radiusBase = scaleForWeight(40, weight)
                const radius = isNaN(radiusBase) ? 0 : radiusBase / 4
                const piedata = [good / weight, bad / weight, neutral / weight]

                const strokeWidth = 2

                const iconSVGContent = `
                  ${makeSVGCircle(radius, strokeWidth, piedata[0], colorScheme['good'])}
                  ${makeSVGCircle(radius, strokeWidth, piedata[1], colorScheme['bad'])}
                  ${makeSVGCircle(radius, strokeWidth, piedata[2], colorScheme['neutral'])}
                `

                const iconOptions = makeSVGIconOptions(radius * 2, radius * 2, iconSVGContent, {})

                return L.marker(latLng, {...markerOptions, icon: L.divIcon(iconOptions)})
              }
            }


          

            markerGenerators[this.markerType]()
              .bindTooltip(place["Place"])
              //.on('popupopen', () => this.$store.commit('setSelectedPlace', {place: place, router: this.$router}))
              .on('click', () => this.$router.push({hash: place["Place"]}))
              .on('mouseover', (e) => e.target.setZIndexOffset(1000) )
              .on('mouseout', (e) => e.target.setZIndexOffset(0) )
              //.on('popupclose', () => this.$store.dispatch('unselectPlace', this.$router))
              //.on('popupclose', () => this.$router.push({hash: ""}))
              .addTo(this.paradiseLostMarkers)
          })
        }


        addPlaceMarkers(placeData)


        this.map
          .addLayer(this.paradiseLostMarkers)
      }
    }

    this.toggleGenesisMarkers = (show) => {
      if (show == false && this.genesisMarkers) {
        this.map.removeLayer(this.genesisMarkers)
        this.genesisMarkers = null
      } else if (show == true) {
        

        this.genesisMarkers = L.featureGroup()

        dataGenesis.forEach((place) => {

          const radius = 8

          const iconSVG = this.makeSVGCircle(radius, 2, 0.9, this.colorScheme["genesis"])
          const iconOptions = this.makeSVGIconOptions(radius * 2, radius * 2, iconSVG, {})

          L.marker([place["Latitude"], place["Longitude"]], {
            title: place["Place"],
            opacity: 0.85,
            morality: "genesis",
            weight: 1,
            icon: L.divIcon(iconOptions),
            place: place
          })
          .bindTooltip(place["Place"])
          //.bindPopup((marker) => this.makePopup(marker, place) )
          //.on('click', () => this.$store.commit('setSelectedPlace', place))
          .addTo(this.genesisMarkers)
        })

        this.genesisMarkers.addTo(this.map)
      }
    }

    this.toggleBibleMarkers = (show) => {
      if (show == false && this.bibleMarkers) {
        this.map.removeLayer(this.bibleMarkers)
        this.bibleMarkers = null
      } else if (show == true) {
        

        this.bibleMarkers = L.featureGroup()

        dataBible.forEach((place) => {
          const radius = 8


          const iconSVG = this.makeSVGCircle(radius, 2, 0.9, this.colorScheme["bible"])
          const iconOptions = this.makeSVGIconOptions(radius * 2, radius * 2, iconSVG, {})


          L.marker([place["Latitude"], place["Longitude"]], {
            title: place["Place"],
            opacity: 0.85,
            morality: "bible",
            weight: 1,
            icon: L.divIcon(iconOptions),
            place: place
          })
          .bindTooltip(place["Place"])
         // .bindPopup((marker) => this.makePopup(marker, place) )
          //.on('click', () => this.$store.commit('setSelectedPlace', place))
          .addTo(this.bibleMarkers)
        })

        this.bibleMarkers.addTo(this.map)
      }
    }

    this.moveStartHandler = (event) => {console.log("movestart: " + this.n); this.$store.commit('mapViewChanging', this.n); }
    this.moveEndHandler = () => {console.log("moveend: " + this.n); this.$store.commit('mapViewChanging', null) }
    this.moveHandler = (event) => {
        if (this.mapViewChanging == this.n) {
          this.$store.dispatch('setMapView', {
                  center: event.target.getCenter(),
                  zoom: event.target.getZoom(),
                  source: this.n
                })
        }
      }
  },
  mounted() {
    setTimeout(() => {
        console.log(`crreateing leaflet-${this.n}`)
        this.map = L.map(`leaflet-${this.n}`, {zoomControl: false, maxZoom: 18})
            .on('click', () => this.$router.push({hash: ""}))
            .on('load', (event) => this.$emit('map-init', event.target))
            .setView([32.738, 36.560], 4)
        // .on('movestart', this.moveStartHandler)
        // .on('moveend', this.moveEndHandler)
        // .on('move', this.moveHandler)

        L.control.zoom({position: 'bottomleft'}).addTo(this.map)
        this.setBaseLayer(this.baseLayer.id, this.baseLayer.params)
        this.overlayMap && this.setOverlayMap(this.overlayMap)
        this.toggleGenesisMarkers(this.showGenesis)
        this.toggleBibleMarkers(this.showBible)
        this.toggleParadiseLostMarkers(this.showParadiseLost)

        console.log(this.hasMarkers())

        if (this.selectedPlace && this.hasMarkers()) {
            this.selectPlaceOnMap(this.selectedPlace)
        }
    })

  },
  beforeDestroy() {
    console.log(`destryoing leaflet-${this.n}`)
    this.$emit("map-destroy", this.map)
  },
  destroy() {
    this.map.remove()
  }
};
</script>

<style lang='scss'>

  .map-wrap {
    position: relative;
  }

  .close-btn {
    position: absolute;

    right: 16px;
    top: 16px;

    z-index: 10000;
  }

  [id^=leaflet] {
     width: 100%;
    height: 100%;

    
  }

  [id^=overlay] {
    content: '';
    position: absolute;
    top: 0; bottom: 0; left: 0; right: 0;

    background-color: green;
    opacity: 0.3;
    z-index: 10000;
  }

  .leaflet-popup-content-wrapper {
    font: inherit;
    background: url(assets/paper_fibers_@2X.png) repeat;
  }

  .circ {
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 15px;
    font-weight: bold;
    color: white;
  }

  .leaflet-div-icon {
    border: none;
    background-color: transparent;
  }

  .vector-marker {
    transition: transform 1s ease-out;
  }

  .vector-marker svg {
    transition: opacity 0.7s ease-out, transform 0.7s ease-out;
  }

  .vector-marker path {
    // stroke: none;
  }

  .related svg {
    transform: scale(1.5);

  }

  .unrelated svg {
    transform: scale(0.75);
    opacity: 0.55;
  }

</style>