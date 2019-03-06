<template>
	<v-container fluid v-if="$store.getters.selectedPlace" class="wrap" id="drawer-content">
		
			<v-layout :fill-height="true" column>
				<div class="header">
					<div class="headline">{{selectedPlace["Place"]}}</div>
					 <p v-html="$options.filters.markdown(selectedPlace['Comments'])" ></p>				  
				</div>

				<v-divider></v-divider>
				<v-flex class="content">
					<v-tabs
					  v-model="activeTab"
					  color="transparent"
					>

					  <v-tab :key="0">Passage</v-tab>
					  <v-tab :key="1">Related Locations</v-tab>
					  
					  <v-tabs-items v-model="activeTab">
					  	  <v-tab-item :key="0">
					  	    <v-card color="transparent" class="elevation-0">
					  	    	<v-card-text>
					  	    		<div class="passage" v-for="passage in parsedPassages">
					  	    			<div class="passage-text morality" v-bind:class="passage.morality">
					  	    				{{ passage.text }}
					  	    			</div>
					  	    			<div class="reference">({{ passage.pos }})</div>
					  	    		  </div>	
					  	    	</v-card-text>
					  	    </v-card>
					  	  </v-tab-item>

					  	  <v-tab-item :key="1">
					  	  	<v-card color="transparent" class="elevation-0">
					  			<v-card-text>
					  				<div class="passage" v-for="place in relatedPlaces">
					  					<div><a v-bind:href="'#' + place['Place']">{{place["Place"] }}</a></div>
					  					<div v-html="$options.filters.markdown(selectedPlace['Comments'])"></div>
					  				</div>
					  			</v-card-text>
					  	  	</v-card>
					  	  </v-tab-item>
					  </v-tabs-items>
					  
					</v-tabs>
				</v-flex>

				<!-- <v-spacer></v-spacer> -->

				<div>
					<div class="footer transparent">
						<v-btn flat @click="$store.commit('setPassagePaneOpen', false)">Close</v-btn>
					</div>
				</div>
			</v-layout>
	</v-container>

</template>

<script>
import marked from 'marked';

import placeData from '../data/places.csv'
export default {
	name: "PassagePane",
	computed: {
		selectedPlace() { return this.$store.getters.selectedPlace },
		activeTab: {
			get() { return this.$store.getters.activeDetailTab === "tab-passages" ? 0 : 1},
			set(value) { this.$store.commit('setActiveDetailTab', value == 0 ? "tab-passages" : "tab-related") }
		},
		parsedPassages() {
			// https://blog.mastykarz.nl/regular-expressions-in-javascript-dont-support-the-single-line-mode/
			// https://regex101.com/r/zACvGs/1
			const regex = new RegExp("\\\"([\\s\\S]*?)\\\"\\s+\\((.*?)\\)\\s+\\[(.*?)\\];?", "g")
			let match = null
			const passages = []

			while ( (match = regex.exec(this.selectedPlace["Content"])) !== null) {
				passages.push({
					text: match[1],
					pos: match[2],
					morality: match[3]
				})		
			}

			return passages
		},
		relatedPlaces() {
			return placeData
					.filter(place => place["Related"] === this.selectedPlace["Related"] && place["Place"] !== this.selectedPlace["Place"])
		}
	},
	filters: {
		markdown: value => marked(value)
	}
}
</script>

<style lang='scss' scoped>

.wrap {
	height: 100%;
}

.tabs__items {
	overflow-y: auto;
	height: 100%;
}

.content {
	padding-bottom: 48px;
}

.footer {
	justify-content: flex-end;
}

.morality {
	border-left: solid 6px;
	padding-left: 0.5rem;

	&.positive {
	  border-color: #4169e1;
	}
	&.negative {
	  border-color: #b22222;
	}
	&.neutral {
		border-color: #555555;
	}
}

.passage {
	margin-bottom: 1em;
}

.reference {
	text-align: right;
	font-style: italic;
}


#drawer-content {
	background: linear-gradient(145deg, rgba(255,255,255,0.7) 0%, rgba(255,255,255,0.3) 100%), url(assets/ricepaper_v3_@2X.png) repeat;
}

.headline {
	padding-bottom: 16px;
	font-size: 1.8em;
}

.divider {
	flex: 0;
	margin-bottom: 16px;
}
/*

.body {
	display: flex;
	flex-direction: column;
}

.md-tabs-content {
	height: 100%;
}

.wrap {
	display:flex;
	flex-direction: column;
	justify-content: space-between;
	height: 100%;
}

.content {
	overflow-y: auto;
	overflow-x: hidden;
}

.passage {
	margin-bottom: 1em;
}

.reference {
	text-align: right;
	font-style: italic;
}



}

.passage-text {
	white-space: pre;
}*/
</style>