<template>
    <div class="min-h-screen bg-gray-100 flex items-center justify-center">
      <div class="p-8">
        <div class="relative bg-white rounded-3xl w-80 h-auto pb-4 overflow-hidden
             before:absolute before:inset-0 before:-z-10 before:translate-y-2 
             before:blur-2xl before:bg-gradient-to-br before:from-blue-400/30 
             before:via-purple-400/20 before:to-pink-400/30">
          
          <!-- Barre de recherche -->
          <form @submit.prevent="searchWeather" class="p-4 bg-gradient-to-b from-white to-white/80">
            <div class="relative group">
              <input 
                v-model="city"
                type="text"
                placeholder="Rechercher une ville..."
                class="w-full pl-4 pr-10 py-3 bg-gray-50/50 rounded-xl 
                  border border-gray-100 backdrop-blur-sm
                  focus:outline-none focus:ring-2 focus:ring-blue-200/50
                  transition-all duration-300 ease-out
                  placeholder:text-gray-400 text-sm
                  group-hover:bg-gray-50/80"
              />
              <Icon 
                :name="loading ? 'lucide:loader' : 'lucide:search'"
                class="absolute right-3 top-3.5 text-gray-400 w-4 h-4
                  group-hover:text-blue-400 transition-colors duration-300" 
              />
            </div>
          </form>
  
          <!-- Contenu météo -->
          <div v-if="weather" class="px-6 pt-4">
            <div class="flex justify-between items-start mb-6">
              <div>
                <h2 class="text-2xl font-bold text-gray-800">
                  {{ weather.name }}
                  <span class="text-sm font-normal text-gray-500">{{ weather.sys.country }}</span>
                </h2>
                <p class="text-sm text-gray-500 capitalize">
                  {{ weather.weather[0].description }}
                </p>
              </div>
              <div class="text-right">
                <div class="text-5xl font-bold text-gray-800">
                  {{ Math.round(weather.main.temp) }}°
                </div>
                <p class="text-sm text-gray-500">
                  Ressenti {{ Math.round(weather.main.feels_like) }}°
                </p>
              </div>
            </div>
  
            <!-- Icône météo -->
            <div class="flex justify-center mb-6">
              <img 
                :src="`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`"
                :alt="weather.weather[0].description"
                class="w-20 h-20"
              />
            </div>
  
            <!-- Stats météo -->
            <div class="grid grid-cols-2 gap-4">
              <div v-for="stat in weatherStats" :key="stat.label" 
                   class="bg-gradient-to-br from-blue-50 to-blue-50/50 p-4 rounded-xl">
                <p class="text-sm font-medium text-gray-600">{{ stat.label }}</p>
                <div class="flex items-baseline mt-1">
                  <span class="text-2xl font-bold text-gray-800">{{ stat.value }}</span>
                  <span class="text-gray-500 ml-1">{{ stat.unit }}</span>
                </div>
              </div>
            </div>
          </div>
  
          <!-- État de chargement -->
          <div v-else-if="loading" class="flex items-center justify-center h-64">
            <Icon name="lucide:loader" class="w-8 h-8 animate-spin text-blue-400" />
          </div>
  
          <!-- Message d'erreur -->
          <div v-else-if="error" class="p-6 text-center text-red-500">
            {{ error }}
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  const config = useRuntimeConfig()
  const city = ref('Dakar')
  const weather = ref(null)
  const loading = ref(false)
  const error = ref(null)
  
  // Stats météo calculées
  const weatherStats = computed(() => {
    if (!weather.value) return []
    
    return [
      {
        label: 'Humidité',
        value: weather.value.main.humidity,
        unit: '%'
      },
      {
        label: 'Vent',
        value: Math.round(weather.value.wind.speed * 3.6), // m/s vers km/h
        unit: 'km/h'
      },
      {
        label: 'Lever',
        value: formatTime(weather.value.sys.sunrise),
        unit: ''
      },
      {
        label: 'Coucher',
        value: formatTime(weather.value.sys.sunset),
        unit: ''
      }
    ]
  })
  
  // Formater les timestamps en heure locale
  function formatTime(timestamp) {
    return new Date(timestamp * 1000).toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }
  
  // Rechercher la météo
  async function searchWeather() {
    if (!city.value.trim()) return
    
    loading.value = true
    error.value = null
    
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city.value}&appid=${config.public.openWeatherApiKey}&units=metric&lang=fr`
      )
      
      if (!response.ok) {
        throw new Error('Ville non trouvée')
      }
      
      weather.value = await response.json()
    } catch (e) {
      error.value = "Erreur lors de la recherche de la ville"
      weather.value = null
    } finally {
      loading.value = false
    }
  }
  
  // Charger la météo au démarrage
  onMounted(() => {
    searchWeather()
  })
  </script>