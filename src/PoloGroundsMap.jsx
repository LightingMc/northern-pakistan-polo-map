// PoloGroundsMap.jsx
import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';

/* =======================
   AIRPORTS
======================= */

const airports = [
  { name: "Islamabad International Airport", code: "ISB", lat: 33.6169, lng: 73.0992, city: "Islamabad" },
  { name: "Gilgit Airport", code: "GIL", lat: 35.9189, lng: 74.3336, city: "Gilgit" },
  { name: "Skardu Airport", code: "KDU", lat: 35.3355, lng: 75.5360, city: "Skardu" },
  { name: "Chitral Airport", code: "CJL", lat: 35.8867, lng: 71.8006, city: "Chitral" }
];

/* =======================
   POLO GROUNDS (FULL LIST)
======================= */

const poloGrounds = [
  { name: "Shandur Polo Ground", altName: "Mas Junali", district: "Ghizer / Chitral Border", region: "GB / KPK", lat: 36.0756, lng: 72.5200, elevation: "3,700m", type: "major", notes: "World's highest polo ground. Annual Shandur Festival (July 7-9)." },
  { name: "Aga Khan Shahi Polo Ground", altName: "Gilgit Main", district: "Gilgit", region: "Gilgit-Baltistan", lat: 35.9208, lng: 74.3125, elevation: "1,500m", type: "major", notes: "Main polo ground of Gilgit city. Adjacent to Jama Masjid." },
  { name: "Maqpoon Polo Ground", altName: "Skardu Shahi", district: "Skardu", region: "Gilgit-Baltistan", lat: 35.2979, lng: 75.6337, elevation: "2,500m", type: "major", notes: "Historic ground from Ali Sher Khan Anchan era." },
  { name: "Chitral Polo Ground", district: "Chitral", region: "KPK", lat: 35.8517, lng: 71.7864, elevation: "1,500m", type: "major", notes: "Main polo ground in Chitral town." },
  { name: "Khaplu Polo Ground", district: "Ghanche", region: "Gilgit-Baltistan", lat: 35.1578, lng: 76.3243, elevation: "2,600m", type: "city", notes: "Heart of Khaplu Valley, very scenic." },
  { name: "Shigar Polo Ground", district: "Shigar", region: "Gilgit-Baltistan", lat: 35.4267, lng: 75.7500, elevation: "2,300m", type: "historic", notes: "1200+ years old. Largest ground in GB." },
  { name: "Karimabad Polo Ground", altName: "Hunza", district: "Hunza", region: "Gilgit-Baltistan", lat: 36.3167, lng: 74.6600, elevation: "2,500m", type: "city", notes: "Near Baltit Fort. Spring & Harvest festivals." },
  { name: "Aliabad Polo Ground", district: "Hunza", region: "Gilgit-Baltistan", lat: 36.3061, lng: 74.6150, elevation: "2,200m", type: "city", notes: "Central Hunza polo ground." },
  { name: "Chilas Polo Ground", district: "Diamer", region: "Gilgit-Baltistan", lat: 35.4128, lng: 74.0997, elevation: "1,200m", type: "city", notes: "Main ground in Chilas, Diamer capital." },
  { name: "Gahkuch Polo Ground", district: "Ghizer", region: "Gilgit-Baltistan", lat: 36.1667, lng: 73.7500, elevation: "2,100m", type: "city", notes: "Ghizer district headquarters." },
  { name: "Gupis Polo Ground", district: "Ghizer", region: "Gilgit-Baltistan", lat: 36.2167, lng: 73.4333, elevation: "2,400m", type: "district", notes: "On the route to Shandur." },
  { name: "Yasin Polo Ground", district: "Gupis-Yasin", region: "Gilgit-Baltistan", lat: 36.4500, lng: 73.3000, elevation: "2,800m", type: "district", notes: "Historic Yasin Valley ground." },
  { name: "Mastuj Polo Ground", district: "Upper Chitral", region: "KPK", lat: 36.2700, lng: 72.1333, elevation: "2,300m", type: "district", notes: "Yarkhud Valley, route to Shandur." },
  { name: "Laspur Polo Ground", altName: "Sor Laspur", district: "Upper Chitral", region: "KPK", lat: 36.1200, lng: 72.4500, elevation: "3,000m", type: "district", notes: "Famous Shandur Festival competitors." },
  { name: "Astore Polo Ground", district: "Astore", region: "Gilgit-Baltistan", lat: 35.3667, lng: 74.8500, elevation: "2,400m", type: "district", notes: "Astore Valley district ground." },
  { name: "Babusar Polo Ground", district: "Diamer", region: "Gilgit-Baltistan", lat: 35.1500, lng: 74.0167, elevation: "4,000m", type: "district", notes: "Natural high-altitude ground. Babusar Polo Cup." },
  { name: "Phander Polo Ground", district: "Ghizer", region: "Gilgit-Baltistan", lat: 36.1833, lng: 72.9333, elevation: "3,000m", type: "district", notes: "Near Phander Lake." },
  { name: "Nagar Polo Ground", district: "Nagar", region: "Gilgit-Baltistan", lat: 36.2167, lng: 74.5833, elevation: "2,500m", type: "district", notes: "Opposite Hunza Valley." },
  { name: "Ishkuman Polo Ground", district: "Ghizer", region: "Gilgit-Baltistan", lat: 36.4833, lng: 73.9333, elevation: "2,400m", type: "district", notes: "Historic rivalry with Yasin." },
  { name: "Punial Polo Ground", district: "Ghizer", region: "Gilgit-Baltistan", lat: 36.0667, lng: 74.0833, elevation: "1,900m", type: "district", notes: "Between Gilgit and Ghizer." },
  { name: "Kharmang Polo Ground", district: "Kharmang", region: "Gilgit-Baltistan", lat: 35.1333, lng: 76.0833, elevation: "2,700m", type: "district", notes: "East of Skardu along Indus." },
  { name: "Wahab Shaheed Polo Ground", district: "Gilgit", region: "Gilgit-Baltistan", lat: 35.9150, lng: 74.3200, elevation: "1,500m", type: "city", notes: "Jashan Azadi Polo Tournament venue." },
  { name: "Shaheen Polo Ground", district: "Skardu", region: "Gilgit-Baltistan", lat: 35.2950, lng: 75.6400, elevation: "2,500m", type: "city", notes: "Secondary Skardu ground." },
  { name: "Upper Ghizer Polo Ground", district: "Ghizer", region: "Gilgit-Baltistan", lat: 36.3500, lng: 73.1000, elevation: "2,600m", type: "district", notes: "Active polo community." }
];

/* =======================
   ELEGANT COLOR PALETTE
======================= */

const typeConfig = {
  major: {
    color: '#C9A961',
    bg: '#2C2416',
    label: 'Championship Grounds',
    icon: '★'
  },
  city: {
    color: '#5B8AAD',
    bg: '#1A2731',
    label: 'City Grounds',
    icon: '●'
  },
  district: {
    color: '#6B8E6F',
    bg: '#1F2822',
    label: 'District Grounds',
    icon: '◆'
  },
  historic: {
    color: '#A66B5B',
    bg: '#2B1F1C',
    label: 'Historic Grounds',
    icon: '◉'
  },
  airport: {
    color: '#8B4789',
    bg: '#2B1A2B',
    label: 'Airports',
    icon: '✈'
  }
};

/* =======================
   HELPERS
======================= */

function calculateDistance(lat1, lng1, lat2, lng2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function getLabelPosition(itemLat, itemLng, otherLat, otherLng) {
  const verticalPos = itemLat > otherLat ? 'top' : 'bottom';
  const horizontalPos = itemLng < otherLng ? 'left' : 'right';
  const latDiff = Math.abs(itemLat - otherLat);
  const lngDiff = Math.abs(itemLng - otherLng);
  return latDiff > lngDiff ? verticalPos : horizontalPos;
}

function findNearestAirport(poloGround) {
  let nearest = null;
  let minDistance = Infinity;

  airports.forEach(airport => {
    const distance = calculateDistance(
      poloGround.lat, poloGround.lng,
      airport.lat, airport.lng
    );
    if (distance < minDistance) {
      minDistance = distance;
      nearest = airport;
    }
  });

  return { airport: nearest, distance: minDistance };
}

function calculateFlightTime(distanceKm) {
  const avgSpeedKmh = 500;
  const flightTimeHours = distanceKm / avgSpeedKmh;
  const flightTimeMinutes = flightTimeHours * 60;

  if (flightTimeMinutes < 60) {
    return `${Math.round(flightTimeMinutes)} min`;
  } else {
    const hours = Math.floor(flightTimeMinutes / 60);
    const mins = Math.round(flightTimeMinutes % 60);
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
  }
}

async function fetchRoadRoute(fromLat, fromLng, toLat, toLng) {
  try {
    const url = `https://router.project-osrm.org/route/v1/driving/${fromLng},${fromLat};${toLng},${toLat}?overview=full&geometries=geojson`;
    const response = await fetch(url);
    const data = await response.json();

    if (data.code === 'Ok' && data.routes && data.routes.length > 0) {
      const route = data.routes[0];
      const coordinates = route.geometry.coordinates.map(coord => [coord[1], coord[0]]);
      const distance = route.distance / 1000;
      const duration = route.duration / 60;
      return {
        coordinates,
        distance,
        duration,
        success: true
      };
    }
    return {
      coordinates: [[fromLat, fromLng], [toLat, toLng]],
      distance: calculateDistance(fromLat, fromLng, toLat, toLng),
      duration: null,
      success: false
    };
  } catch (error) {
    console.error('Routing error:', error);
    return {
      coordinates: [[fromLat, fromLng], [toLat, toLng]],
      distance: calculateDistance(fromLat, fromLng, toLat, toLng),
      duration: null,
      success: false
    };
  }
}

/* =======================
   MARKER ICON
======================= */

const markerIcon = (type, labelText = '', showLabel = false, isAirport = false, labelPosition = 'top') => {
  const config = typeConfig[type];
  const markerDiameter = isAirport ? 7 : 20;
  const border = isAirport ? 1.5 : 2.5;

  const html = `
    <div class="polo-marker-root" style="position: relative; width: ${markerDiameter}px; height: ${markerDiameter}px; display: inline-block;">
      <div class="polo-marker-bubble" style="
        width: ${markerDiameter}px;
        height: ${markerDiameter}px;
        background: ${config.color};
        border: ${border}px solid #f8f6f1;
        border-radius: ${isAirport ? '3px' : '50%'};
        box-shadow: 0 2px 8px rgba(0,0,0,0.25);
        display:flex;
        align-items:center;
        justify-content:center;
        font-weight:700;
        font-size:${isAirport ? '6px' : (showLabel ? '11px' : '9px')};
        color:#f8f6f1;
      ">${config.icon}</div>

      ${showLabel ? `<div class="polo-marker-label polo-marker-label--${labelPosition}" style="
        position: absolute;
        pointer-events: none;
        white-space: nowrap;
        font-family: Georgia, serif;
        font-weight: 600;
        font-size: 11px;
        padding: 4px 8px;
        background: rgba(255,255,255,0.98);
        border-radius: 4px;
        box-shadow: 0 2px 6px rgba(0,0,0,0.18);
        border: 1px solid ${config.color};
        z-index: 20000;
      ">${labelText}</div>` : '' }
    </div>
    <style>
      .polo-marker-label--top { left: 50%; bottom: calc(100% + 6px); transform: translateX(-50%); }
      .polo-marker-label--bottom { left: 50%; top: calc(100% + 6px); transform: translateX(-50%); }
      .polo-marker-label--left { right: calc(100% + 6px); top: 50%; transform: translateY(-50%); }
      .polo-marker-label--right { left: calc(100% + 6px); top: 50%; transform: translateY(-50%); }
      .polo-marker-root { display:inline-block; vertical-align: middle; }
    </style>
  `;

  const iconAnchor = [Math.round(markerDiameter / 2), Math.round(markerDiameter / 2)];

  return L.divIcon({
    className: '',
    html,
    iconSize: [markerDiameter, markerDiameter],
    iconAnchor
  });
};



/* =======================
   MAIN COMPONENT
======================= */

export default function PoloGroundsMap() {
  const [filter, setFilter] = useState('all');
  const [hoveredGround, setHoveredGround] = useState(null);
  const [hoveredAirport, setHoveredAirport] = useState(null);
  const [selectedGround, setSelectedGround] = useState(null);
  const [routeData, setRouteData] = useState(null);
  const [loadingRoute, setLoadingRoute] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
    setSelectedGround(null);
    setRouteData(null);
    setShowFilters(false);
  };

  const visible =
    filter === 'all'
      ? poloGrounds
      : poloGrounds.filter(g => g.type === filter);

  const stats = {
    total: poloGrounds.length,
    major: poloGrounds.filter(g => g.type === 'major').length,
    city: poloGrounds.filter(g => g.type === 'city').length,
    district: poloGrounds.filter(g => g.type === 'district').length,
    historic: poloGrounds.filter(g => g.type === 'historic').length,
    airport: airports.length
  };

  const handleGroundClick = async (ground) => {
    setSelectedGround(ground);
    setLoadingRoute(true);
    setRouteData(null);

    const { airport: nearestAirport } = findNearestAirport(ground);

    const roadRoute = await fetchRoadRoute(
      nearestAirport.lat, nearestAirport.lng,
      ground.lat, ground.lng
    );

    let flightInfo = null;
    if (nearestAirport.code !== 'ISB') {
      const islamabadAirport = airports.find(a => a.code === 'ISB');
      const flightDistance = calculateDistance(
        islamabadAirport.lat, islamabadAirport.lng,
        nearestAirport.lat, nearestAirport.lng
      );
      flightInfo = {
        distance: flightDistance,
        time: calculateFlightTime(flightDistance)
      };
    }

    setRouteData({
      nearestAirport,
      roadRoute,
      flightInfo
    });

    setLoadingRoute(false);
  };

  const handleMapClick = () => {
    setSelectedGround(null);
    setRouteData(null);
  };

  return (
    <div style={{
      height: '100vh',
      width: '100%',
      background: '#f8f6f1',
      position: 'relative',
      fontFamily: 'Georgia, "Times New Roman", serif',
      overflow: 'hidden'
    }}>
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideIn {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
        .filter-btn {
          transition: all 0.2s ease;
          font-family: 'Georgia', serif;
        }
        .filter-btn:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        }
        .filter-btn:active {
          transform: scale(0.98);
        }
        .leaflet-marker-icon { z-index: 1000 !important; }
        
        /* Mobile-specific styles */
        @media (max-width: 767px) {
          .leaflet-control-zoom {
            margin-right: 10px !important;
            margin-bottom: 80px !important;
          }
          .leaflet-control-attribution {
            font-size: 9px !important;
          }
        }

        /* Prevent text selection on buttons */
        .filter-btn, button {
          -webkit-tap-highlight-color: transparent;
          -webkit-touch-callout: none;
          -webkit-user-select: none;
          user-select: none;
        }
      `}</style>

      {/* HEADER */}
      <div style={{
        background: 'linear-gradient(to bottom, #2f2f2f, #1a1a1a)',
        borderBottom: '1px solid #C9A961',
        padding: isMobile ? '16px 16px' : '28px 40px',
        animation: 'fadeIn 0.6s ease',
        boxShadow: '0 2px 12px rgba(0,0,0,0.15)'
      }}>
        <h1 style={{
          margin: 0,
          color: '#C9A961',
          fontSize: isMobile ? '1.3em' : '2.2em',
          fontWeight: '400',
          textAlign: 'center',
          letterSpacing: isMobile ? '1.5px' : '3px',
          textTransform: 'uppercase',
          fontFamily: 'Georgia, serif'
        }}>
          {isMobile ? 'Polo Grounds Gilgit' : 'Polo Grounds of Pakistan'}
        </h1>
        {!isMobile && (
          <p style={{
            textAlign: 'center',
            color: '#b8b5ad',
            margin: '8px 0 0 0',
            fontSize: '1em',
            fontWeight: '300',
            letterSpacing: '1px',
            fontFamily: 'Georgia, serif'
          }}>
            A Cartographic Survey of {poloGrounds.length} Historic Playing Fields
          </p>
        )}
      </div>

      {/* FILTER BAR - Desktop */}
      {!isMobile && (
        <div style={{
          background: '#e8e6e1',
          borderBottom: '1px solid #d0cdc5',
          padding: '18px 30px',
          display: 'flex',
          justifyContent: 'center',
          gap: '14px',
          flexWrap: 'wrap',
          animation: 'fadeIn 0.8s ease'
        }}>
          <button
            className="filter-btn"
            onClick={() => handleFilterChange('all')}
            style={{
              padding: '10px 22px',
              borderRadius: '4px',
              border: filter === 'all' ? '2px solid #C9A961' : '2px solid #c8c5bd',
              background: filter === 'all' ? '#2f2f2f' : 'white',
              color: filter === 'all' ? '#C9A961' : '#5a5a5a',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: filter === 'all' ? '600' : '400',
              letterSpacing: '0.5px'
            }}
          >
            All Grounds ({stats.total})
          </button>
          {Object.entries(typeConfig).filter(([key]) => key !== 'airport').map(([key, config]) => (
            <button
              key={key}
              className="filter-btn"
              onClick={() => handleFilterChange(key)}
              style={{
                padding: '10px 22px',
                borderRadius: '4px',
                border: `2px solid ${filter === key ? config.color : '#c8c5bd'}`,
                background: filter === key ? config.bg : 'white',
                color: filter === key ? config.color : '#5a5a5a',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: filter === key ? '600' : '400',
                letterSpacing: '0.5px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <span style={{ fontSize: '10px' }}>{config.icon}</span>
              {config.label} ({stats[key]})
            </button>
          ))}
        </div>
      )}

      {/* FILTER BAR - Mobile (Bottom Sheet Style) */}
      {isMobile && (
        <>
          <div style={{
            background: '#e8e6e1',
            borderBottom: '1px solid #d0cdc5',
            padding: '12px 16px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div style={{ fontSize: '13px', color: '#666', fontWeight: '500' }}>
              {filter === 'all' ? `All Grounds (${stats.total})` : `${typeConfig[filter].label} (${stats[filter]})`}
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              style={{
                padding: '8px 16px',
                borderRadius: '4px',
                border: '2px solid #C9A961',
                background: showFilters ? '#2f2f2f' : 'white',
                color: showFilters ? '#C9A961' : '#5a5a5a',
                cursor: 'pointer',
                fontSize: '13px',
                fontWeight: '600'
              }}
            >
              {showFilters ? '✕ Close' : '☰ Filter'}
            </button>
          </div>

          {showFilters && (
            <div style={{
              position: 'fixed',
              bottom: 0,
              left: 0,
              right: 0,
              background: 'white',
              borderTop: '2px solid #C9A961',
              boxShadow: '0 -4px 20px rgba(0,0,0,0.15)',
              zIndex: 2000,
              maxHeight: '60vh',
              overflowY: 'auto',
              animation: 'slideUp 0.3s ease',
              padding: '20px 16px'
            }}>
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr',
                gap: '12px'
              }}>
                <button
                  className="filter-btn"
                  onClick={() => handleFilterChange('all')}
                  style={{
                    padding: '14px 20px',
                    borderRadius: '6px',
                    border: filter === 'all' ? '2px solid #C9A961' : '2px solid #ddd',
                    background: filter === 'all' ? '#2f2f2f' : 'white',
                    color: filter === 'all' ? '#C9A961' : '#5a5a5a',
                    cursor: 'pointer',
                    fontSize: '15px',
                    fontWeight: filter === 'all' ? '600' : '400',
                    textAlign: 'left'
                  }}
                >
                  All Grounds ({stats.total})
                </button>
                {Object.entries(typeConfig).filter(([key]) => key !== 'airport').map(([key, config]) => (
                  <button
                    key={key}
                    className="filter-btn"
                    onClick={() => handleFilterChange(key)}
                    style={{
                      padding: '14px 20px',
                      borderRadius: '6px',
                      border: `2px solid ${filter === key ? config.color : '#ddd'}`,
                      background: filter === key ? config.bg : 'white',
                      color: filter === key ? config.color : '#5a5a5a',
                      cursor: 'pointer',
                      fontSize: '15px',
                      fontWeight: filter === key ? '600' : '400',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      textAlign: 'left'
                    }}
                  >
                    <span style={{ fontSize: '14px' }}>{config.icon}</span>
                    <span>{config.label} ({stats[key]})</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {/* INFO PANEL - Responsive */}
      {selectedGround && (
        <div style={{
          position: 'fixed',
          top: isMobile ? 'auto' : '180px',
          bottom: isMobile ? 0 : 'auto',
          right: isMobile ? 0 : '24px',
          left: isMobile ? 0 : 'auto',
          zIndex: 1500,
          background: 'rgba(255,255,255,0.98)',
          borderRadius: isMobile ? '12px 12px 0 0' : '6px',
          padding: isMobile ? '12px 14px 16px 14px' : '24px',
          border: isMobile ? 'none' : `2px solid ${typeConfig[selectedGround.type].color}`,
          borderTop: isMobile ? `3px solid ${typeConfig[selectedGround.type].color}` : `2px solid ${typeConfig[selectedGround.type].color}`,
          boxShadow: isMobile ? '0 -4px 20px rgba(0,0,0,0.2)' : '0 4px 20px rgba(0,0,0,0.15)',
          minWidth: isMobile ? 'auto' : '320px',
          maxWidth: isMobile ? '100%' : '380px',
          maxHeight: isMobile ? 'auto' : 'calc(100vh - 200px)',
          overflowY: 'auto',
          animation: isMobile ? 'slideUp 0.3s ease' : 'slideUp 0.5s ease',
          backdropFilter: 'blur(10px)'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            marginBottom: isMobile ? '8px' : '16px',
            paddingBottom: isMobile ? '8px' : '12px',
            borderBottom: `2px solid ${typeConfig[selectedGround.type].color}`
          }}>
            <div style={{ flex: 1 }}>
              <h3 style={{
                margin: '0 0 3px 0',
                color: '#2f2f2f',
                fontSize: isMobile ? '14px' : '20px',
                fontWeight: '600',
                letterSpacing: '0.3px',
                lineHeight: '1.2'
              }}>
                {selectedGround.name}
              </h3>
              {selectedGround.altName && (
                <div style={{
                  fontSize: isMobile ? '10px' : '12px',
                  color: '#777',
                  fontStyle: 'italic'
                }}>
                  "{selectedGround.altName}"
                </div>
              )}
            </div>
            <button
              onClick={handleMapClick}
              style={{
                background: 'none',
                border: 'none',
                color: '#999',
                cursor: 'pointer',
                fontSize: isMobile ? '24px' : '28px',
                padding: 0,
                lineHeight: 1,
                minWidth: isMobile ? '28px' : '32px',
                minHeight: isMobile ? '28px' : '32px',
                marginLeft: '8px'
              }}
            >×</button>
          </div>

          <div style={{
            display: 'inline-block',
            background: typeConfig[selectedGround.type].bg,
            color: typeConfig[selectedGround.type].color,
            padding: isMobile ? '4px 8px' : '6px 12px',
            borderRadius: '3px',
            fontSize: isMobile ? '9px' : '11px',
            fontWeight: '600',
            marginBottom: isMobile ? '8px' : '16px',
            letterSpacing: '0.3px',
            textTransform: 'uppercase'
          }}>
            {typeConfig[selectedGround.type].icon} {selectedGround.type}
          </div>

          <div style={{ marginBottom: isMobile ? '8px' : '12px' }}>
            <div style={{
              fontSize: isMobile ? '10px' : '13px',
              marginBottom: isMobile ? '4px' : '8px',
              color: '#555',
              lineHeight: '1.3'
            }}>
              <strong>Location:</strong> {selectedGround.district}, {selectedGround.region}
            </div>
            <div style={{
              fontSize: isMobile ? '10px' : '13px',
              fontWeight: '600',
              color: typeConfig[selectedGround.type].color,
              marginBottom: isMobile ? '8px' : '12px'
            }}>
              <strong>Elevation:</strong> {selectedGround.elevation}
            </div>
          </div>

          <div style={{
            fontSize: isMobile ? '10px' : '13px',
            color: '#666',
            lineHeight: isMobile ? '1.4' : '1.6',
            paddingTop: isMobile ? '8px' : '12px',
            borderTop: '1px solid #e5e5e5',
            marginBottom: isMobile ? '10px' : '16px'
          }}>
            {selectedGround.notes}
          </div>

          {routeData && (
            <div style={{
              padding: isMobile ? '8px 10px' : '14px',
              background: 'rgba(139,71,137,0.08)',
              borderRadius: '4px',
              borderLeft: `3px solid ${typeConfig.airport.color}`
            }}>
              <div style={{ 
                fontWeight: '600', 
                marginBottom: isMobile ? '6px' : '10px', 
                color: '#555', 
                fontSize: isMobile ? '11px' : '14px' 
              }}>
                {typeConfig.airport.icon} Travel Info
              </div>
              <div style={{ 
                fontSize: isMobile ? '9px' : '12px', 
                color: '#666', 
                marginBottom: isMobile ? '3px' : '6px',
                lineHeight: '1.4'
              }}>
                <strong>Nearest Airport:</strong> {routeData.nearestAirport.name} ({routeData.nearestAirport.code})
              </div>
              <div style={{ 
                fontSize: isMobile ? '9px' : '12px', 
                color: '#666', 
                marginBottom: isMobile ? '3px' : '6px',
                lineHeight: '1.4'
              }}>
                <strong>Road:</strong> {routeData.roadRoute.distance.toFixed(1)} km
                {routeData.roadRoute.duration && ` • ~${Math.round(routeData.roadRoute.duration)} min`}
              </div>
              {routeData.flightInfo && (
                <div style={{
                  fontSize: isMobile ? '8px' : '11px',
                  color: '#888',
                  marginTop: isMobile ? '4px' : '10px',
                  paddingTop: isMobile ? '4px' : '10px',
                  borderTop: '1px solid rgba(0,0,0,0.1)',
                  fontStyle: 'italic',
                  lineHeight: '1.3'
                }}>
                  Via ISB: {routeData.flightInfo.distance.toFixed(0)}km to {routeData.nearestAirport.code} ({routeData.flightInfo.time})
                </div>
              )}
            </div>
          )}

          {loadingRoute && (
            <div style={{
              fontSize: isMobile ? '10px' : '12px',
              color: '#999',
              textAlign: 'center',
              padding: isMobile ? '8px' : '12px',
              fontStyle: 'italic'
            }}>
              Loading route...
            </div>
          )}
        </div>
      )}

      {/* MAP */}
      <MapContainer
        center={isMobile ? [36.2, 74.0] : [35.8, 74.0]}
        zoom={isMobile ? 6 : 7}
        minZoom={isMobile ? 5.2 : 6.2}
        maxZoom={isMobile ? 7.2 : 8.2}
        style={{
          height: isMobile 
            ? 'calc(100vh - 110px)' 
            : 'calc(100vh - 185px)',
          width: '100%',
          animation: 'fadeIn 0.8s ease'
        }}
        onClick={handleMapClick}
        zoomControl={true}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        />

        {/* POLO GROUND MARKERS */}
        {visible.map((g, i) => {
          const isSelected = selectedGround === g;
          const isHovered = !isMobile && hoveredGround === i;
          const showLabel = isSelected || isHovered;
          const hasActiveRoute = selectedGround !== null;
          const isPartOfRoute = isSelected;

          const opacity = hasActiveRoute && !isPartOfRoute ? 0.3 : 1.0;

          let labelPosition = 'top';
          if (isSelected && routeData) {
            labelPosition = getLabelPosition(
              g.lat, g.lng,
              routeData.nearestAirport.lat, routeData.nearestAirport.lng
            );
          }

          return (
            <Marker
              key={`ground-${i}`}
              position={[g.lat, g.lng]}
              icon={markerIcon(g.type, g.name, showLabel, false, labelPosition)}
              opacity={opacity}
              eventHandlers={{
                mouseover: () => !isMobile && setHoveredGround(i),
                mouseout: () => !isMobile && setHoveredGround(null),
                click: (e) => {
                  L.DomEvent.stopPropagation(e);
                  handleGroundClick(g);
                }
              }}
            />
          );
        })}

        {/* AIRPORT MARKERS */}
        {airports.map((airport, i) => {
          const isSelectedAirport = routeData && routeData.nearestAirport.code === airport.code;
          const isHovered = !isMobile && hoveredAirport === i;
          const showLabel = isSelectedAirport || isHovered;
          const hasActiveRoute = routeData !== null;

          const opacity = hasActiveRoute && !isSelectedAirport ? 0.3 : 1.0;

          let labelPosition = 'top';
          if (isSelectedAirport && selectedGround) {
            labelPosition = getLabelPosition(
              airport.lat, airport.lng,
              selectedGround.lat, selectedGround.lng
            );
          }

          return (
            <Marker
              key={`airport-${i}`}
              position={[airport.lat, airport.lng]}
              icon={markerIcon('airport', airport.name, showLabel, true, labelPosition)}
              opacity={opacity}
              eventHandlers={{
                mouseover: () => !isMobile && setHoveredAirport(i),
                mouseout: () => !isMobile && setHoveredAirport(null)
              }}
            />
          );
        })}

        {/* ROUTE LINES */}
        {routeData && (
          <Polyline
            positions={routeData.roadRoute.coordinates}
            pathOptions={{
              color: typeConfig[selectedGround.type].color,
              weight: 4,
              opacity: 0.8,
              dashArray: '10, 5'
            }}
          />
        )}
      </MapContainer>

      {/* FOOTER - Hidden on mobile when info panel is open */}
      {(!isMobile || !selectedGround) && (
        <div style={{
          position: 'absolute',
          bottom: '12px',
          left: '50%',
          transform: 'translateX(-50%)',
          background: 'rgba(255,255,255,0.95)',
          padding: isMobile ? '6px 16px' : '8px 20px',
          borderRadius: '20px',
          border: '1px solid #d0cdc5',
          fontSize: isMobile ? '11px' : '12px',
          color: '#666',
          boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
          fontFamily: 'Georgia, serif',
          zIndex: 500,
          maxWidth: isMobile ? 'calc(100% - 32px)' : 'auto',
          textAlign: 'center'
        }}>
          {selectedGround ? (
            <span>
              Route to <strong style={{ color: typeConfig[selectedGround.type].color }}>{selectedGround.name}</strong>
              {!isMobile && (
                <>
                  {' • '}
                  <span
                    onClick={handleMapClick}
                    style={{
                      cursor: 'pointer',
                      textDecoration: 'underline',
                      color: '#999'
                    }}
                  >
                    Clear
                  </span>
                </>
              )}
            </span>
          ) : (
            `${visible.length} of ${poloGrounds.length} grounds`
          )}
        </div>
      )}
    </div>
  );
}