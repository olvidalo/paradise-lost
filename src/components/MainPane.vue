<template>

	<div class="outer-wrap">
		<div class="inner-wrap" v-bind:class="{collapsed: menuCollapsed}">
			<div class="title" v-bind:class="{collapsed: menuCollapsed}">
				<div class="line-1">
					<div class="heading-line"/>
					<div class="line-1-content">
						<span class="heading-of">A map of</span>
					</div>
					<div class="heading-line"/>
					<span class="expanded-title">Paradise Lost</span>
				</div>
				<div class="line-3">Paradise Lost</div>
			</div>

			<v-expand-transition>
				<div class="expanded-content" v-show="!menuCollapsed">
					<div class="teaser">
						This is a map of the locatable terrestrial places in John Milton's Paradise Lost.

						<v-dialog v-model="aboutDialog" width="50vw" scrollable>
							<template v-slot:activator="{ on }">
								<span class="about-btn"><a href="#" v-on="on">About this project</a></span>
							</template>

							<about-dialog @close="aboutDialog = false"></about-dialog>
						</v-dialog>



					</div>




					<!-- <v-divider></v-divider> -->

					<div class="menu-controls">
						<v-btn-toggle v-model="selectedMap" mandatory class="map-toggles">

							<!-- map selector buttons -->
							<v-tooltip top v-for="(map, index) in activeMaps">
								<template v-slot:activator="{ on }">
									<v-btn v-on="on" @click="selectMap($event, map)" flat :value="map" class="map-toggle">{{index + 1}}</v-btn>
								</template>
								<span>Configure map {{index + 1}}</span>
							</v-tooltip>
						</v-btn-toggle>

						<!-- add button -->
						<v-tooltip top>
							<template v-slot:activator="{ on }">
								<v-btn class="map-toggle add" v-on="on" @click="addMap()" v-if="activeMaps.length < 4">+</v-btn>
							</template>
							<span>Add a map</span>
						</v-tooltip>

					</div>
					<div class="menu-list">
						<v-list  dense id="menu">
							<v-list-group no-action>
								<v-list-tile slot="activator">
									<v-list-tile-content><v-list-tile-title>Base maps</v-list-tile-title></v-list-tile-content>
								</v-list-tile>
								<v-list-tile avatar ripple v-bind:class="{ selected: $store.getters.baseLayer.id == baseLayer.id }" v-for="(baseLayer, index) in mapConfig.baseLayers" @click="$store.commit('setBaseLayer', baseLayer)">
									<v-list-tile-content><v-list-tile-title>{{ baseLayer.name }}</v-list-tile-title></v-list-tile-content>
									<v-list-tile-action><md-icon class="check">✓</md-icon></v-list-tile-action>
								</v-list-tile>
							</v-list-group>
							<v-list-group no-action>
								<v-list-tile slot="activator">
									<v-list-tile-content><v-list-tile-title>Rectified maps</v-list-tile-title></v-list-tile-content>
								</v-list-tile>

								<v-list-tile avatar ripple v-bind:class="{ selected: overlayMap && map.id == overlayMap.id }" v-for="map in mapConfig.overlayMaps"  @click="$store.commit('setOverlayMap', map)">
									<v-list-tile-content><v-list-tile-title>{{ map.name }}</v-list-tile-title></v-list-tile-content>
									<v-list-tile-action><md-icon class="check">✓</md-icon></v-list-tile-action>
								</v-list-tile>

								<v-list-tile avatar ripple v-bind:class="{ selected: !overlayMap }"  @click="$store.commit('setOverlayMap', null)">
									<v-list-tile-content><v-list-tile-title>None</v-list-tile-title></v-list-tile-content>
									<v-list-tile-action><md-icon class="check">✓</md-icon></v-list-tile-action>
								</v-list-tile>

								<v-list-tile>
									<v-slider v-model="overlayMapOpacity" min="0" max="1" step="0.01"> {{ Math.round(overlayMapOpacity * 100) }}%</v-slider>
								</v-list-tile>
							</v-list-group>

							<v-list-group>
								<v-list-tile slot="activator">
									<v-list-tile-content><v-list-tile-title>Markers</v-list-tile-title></v-list-tile-content>
								</v-list-tile>

								<v-list-tile>
									<v-list-tile-content>
										<v-list-tile-title>Paradise Lost</v-list-tile-title>
									</v-list-tile-content>
									<v-list-tile-action><v-switch v-model="showParadiseLost"></v-switch></v-list-tile-action>
								</v-list-tile>
								<v-list-tile>
									<v-list-tile-content>
										<v-list-tile-title>Genesis</v-list-tile-title>
									</v-list-tile-content>
									<v-list-tile-action><v-switch v-model="showGenesis"></v-switch></v-list-tile-action>
								</v-list-tile>
								<v-list-tile>
									<v-list-tile-content>
										<v-list-tile-title>OpenBible</v-list-tile-title>
									</v-list-tile-content>
									<v-list-tile-action><v-switch v-model="showBible"></v-switch></v-list-tile-action>
								</v-list-tile>

							</v-list-group>

							<v-list-group>
								<v-list-tile slot="activator">
									<v-list-tile-content><v-list-tile-title>Marker types</v-list-tile-title></v-list-tile-content>
								</v-list-tile>

								<v-list-tile avatar ripple v-bind:class="{ selected: markerType == 'pie' }" @click="markerType = 'pie'">
									<v-list-tile-content><v-list-tile-title>Pie charts</v-list-tile-title></v-list-tile-content>
									<v-list-tile-action><md-icon class="check">✓</md-icon></v-list-tile-action>
								</v-list-tile>

								<v-list-tile avatar ripple v-bind:class="{ selected: markerType == 'pin' }" @click="markerType = 'pin'">
									<v-list-tile-content><v-list-tile-title>Pins</v-list-tile-title></v-list-tile-content>
									<v-list-tile-action><md-icon class="check">✓</md-icon></v-list-tile-action>
								</v-list-tile>

								<v-list-tile avatar ripple v-bind:class="{ selected: markerType == 'circle' }" @click="markerType = 'circle'">
									<v-list-tile-content><v-list-tile-title>Circles</v-list-tile-title></v-list-tile-content>
									<v-list-tile-action><md-icon class="check">✓</md-icon></v-list-tile-action>
								</v-list-tile>

								<v-list-tile avatar ripple>
									<v-list-tile-content>
										Color scheme
									</v-list-tile-content>
									<v-list-tile-action>
										<v-btn-toggle class="scheme-toggle" v-model="colorSchemeIndex" mandatory>
											<v-btn flat :value="0">
												1
											</v-btn>
											<v-btn flat :value="1">
												2
											</v-btn>
											<v-btn flat :value="2">
												3
											</v-btn>
										</v-btn-toggle>
									</v-list-tile-action>
								</v-list-tile>
								<v-list-tile avatar ripple>

								</v-list-tile>
							</v-list-group>


						</v-list>
					</div>
				</div>
			</v-expand-transition>


		</div>

		<v-tooltip bottom>
			<template v-slot:activator="{ on }">
				<v-btn depressed class="expand-btn"color="transparent" v-on="on" @click="menuCollapsed = !menuCollapsed" v-bind:class="{collapsed: menuCollapsed}">
					<div class="expand-btn-icon">▲</div>
				</v-btn>
			</template>
			<span>{{menuCollapsed ? 'expand' : 'collapse'}}</span>
		</v-tooltip>
	</div>
</template>

<script>

import mapConfig from '../../map-config.json'
import { mapGetters, mapMutations, mapActions } from 'vuex'
import AboutDialog from "./AboutDialog.vue";

export default {
	name: "MainPane",
	components: {AboutDialog},
	data: () => ({
	  aboutDialog: false
	}),
	computed: {
		mapConfig() { return mapConfig },
		menuCollapsed: {
			get() { return this.$store.getters.menuCollapsed },
			set(value) { this.$store.commit('setMenuCollapsed', value) }
		},
		overlayMapOpacity: {
		  get() { return this.$store.getters.overlayMapOpacity },
		  set(value) { this.$store.commit('setOverlayMapOpacity', value) }
		},
		showGenesis: {
		  get() { return this.$store.getters.showGenesis },
		  set(value) { this.$store.commit('setShowGenesis', value) }
		},
		showBible: {
		  get() { return this.$store.getters.showBible },
		  set(value) { this.$store.commit('setShowBible', value) }
		},
		showParadiseLost: {
		  get() { return this.$store.getters.showParadiseLost },
		  set(value) { this.$store.commit('setShowParadiseLost', value) }
		},
		markerType: {
			get() { return this.$store.getters.markerType },
			set(value) { this.$store.commit('setMarkerType', value) }
		},
		selectedMap: {
			get() { return this.$store.state.selectedMap },
			set(value)  {}
		},
		colorSchemeIndex: {
			get() { return this.$store.getters.colorSchemeIndex },
			set(value) { this.$store.commit('setColorSchemeIndex', value) }
		},
		...mapGetters([
			'maps', 'activeMaps', 'overlayMap'
		]),
		...mapMutations([
			'setSelectedMap'
		])
	},
	methods: {
		...mapActions([
			'addMap', 'removeMap'
		]),
		selectMap(event, map) { 
			console.log(event.target.value)
			this.$store.commit('setSelectedMap', map)
		}
	}
}
</script>

<style lang='scss' scoped>

/* Enter and leave animations can use different */
/* durations and timing functions.              */
.slide-fade-enter-active {
  transition: all .3s ease;
}
.slide-fade-leave-active {
  transition: all .8s cubic-bezier(1.0, 0.5, 0.8, 1.0);
}
.slide-fade-enter, .slide-fade-leave-to
/* .slide-fade-leave-active below version 2.1.8 */ {
  transform: translateX(10px);
  opacity: 0;
}

.outer-wrap {
	background: url(assets/paper_fibers_@2X.png) repeat;
}
.inner-wrap {
	padding: 16px;
	&.collapsed {
		padding: 8px 8px 0 8px;
	}
}

.teaser {
	font-family: "Playfair Display", "Lato", sans-serif;
	margin-bottom: 1rem;
}

.title.collapsed {
	/*flex-direction: row;*/

	padding: 0;

	.line-1 {
		white-space: nowrap;
		transition: font-size 0.5s;
	}

	.line-3 {
		opacity: 0;
		height: 0;
		font-size: 0;
	}

	/*.heading-of {*/
	/*	padding: 0 0.25rem 0 0;*/
	/*}*/

	.heading-line {
		flex: 0;
		opacity: 0;
	}

	.expanded-title {
		transition: 0.5s;
		flex: 1;
		opacity: 1;
	}

}

.title {
  display: flex;
  align-items: center;
	justify-items: stretch;
  flex-direction: column;

  font-family: "Playfair Display", "Lato", sans-serif;
  font-weight: bold;
  text-transform: uppercase;

  color: #993333;

  padding-bottom: 1rem;


	.heading-line {
		flex: 1;
		background-color: #993333;
		height: 5px;

		transition: 0.5s;
	}

	.heading-of {
		padding: 0 5px 0 5px;
	}

	.expanded-title {
		width: 0;
		overflow: hidden;
		white-space: nowrap;
		opacity: 0;
	}

	.line-1, .line-3 {
	}

  .line-1 {
    font-size: 16.8px;
    line-height: 15px;
	  display: flex;
	  flex-direction: row;
	  width: 100%;
	  align-items: center;

	  .line-1-content {
		  flex-direction: row;
		  align-items: flex-start;
	  }
  }

  .line-2 {
    display: flex;
    flex-direction: row;
    width: 100%;
    line-height: 12px;
    font-size: 12px;
    align-items: center;
  }

  .line-3 {
    font-size: 27.2px;
	  transition: 0.5s;
	  height: 1em;
	  white-space: nowrap;
  }
}

.about-btn {
	padding-left: 0.5rem;
}

.expand-btn {
	margin: 0;
	width: 100%;
	height: auto;
	text-transform: none;

	font-size: 10px;
	color: darkgray;

}

.collapsed .expand-btn-icon {
	transform: rotate(180deg);
}

[class^="list__group__items"] .list__tile {
	padding-left: 24px !important;
}

#menu a {
	color: black;
	text-decoration: none;
}

.selected .list__tile {
	font-weight: bold;
}

.check {
	display: none;
}

.selected .check {
	display: inline-flex;
}

.tabs__bar {
	width: 80%;
}

.menu-controls {
	position: relative;

	display: flex;
	align-items: center;
}

.menu-list {
	border: 1px solid lightgray;
	margin-top: -14px;
	padding-top: 16px
}

.map-toggles {
	margin-left: 1rem;

	.btn--active {
		font-weight: bold;
	}
}

.map-toggle, .scheme-toggle > * {
	width: 25px;
	height: 25px;

	min-width: 25px !important;

	&.add {
		margin-left: 0;
	}
}


#main-collapse {
	margin: 0 0 -16px 0;
	width: 100%;
	padding: 0;

	button {
		min-width: inherit;
		text-transform: none;
		margin: 0;
	}

	.btn__content {
		padding: 0;
	}
}

</style>
