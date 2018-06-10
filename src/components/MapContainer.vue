<template>
	<div ref="container" id="container">
		<Map v-for="map in activeMaps" v-on:map-init="onMapInit" v-on:map-destroy="onMapDestroy" class="map" :n="map" :key="map"></Map>
	</div>
</template>

<script>
import Map from './Map.vue'
import { mapGetters } from 'vuex'

export default {
	name: "MapContainer",
	components: {Map},
	computed: {
		...mapGetters([
			'maps', 'activeMaps'
		])
	},
	methods: {
		onMapInit: function(newMap) {

			this.syncedMaps.forEach((syncedMap) => {
				syncedMap.sync(newMap)
				newMap.sync(syncedMap)
			})

			this.syncedMaps.push(newMap)
		},
		onMapDestroy: function(oldMap) {
			this.syncedMaps.forEach((syncedMap) => {
				if (syncedMap == oldMap) return

				oldMap.unsync(syncedMap)
				syncedMap.unsync(oldMap)
			})

			this.syncedMaps.splice(this.syncedMaps.indexOf(oldMap), 1)
		}
	},
	created() {
		this.syncedMaps = []
		window.maps = []
	},
	mounted() {

	  // this.$refs.map1.map.sync(this.$refs.map2.map)

	}
}
</script>

<style lang='scss' scoped>
	#container {
	 	height: 100%;
	 	display: flex;
	}

	.map {
	    flex: 1 0 50%;
	}
</style>