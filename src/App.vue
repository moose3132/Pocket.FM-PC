<template>
  <div id="app">
    <!-- Fixed Search Bar -->
    <div class="search-bar">
      <VaNavbarItem class="clock-item text-center">
        <span class="clock">{{ currentTime }}</span>
      </VaNavbarItem>
      <input
        type="text"
        v-model="searchQuery"
        @input="onSearch"
        placeholder="Search for radio stations..."
        class="search-input"
      />
    </div>

    <div class="divider-top"></div>

    <!-- Radio Station List -->
    <VaList>
      <VaListItem
        v-for="(station, index) in filteredStations"
        :key="station._id"
        class="list__item"
        @click="selectStation(station)"
        :class="{'selected': selectedStationStream === station.stream}"
      >
        <VaListItemSection avatar>
          <!-- Optional: Add a station logo or image -->
          <img v-if="station.image" :src="station.image" alt="Station Logo" class="station-logo" />
        </VaListItemSection>

        <VaListItemSection>
          <VaListItemLabel>{{ station.title }}</VaListItemLabel>
          <VaListItemLabel caption>{{ station.subtitle }}</VaListItemLabel>
        </VaListItemSection>
      </VaListItem>

      <div v-if="isLoading" class="loading-message"><VaSkeleton /></div>
      <div v-if="error" class="error">{{ error }}</div>
    </VaList>

    <div class="divider-bottom"></div>

    <!-- Bottom Player Section -->
    <VaNavbar fixed bottom class="shadow-lg">
      <template #center>
        <div class="player-container">
          <!-- Station Name Above the Player -->
          <div v-if="selectedStationStream" class="station-name">
            <img src="@/assets/equalizer.gif" width="8%">&nbsp; Now Playing: {{ selectedStationTitle }}
          </div>

          <!-- Audio Player (auto plays once a station is selected) -->
          <audio v-if="selectedStationStream" ref="audioPlayer" controls autoplay>
            <source :src="selectedStationStream" type="audio/mp3" />
            Your browser does not support the audio element.
          </audio>
        </div>
      </template>
    </VaNavbar>
  </div>
</template>

<script>
export default {
  name: 'App',
  data() {
    return {
      stations: [],  // List of stations fetched from the GitHub JSON file
      selectedStationStream: '',  // Stream URL of the selected station
      selectedStationTitle: '',  // Title of the selected station
      isLoading: false,  // Loading state for fetching stations
      error: null,  // Error state for fetching stations
      currentTime: '',  // Store the current time
      searchQuery: '',  // The search query
    };
  },
  computed: {
    // Filter stations based on the search query
    filteredStations() {
      if (this.searchQuery.trim()) {
        return this.stations.filter(station => 
          station.title.toLowerCase().includes(this.searchQuery.toLowerCase())
        );
      }
      return this.stations;
    }
  },
  created() {
    // Fetch the stations when the component is created
    this.fetchStations();
    // Start the clock
    this.updateTime();
  },
  methods: {
    // Fetch the station data from the GitHub JSON file
    async fetchStations() {
      this.isLoading = true;

      try {
        const response = await fetch('https://raw.githubusercontent.com/moose3132/radio-ph/refs/heads/main/radio-stations.json');
        if (!response.ok) {
          throw new Error('Failed to fetch stations');
        }
        const data = await response.json();
        this.stations = data; // Set the stations list to the fetched data
      } catch (error) {
        this.error = error.message; // Set error state
      } finally {
        this.isLoading = false; // Stop loading state
      }
    },

    // Handle search input and trigger fetching
    onSearch() {
      // The filtering logic is handled in the computed property `filteredStations`
    },

    // Select and play the station when clicked
    selectStation(station) {
      // Update the selected station's stream URL and title
      this.selectedStationStream = station.stream;
      this.selectedStationTitle = station.title;

      // Play the station automatically if not already playing
      this.playStation();
    },

    // Play the selected station
    playStation() {
      const audioPlayer = this.$refs.audioPlayer;
      if (audioPlayer) {
        audioPlayer.load();  // Reload the audio player with the new stream
        audioPlayer.play();  // Start playing the new stream immediately
      }
    },

    // Update the current time every second
    updateTime() {
      setInterval(() => {
        const now = new Date();
        this.currentTime = now.toLocaleTimeString();  // Update the time in HH:mm:ss format
      }, 1000);
    },
  },
};
</script>

<style scoped>
.player-container {
  width: 100%;
margin-bottom: -20px;
  margin-top: -20px;
}
.station-name{
  font-size: 14px;
}
</style>
