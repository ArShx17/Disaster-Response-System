import React from 'react';
import { GoogleMap, useJsApiLoader, Marker, InfoWindow } from '@react-google-maps/api';

const mapContainerStyle = {
  width: '100%',
  height: '100%',
  borderRadius: '1rem'
};

const defaultCenter = {
  lat: 20.0,
  lng: 0.0
};

const DisasterMap = ({ disasters }) => {
  // Replace with actual key in .env -> VITE_GOOGLE_MAPS_API_KEY
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || ''
  });

  const [activeMarker, setActiveMarker] = React.useState(null);

  const getMarkerIcon = (priority) => {
    // Red for high, Yellow for medium, Green for low
    let color = 'http://maps.google.com/mapfiles/ms/icons/green-dot.png';
    if (priority === 'high') color = 'http://maps.google.com/mapfiles/ms/icons/red-dot.png';
    if (priority === 'medium') color = 'http://maps.google.com/mapfiles/ms/icons/yellow-dot.png';
    return color;
  };

  return isLoaded ? (
    <div className="w-full h-full min-h-[500px] overflow-hidden rounded-2xl">
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={defaultCenter}
        zoom={2}
        options={{
          styles: [
            { elementType: 'geometry', stylers: [{ color: '#1d2c4d' }] },
            { elementType: 'labels.text.fill', stylers: [{ color: '#8ec3b9' }] },
            { elementType: 'labels.text.stroke', stylers: [{ color: '#1a3646' }] },
            { featureType: 'administrative.country', elementType: 'geometry.stroke', stylers: [{ color: '#4b6878' }] },
            { featureType: 'administrative.land_parcel', stylers: [{ visibility: 'off' }] },
            { featureType: 'administrative.province', elementType: 'geometry.stroke', stylers: [{ color: '#4b6878' }] },
            { featureType: 'landscape.man_made', elementType: 'geometry.stroke', stylers: [{ color: '#334e87' }] },
            { featureType: 'landscape.natural', elementType: 'geometry', stylers: [{ color: '#023e58' }] }
          ]
        }}
      >
        {disasters.map((disaster) => (
          <Marker
            key={disaster._id}
            position={{ lat: disaster.latitude, lng: disaster.longitude }}
            icon={getMarkerIcon(disaster.priority)}
            onClick={() => setActiveMarker(disaster)}
          />
        ))}

        {activeMarker && (
          <InfoWindow
            position={{ lat: activeMarker.latitude, lng: activeMarker.longitude }}
            onCloseClick={() => setActiveMarker(null)}
          >
            <div className="text-gray-800 p-2 max-w-[200px]">
              <h3 className="font-bold text-lg mb-1">{activeMarker.type}</h3>
              <p className="text-sm mb-2">{activeMarker.description}</p>
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-red-600">Casualties: {activeMarker.casualties}</span>
                <span className="font-semibold text-green-600">Loss: ${activeMarker.economic_loss}</span>
              </div>
            </div>
          </InfoWindow>
        )}
      </GoogleMap>

      {!import.meta.env.VITE_GOOGLE_MAPS_API_KEY && (
        <div className="absolute top-4 left-4 bg-red-500/80 text-white text-xs px-3 py-1 rounded backdrop-blur">
          Missing Google Maps API Key in .env
        </div>
      )}
    </div>
  ) : (
    <div className="w-full h-full min-h-[500px] bg-slate-800 animate-pulse rounded-2xl flex items-center justify-center text-white/50">
      Loading Maps Engine...
    </div>
  );
};

export default React.memo(DisasterMap);
