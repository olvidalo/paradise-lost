<template>
    <v-card>
        <v-card-title class="headline grey lighten-3" primary-title>ABOUT THIS PROJECT</v-card-title>
        <v-card-text style="height: 50vh;">
<!--            <ol class="toc">-->
<!--                <a href="#intro"><li>Introduction</li></a>-->
<!--                <a href="#context"><li>Context</li></a>-->
<!--                <a href="#layers"><li>Layers</li></a>-->
<!--                <a href="#team"><li>Team</li></a>-->
<!--                <a href="#credits"><li>Credits</li></a>-->
<!--            </ol>-->
            <div>
                <h2 id="intro">Introduction</h2>
                <p>
                    <em>A Map of Paradise Lost</em> is an exploratory map that offers a visual entry point into the complex and multitemporal terrestrial space of John Milton’s epic poem. The points on the map are the unambiguous place-name mentions found in the epic poem that have been geocoded manually for accuracy. Each point is accompanied by:
                </p>
                <ol style="margin-bottom: 16px">
                    <li>The comments that appear directly on the map, taken from editorial notes that explain the significance of the place</li>
                    <li>Accompanying passages that provide the context for every place name mention from Paradise Lost and a reference to each passage</li>
                    <li>Related locations that show what places are grouped together under the same categories by Milton</li>
                    <li>The moral connotation that Milton assigns to place names based on his political, poetic, or historical perception of them</li>
                    <li>Different marker types and color schemes to aid exploration</li>
                </ol>
            </div>
            <div>
                <h2 id="context">Context</h2>
                <p>
                    <em>A Map of Paradise Lost</em> situates John Milton’s <em>Paradise Lost</em> in its specific historical moment
                    — the seventeenth century — published in a map-oriented culture that was at the peak of the
                    development of a cartographic consciousness in Europe. Morgan Ng argues that there is a “tendency
                    among current literary scholars, despite enormous interest in the ‘cartographic imagination’ in
                    Renaissance writing, largely to ignore the texts’ actual visual counterparts. To explain the textual
                    form of <em>Paradise Lost</em> requires equally close attention to the images which permeated Milton’s
                    mimetic consciousness, even after the onset of his blindness.” (2013, 428). This project explores
                    the maps that inspired Milton’s spatial thinking when creating the terrestrial world of Paradise Lost.
                </p>
            </div>
            <div>
                <h2 id="layers">Layers</h2>
                <p><em>A Map of Paradise Lost</em> is the first project of its kind that grants visual access to the world of
                    “geographical continuity” that permeated Milton’s spatial consciousness. This worldview refers to the
                    prevalent notion of historical sequence of a seventeenth-century English audience, namely the conviction
                    that biblical events, like historical ones, progressed on a linear spectrum of geographical continuity,
                    meaning that the land that the Ottoman Empire occupied in the seventeenth century is the same land in which
                    biblical and classical accounts took place (Ng 2013, 433). The historical maps included in the project are
                    meant to evoke these worlds imagined by Milton, captured through georectification (matching points on a
                    map image with corresponding points on a map in a geo-coordinate system). To date, the two georectified
                    maps are: a map of biblical lands from the King James Bible (similar to that found in the paratext of
                    Milton’s own family bible, 1612/1613)  and John Speed’s (1626) map of “The Turkish Empire.”
                </p>
            </div>
            <div>
                <h2 id="team">Team</h2>
                <p>Randa El Khatib (University of Victoria) and Marcel Schaeben (University of Cologne) </p>
            </div>
            <div>
                <h2 id="credits">Credits</h2>
                <ul class="bib">
                    <li>Ng, Morgan. 2013. “Milton’s Maps.” <em>Word and Image</em> 29 (4): 428-42.</li>
                    <li>Milton, John. 2007. <em>The Complete Poetry and Essential Prose of John Milton</em>, edited by William Kerrigan, John Rumrich, and Stephen M. Fallon. New York: The Modern Library. </li>
                    <li>Speed, John. 1626. “In A Prospect of the Most Famous Parts of the World.” Maps & Imagery Library, Special and Area Studies Collections, George A. Smathers Libraries, University of Florida.</li>
                </ul>
            </div>
        </v-card-text>

        <v-divider></v-divider>
        <v-card-actions class="grey lighten-3">
            <v-spacer></v-spacer>
            <v-btn color="primary" flat @click="dialog = false">
                Close
            </v-btn>
        </v-card-actions>
    </v-card>
</template>

<script>
    export default {
        name: "AboutDialog"
    }
</script>

<style scoped>
    .toc {
        padding: 16px;
    }

    .bib {
        padding-left: 0;
        list-style: none;
    }

    .bib li {
        padding-bottom: 0.5em;
    }
</style>