import React, { useState, useEffect } from 'react';
import { Cloud, Sun, CloudRain, Wind, Thermometer, Droplets } from 'lucide-react';

interface WeatherMetrics {
  temperature: number; // Overall relationship warmth (0-100)
  humidity: number; // Emotional intensity (0-100)
  pressure: number; // Social pressure/tension (0-100)
  windSpeed: number; // Rate of change (0-100)
  condition: 'sunny' | 'cloudy' | 'rainy' | 'stormy' | 'partly-cloudy';
  forecast: string;
}

export default function SocialWeather() {
  const [weather, setWeather] = useState<WeatherMetrics>({
    temperature: 75,
    humidity: 65,
    pressure: 45,
    windSpeed: 30,
    condition: 'partly-cloudy',
    forecast: 'Positive interactions expected with occasional emotional discussions'
  });

  const [particles, setParticles] = useState<Array<{
    id: number;
    x: number;
    y: number;
    vx: number;
    vy: number;
    size: number;
    opacity: number;
  }>>([]);

  // Generate weather particles based on conditions
  useEffect(() => {
    const generateParticles = () => {
      const count = weather.condition === 'rainy' ? 50 : weather.condition === 'sunny' ? 20 : 35;
      const newParticles = [];
      
      for (let i = 0; i < count; i++) {
        newParticles.push({
          id: i,
          x: Math.random() * 100,
          y: Math.random() * 100,
          vx: (Math.random() - 0.5) * (weather.windSpeed / 10),
          vy: weather.condition === 'rainy' ? Math.random() * 2 + 1 : (Math.random() - 0.5) * 0.5,
          size: Math.random() * 3 + 1,
          opacity: Math.random() * 0.7 + 0.3
        });
      }
      setParticles(newParticles);
    };

    generateParticles();
    
    // Simulate weather changes
    const interval = setInterval(() => {
      setWeather(prev => ({
        ...prev,
        temperature: Math.max(0, Math.min(100, prev.temperature + (Math.random() - 0.5) * 10)),
        humidity: Math.max(0, Math.min(100, prev.humidity + (Math.random() - 0.5) * 8)),
        pressure: Math.max(0, Math.min(100, prev.pressure + (Math.random() - 0.5) * 6)),
        windSpeed: Math.max(0, Math.min(100, prev.windSpeed + (Math.random() - 0.5) * 5))
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, [weather.condition, weather.windSpeed]);

  // Update weather condition based on metrics
  useEffect(() => {
    let newCondition: WeatherMetrics['condition'] = 'sunny';
    let newForecast = '';

    if (weather.temperature > 80 && weather.pressure < 40) {
      newCondition = 'sunny';
      newForecast = 'Harmonious relationships with high engagement expected';
    } else if (weather.pressure > 70 && weather.humidity > 70) {
      newCondition = 'stormy';
      newForecast = 'Potential conflicts detected. Consider team check-ins';
    } else if (weather.humidity > 60 && weather.temperature < 50) {
      newCondition = 'rainy';
      newForecast = 'Emotional discussions likely. Great time for deeper connections';
    } else if (weather.pressure > 50) {
      newCondition = 'cloudy';
      newForecast = 'Mixed social dynamics. Some tension but opportunities for clarity';
    } else {
      newCondition = 'partly-cloudy';
      newForecast = 'Balanced social atmosphere with room for improvement';
    }

    setWeather(prev => ({ ...prev, condition: newCondition, forecast: newForecast }));
  }, [weather.temperature, weather.humidity, weather.pressure]);

  const getWeatherIcon = () => {
    switch (weather.condition) {
      case 'sunny': return <Sun className="text-yellow-400" size={48} />;
      case 'cloudy': return <Cloud className="text-gray-400" size={48} />;
      case 'rainy': return <CloudRain className="text-blue-400" size={48} />;
      case 'stormy': return <Wind className="text-red-400" size={48} />;
      default: return <Cloud className="text-cyan-400" size={48} />;
    }
  };

  const getWeatherColor = () => {
    switch (weather.condition) {
      case 'sunny': return 'from-yellow-400/20 to-orange-400/20';
      case 'cloudy': return 'from-gray-400/20 to-gray-600/20';
      case 'rainy': return 'from-blue-400/20 to-blue-600/20';
      case 'stormy': return 'from-red-400/20 to-purple-600/20';
      default: return 'from-cyan-400/20 to-purple-400/20';
    }
  };

  return (
    <div className="bg-gray-900 rounded-xl p-6 h-full relative overflow-hidden">
      {/* Animated background */}
      <div className={`absolute inset-0 bg-gradient-to-br ${getWeatherColor()} opacity-50`} />
      
      {/* Particles */}
      <div className="absolute inset-0">
        {particles.map(particle => (
          <div
            key={particle.id}
            className="absolute w-1 h-1 bg-white rounded-full animate-pulse"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              opacity: particle.opacity,
              animationDuration: `${2 + Math.random() * 3}s`
            }}
          />
        ))}
      </div>

      <div className="relative z-10">
        <h2 className="text-2xl font-bold text-white mb-6 flex items-center space-x-3">
          {getWeatherIcon()}
          <span>Social Weather</span>
        </h2>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-gray-800/50 rounded-lg p-4 backdrop-blur-sm">
            <div className="flex items-center space-x-2 mb-2">
              <Thermometer size={20} className="text-orange-400" />
              <span className="text-gray-300 text-sm">Warmth</span>
            </div>
            <div className="text-2xl font-bold text-white">{Math.round(weather.temperature)}°</div>
            <div className="w-full bg-gray-700 rounded-full h-2 mt-2">
              <div 
                className="bg-gradient-to-r from-blue-500 to-orange-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${weather.temperature}%` }}
              />
            </div>
          </div>

          <div className="bg-gray-800/50 rounded-lg p-4 backdrop-blur-sm">
            <div className="flex items-center space-x-2 mb-2">
              <Droplets size={20} className="text-blue-400" />
              <span className="text-gray-300 text-sm">Intensity</span>
            </div>
            <div className="text-2xl font-bold text-white">{Math.round(weather.humidity)}%</div>
            <div className="w-full bg-gray-700 rounded-full h-2 mt-2">
              <div 
                className="bg-gradient-to-r from-cyan-500 to-blue-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${weather.humidity}%` }}
              />
            </div>
          </div>

          <div className="bg-gray-800/50 rounded-lg p-4 backdrop-blur-sm">
            <div className="flex items-center space-x-2 mb-2">
              <Wind size={20} className="text-gray-400" />
              <span className="text-gray-300 text-sm">Pressure</span>
            </div>
            <div className="text-2xl font-bold text-white">{Math.round(weather.pressure)}</div>
            <div className="w-full bg-gray-700 rounded-full h-2 mt-2">
              <div 
                className="bg-gradient-to-r from-green-500 to-red-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${weather.pressure}%` }}
              />
            </div>
          </div>

          <div className="bg-gray-800/50 rounded-lg p-4 backdrop-blur-sm">
            <div className="flex items-center space-x-2 mb-2">
              <Wind size={20} className="text-purple-400" />
              <span className="text-gray-300 text-sm">Change</span>
            </div>
            <div className="text-2xl font-bold text-white">{Math.round(weather.windSpeed)}</div>
            <div className="w-full bg-gray-700 rounded-full h-2 mt-2">
              <div 
                className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${weather.windSpeed}%` }}
              />
            </div>
          </div>
        </div>

        <div className="bg-gray-800/50 rounded-lg p-4 backdrop-blur-sm">
          <h3 className="text-lg font-semibold text-white mb-2">Forecast</h3>
          <p className="text-gray-300">{weather.forecast}</p>
          
          <div className="mt-4 flex items-center justify-between">
            <span className="text-sm text-gray-400">
              Condition: <span className="text-white capitalize">{weather.condition.replace('-', ' ')}</span>
            </span>
            <span className="text-sm text-gray-400">
              Updated: {new Date().toLocaleTimeString()}
            </span>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-3 gap-2 text-center">
          <div className="bg-gray-800/30 rounded-lg p-3">
            <div className="text-green-400 text-xl font-bold">87%</div>
            <div className="text-xs text-gray-400">Team Harmony</div>
          </div>
          <div className="bg-gray-800/30 rounded-lg p-3">
            <div className="text-yellow-400 text-xl font-bold">3</div>
            <div className="text-xs text-gray-400">Areas of Focus</div>
          </div>
          <div className="bg-gray-800/30 rounded-lg p-3">
            <div className="text-cyan-400 text-xl font-bold">12h</div>
            <div className="text-xs text-gray-400">Since Update</div>
          </div>
        </div>
      </div>
    </div>
  );
}