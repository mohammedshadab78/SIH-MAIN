import { useState, useEffect, useRef } from 'react';
import { 
  MapPin, 
  Phone, 
  Users, 
  CheckCircle, 
  Navigation, 
  Compass, 
  Search, 
  Sparkles,
  LocateFixed,
  Building,
  GraduationCap,
  Award,
  Calendar,
  X,
  CheckCircle2,
  Briefcase,
  IndianRupee,
  Layers,
  ArrowRight,
  ExternalLink,
  ShieldCheck,
  Check,
  Globe,
  Radio
} from 'lucide-react';
import { mpDistrictsHyperlocal, findDistrictHyperlocal } from '../data/mpHyperlocalData';
import { playSmsChime } from '../lib/speechService';
import L from 'leaflet';

// Haversine formula to calculate distance between two coordinates in kilometers
function calculateHaversineDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}

// Function to create an authentic 3D Teardrop Map Pin with needle pointing to exact coordinates
function createTeardropPin(color, iconEmoji, badgeText = "") {
  return `
    <div style="position: relative; width: 38px; height: 48px; filter: drop-shadow(0 6px 8px rgba(0,0,0,0.38)); cursor: pointer; transition: transform 0.15s ease-out;" onmouseover="this.style.transform='scale(1.18) translateY(-4px)'" onmouseout="this.style.transform='scale(1) translateY(0)'">
      <svg width="38" height="48" viewBox="0 0 38 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <!-- 3D Teardrop Outer Body with bottom pointed tip at (19, 47) -->
        <path d="M19 0C8.50659 0 0 8.50659 0 19C0 29.5 14.5 44 19 47C23.5 44 38 29.5 38 19C38 8.50659 29.4934 0 19 0Z" fill="${color}"/>
        <path d="M19 1C9.05887 1 1 9.05887 1 19C1 28.8 14.8 43 19 45.8C23.2 43 37 28.8 37 19C37 9.05887 28.9411 1 19 1Z" stroke="white" stroke-width="1.8"/>
        <!-- Inner white focal lens -->
        <circle cx="19" cy="18" r="12.5" fill="white"/>
        <circle cx="19" cy="18" r="11" fill="${color}" fill-opacity="0.12"/>
      </svg>
      <!-- Centered Icon inside lens -->
      <div style="position: absolute; top: 7px; left: 8px; width: 22px; height: 22px; display: flex; align-items: center; justify-content: center; font-size: 14px; pointer-events: none;">
        ${iconEmoji}
      </div>
      ${badgeText ? `
        <div style="position: absolute; top: -3px; right: -3px; background: #dc2626; color: white; font-size: 8px; font-weight: 900; padding: 1px 4px; border-radius: 9999px; border: 1.5px solid white; box-shadow: 0 1px 3px rgba(0,0,0,0.3);">
          ${badgeText}
        </div>
      ` : ''}
    </div>
  `;
}

export default function HyperlocalMap({ lang, t, onOpenVoiceBot }) {
  const isHi = lang === 'hi';
  const isMr = lang === 'mr';
  const mTrans = t?.map || {};
  const cTrans = t?.common || {};
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);

  // Search and District state - Defaulting to Sehore (Primary Focus)
  const [searchInput, setSearchInput] = useState("सीहोर (Sehore)");
  const [activeDistrict, setActiveDistrict] = useState(mpDistrictsHyperlocal[0]); // Sehore
  
  // Map mode: 'centers' (Skill Centers only), 'jobs' (Jobs only), or 'both'
  const [mapViewMode, setMapViewMode] = useState('centers');

  // Sector Filter Pills
  const [selectedSector, setSelectedSector] = useState('all');

  // Bottom listing tab: 'centers' or 'jobs'
  const [activeListTab, setActiveListTab] = useState('centers');

  // Currently focused item (center or job) for proximity linkage
  const [focusedCenter, setFocusedCenter] = useState(null);

  // Geolocation state
  const [userLocation, setUserLocation] = useState(null);
  const [isLocating, setIsLocating] = useState(false);
  const [locationError, setLocationError] = useState("");

  // Booking & Contact Modal State
  const [bookingModal, setBookingModal] = useState({
    isOpen: false,
    item: null,
    type: 'center', // 'center' or 'job'
    userName: '',
    userPhone: '',
    preferredDate: '',
    confirmedRef: null
  });

  // Open Turn-by-Turn Google Maps Navigation
  const openGoogleMaps = (lat, lng, name) => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
    window.open(url, '_blank');
  };

  // Handle Search Submission
  const handleSearch = (customQuery = null) => {
    const query = customQuery !== null ? customQuery : searchInput;
    if (!query || !query.trim()) return;

    const matched = findDistrictHyperlocal(query);
    if (matched) {
      setActiveDistrict(matched);
      setSearchInput(`${matched.nameHi} (${matched.name})`);
      setFocusedCenter(null);

      if (mapInstanceRef.current) {
        mapInstanceRef.current.flyTo([matched.lat, matched.lng], matched.zoom || 10, {
          duration: 1.2
        });
      }
    }
  };

  // Quick Select from Popular Rural District Pills
  const handleSelectDistrictPill = (dist) => {
    setActiveDistrict(dist);
    setSearchInput(`${dist.nameHi} (${dist.name})`);
    setFocusedCenter(null);
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo([dist.lat, dist.lng], dist.zoom || 10, {
        duration: 1.2
      });
    }
  };

  // Geolocation trigger
  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      setLocationError(isMr ? "ब्राउझरमध्ये जीपीएस समर्थित नाही." : isHi ? "ब्राउज़र में जीपीएस समर्थित नहीं है।" : "Geolocation not supported.");
      return;
    }

    setIsLocating(true);
    setLocationError("");

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setUserLocation({ lat: latitude, lng: longitude });
        setIsLocating(false);

        if (mapInstanceRef.current) {
          mapInstanceRef.current.flyTo([latitude, longitude], 10, { duration: 1.2 });
        }
      },
      (err) => {
        setIsLocating(false);
        // Default to Sehore rural coordinates
        setUserLocation({ lat: 23.2030, lng: 77.0844, isSimulated: true });
        setLocationError(isMr ? "सिहोर (मध्य प्रदेश) ग्रामीण भागातील संदर्भ अंतर दर्शविले जात आहे." : isHi ? "सीहोर (मध्य प्रदेश) ग्रामीण क्षेत्र से दूरी दर्शाई जा रही है।" : "Using Sehore rural reference.");
      },
      { timeout: 6000, enableHighAccuracy: true }
    );
  };

  // Fly to exact village location of a center or job
  const handleFlyToLocation = (item, type) => {
    if (type) {
      setMapViewMode(type === 'center' ? 'centers' : 'jobs');
    }
    if (type === 'center') {
      setFocusedCenter(item);
    }
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo([item.lat, item.lng], 13, { duration: 1.2 });
    }
  };

  // Open booking / apply modal
  const handleOpenBooking = (item, type) => {
    setBookingModal({
      isOpen: true,
      item,
      type,
      userName: '',
      userPhone: '',
      preferredDate: new Date().toISOString().split('T')[0],
      confirmedRef: null
    });
  };

  // Submit booking / application
  const handleConfirmBooking = (e) => {
    e.preventDefault();
    const refId = bookingModal.type === 'center' 
      ? `KVK-SEAT-${Math.floor(1000 + Math.random() * 9000)}` 
      : `JOB-APP-${Math.floor(1000 + Math.random() * 9000)}`;

    setBookingModal(prev => ({
      ...prev,
      confirmedRef: {
        id: refId,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    }));
    playSmsChime();
  };

  // Filter centers based on selectedSector
  const filteredSkillCenters = activeDistrict.skillCenters.filter(c => {
    if (selectedSector === 'all') return true;
    const text = `${c.name} ${c.nameHi} ${c.courses.join(' ')}`.toLowerCase();
    if (selectedSector === 'drone_agri') return text.includes('drone') || text.includes('ड्रोन') || text.includes('कृषि') || text.includes('organic') || text.includes('जैविक') || text.includes('fertilizer');
    if (selectedSector === 'solar') return text.includes('solar') || text.includes('सोलर') || text.includes('pump') || text.includes('पंप') || text.includes('ऊर्जा');
    if (selectedSector === 'dairy') return text.includes('dairy') || text.includes('डेयरी') || text.includes('milk') || text.includes('दूध') || text.includes('poultry') || text.includes('मुर्गी') || text.includes('goat');
    if (selectedSector === 'crafts') return text.includes('craft') || text.includes('शिल्प') || text.includes('print') || text.includes('हथकरघा') || text.includes('weaving') || text.includes('विश्वकर्मा') || text.includes('tailor');
    return true;
  });

  // Filter jobs based on selectedSector
  const filteredJobs = activeDistrict.jobs.filter(j => {
    if (selectedSector === 'all') return true;
    const text = `${j.title} ${j.titleHi} ${j.employer}`.toLowerCase();
    if (selectedSector === 'drone_agri') return text.includes('drone') || text.includes('ड्रोन') || text.includes('फसल') || text.includes('कृषि') || text.includes('grain') || text.includes('organic') || text.includes('millet');
    if (selectedSector === 'solar') return text.includes('solar') || text.includes('सोलर') || text.includes('pump') || text.includes('पंप') || text.includes('ऊर्जा');
    if (selectedSector === 'dairy') return text.includes('dairy') || text.includes('डेयरी') || text.includes('milk') || text.includes('दूध') || text.includes('poultry') || text.includes('कड़कनाथ') || text.includes('goat');
    if (selectedSector === 'crafts') return text.includes('craft') || text.includes('शिल्प') || text.includes('print') || text.includes('हथकरघा') || text.includes('weaver') || text.includes('विश्वकर्मा') || text.includes('garment');
    return true;
  });

  // Initialize and Update Leaflet Map with Clean Street Map & 3D Teardrop Pins
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [activeDistrict.lat, activeDistrict.lng],
        zoom: activeDistrict.zoom || 10,
        scrollWheelZoom: false,
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
        maxZoom: 18
      }).addTo(map);

      mapInstanceRef.current = map;
      setTimeout(() => map.invalidateSize(), 250);
    }

    const map = mapInstanceRef.current;

    // Clear existing markers
    markersRef.current.forEach(m => map.removeLayer(m));
    markersRef.current = [];

    // Add User Location Pin if active
    if (userLocation) {
      const userIcon = L.divIcon({
        className: 'user-location-pin',
        html: `
          <div style="position: relative; width: 26px; height: 26px;">
            <div style="position: absolute; inset: 0; background: #3b82f6; border-radius: 50%; opacity: 0.4; animation: ping 2s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
            <div style="position: absolute; inset: 3px; background: #1d4ed8; width: 20px; height: 20px; border-radius: 50%; border: 3px solid white; box-shadow: 0 0 10px rgba(29,78,216,0.8);"></div>
          </div>
        `,
        iconSize: [26, 26],
        iconAnchor: [13, 13]
      });
      const userMarker = L.marker([userLocation.lat, userLocation.lng], { icon: userIcon }).addTo(map);
      userMarker.bindPopup(isMr ? "<b>तुमचे सध्याचे स्थान (Your Location)</b>" : isHi ? "<b>आपकी वर्तमान स्थिति (Your Location)</b>" : "<b>Your Location</b>");
      markersRef.current.push(userMarker);
    }

    // 1. Plot Skill Centers if mode is 'centers' or 'both' using 3D Teardrop Pins
    if (mapViewMode === 'centers' || mapViewMode === 'both') {
      filteredSkillCenters.forEach(center => {
        const centerIcon = L.divIcon({
          className: 'custom-center-marker-teardrop',
          html: createTeardropPin('#ea580c', '🎓', 'KVK'),
          iconSize: [38, 48],
          iconAnchor: [19, 47],
          popupAnchor: [0, -47]
        });

        const marker = L.marker([center.lat, center.lng], { icon: centerIcon }).addTo(map);

        const gMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${center.lat},${center.lng}`;

        const popupContent = `
          <div style="font-family: system-ui, -apple-system, sans-serif; font-size: 12px; min-width: 230px; padding: 2px;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
              <span style="background: #ffedd5; color: #9a3412; font-size: 9px; font-weight: 800; padding: 2px 6px; border-radius: 4px; text-transform: uppercase;">
                ${center.type}
              </span>
              <span style="color: #0284c7; font-size: 10px; font-weight: bold;">
                ${center.seatsAvailable} ${isMr ? "जागा उपलब्ध" : isHi ? "सीटें उपलब्ध" : "Seats Available"}
              </span>
            </div>

            <div style="font-weight: 800; font-size: 13px; color: #0f172a; margin-bottom: 2px; line-height: 1.3;">
              ${isMr ? (center.nameMr || center.nameHi || center.name) : isHi ? (center.nameHi || center.name) : center.name}
            </div>

            <div style="color: #475569; font-size: 11px; margin-bottom: 6px;">
              📍 <b>${center.village}</b> (${center.block})
            </div>

            <div style="background: #fff7ed; border: 1px solid #fed7aa; border-radius: 8px; padding: 6px; margin-bottom: 6px;">
              <div style="font-size: 10px; color: #9a3412; font-weight: 800; text-transform: uppercase;">${isMr ? "प्रशिक्षण अभ्यासक्रम:" : isHi ? "प्रशिक्षण पाठ्यक्रम:" : "Course:"}</div>
              <div style="color: #1e293b; font-weight: 700; font-size: 11px; margin-top: 1px;">${center.courses[0]}</div>
              <div style="color: #16a34a; font-size: 11px; font-weight: 800; margin-top: 3px;">
                💰 ${isMr ? "विद्यावेतन:" : isHi ? "स्टाइपेंड:" : "Stipend:"} ${center.stipend}
              </div>
            </div>

            <div style="display: flex; gap: 4px; margin-top: 6px;">
              <a href="${gMapsUrl}" target="_blank" style="flex: 1; background: #2563eb; color: white; text-decoration: none; font-size: 10px; font-weight: bold; padding: 5px 6px; border-radius: 6px; text-align: center; display: inline-flex; align-items: center; justify-content: center; gap: 3px;">
                🧭 ${isMr ? "दिशा-निर्देश" : isHi ? "दिशा-निर्देश" : "Directions"}
              </a>
              <a href="tel:${center.phone}" style="flex: 1; background: #ea580c; color: white; text-decoration: none; font-size: 10px; font-weight: bold; padding: 5px 6px; border-radius: 6px; text-align: center; display: inline-flex; align-items: center; justify-content: center; gap: 3px;">
                📞 ${isMr ? "कॉल करा" : isHi ? "कॉल करें" : "Call"}
              </a>
            </div>
          </div>
        `;

        marker.bindPopup(popupContent);
        marker.on('click', () => {
          setFocusedCenter(center);
        });
        markersRef.current.push(marker);
      });
    }

    // 2. Plot Rural Jobs if mode is 'jobs' or 'both' using 3D Teardrop Pins
    if (mapViewMode === 'jobs' || mapViewMode === 'both') {
      filteredJobs.forEach(job => {
        const jobIcon = L.divIcon({
          className: 'custom-job-marker-teardrop',
          html: createTeardropPin('#059669', '💼', `${job.vacancies}`),
          iconSize: [38, 48],
          iconAnchor: [19, 47],
          popupAnchor: [0, -47]
        });

        const marker = L.marker([job.lat, job.lng], { icon: jobIcon }).addTo(map);

        const gMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${job.lat},${job.lng}`;

        const popupContent = `
          <div style="font-family: system-ui, -apple-system, sans-serif; font-size: 12px; min-width: 230px; padding: 2px;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
              <span style="background: #d1fae5; color: #065f46; font-size: 9px; font-weight: 800; padding: 2px 6px; border-radius: 4px;">
                ${job.vacancies} ${isMr ? "जागा रिक्त" : isHi ? "पद रिक्त" : "Openings"} • ${job.type}
              </span>
            </div>

            <div style="font-weight: 800; font-size: 13px; color: #0f172a; margin-bottom: 2px; line-height: 1.3;">
              ${isMr ? (job.titleMr || job.titleHi || job.title) : isHi ? (job.titleHi || job.title) : job.title}
            </div>

            <div style="color: #059669; font-weight: 800; font-size: 13px; margin-bottom: 4px;">
              ${job.salary}
            </div>

            <div style="color: #475569; font-size: 11px; margin-bottom: 6px;">
              🏢 <b>${job.employer}</b><br/>
              📍 ${job.village} (${job.block})
            </div>

            <div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; padding: 6px; margin-bottom: 6px; font-size: 10px; color: #166534;">
              <b>${isMr ? "पात्रता:" : isHi ? "पात्रता:" : "Eligibility:"}</b> ${job.eligibility}
            </div>

            <div style="display: flex; gap: 4px; margin-top: 6px;">
              <a href="${gMapsUrl}" target="_blank" style="flex: 1; background: #2563eb; color: white; text-decoration: none; font-size: 10px; font-weight: bold; padding: 5px 6px; border-radius: 6px; text-align: center; display: inline-flex; align-items: center; justify-content: center; gap: 3px;">
                🧭 ${isMr ? "दिशा-निर्देश" : isHi ? "दिशा-निर्देश" : "Directions"}
              </a>
              <a href="tel:${job.phone}" style="flex: 1; background: #059669; color: white; text-decoration: none; font-size: 10px; font-weight: bold; padding: 5px 6px; border-radius: 6px; text-align: center; display: inline-flex; align-items: center; justify-content: center; gap: 3px;">
                📞 ${isMr ? "संपर्क / कॉल" : isHi ? "संपर्क / कॉल" : "Call"}
              </a>
            </div>
          </div>
        `;

        marker.bindPopup(popupContent);
        markersRef.current.push(marker);
      });
    }

  }, [activeDistrict, mapViewMode, selectedSector, userLocation, lang]);

  return (
    <div className="py-8 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 border-b border-slate-200 pb-4">
          <div>
            <div className="inline-flex items-center gap-1.5 bg-orange-100 text-orange-800 text-[11px] font-bold px-3 py-1 rounded-full border border-orange-200 mb-1 uppercase">
              <Compass className="w-3.5 h-3.5 text-orange-600" />
              <span>{mTrans.badge || "Madhya Pradesh Rural Hyperlocal GIS"}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
              <span>{mTrans.title || "Rural Skill Centers & Local Jobs Map"}</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              {mTrans.subtitle || "Exact village-level 3D pin mapping of active KVKs, PMKK centers, and livelihood vacancies across Sehore & MP rural belts."}
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={handleGetLocation}
              disabled={isLocating}
              className="bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 text-xs px-3.5 py-2.5 rounded-xl font-bold flex items-center gap-1.5 shadow-2xs transition-all cursor-pointer"
            >
              <LocateFixed className={`w-4 h-4 text-blue-600 ${isLocating ? 'animate-spin' : ''}`} />
              <span>{isLocating ? (lang === 'hi' ? "खोज रहे हैं..." : "Locating...") : (mTrans.locateMe || "My Location GPS")}</span>
            </button>

            <button
              onClick={onOpenVoiceBot}
              className="bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white text-xs px-4 py-2.5 rounded-xl font-bold flex items-center gap-1.5 shadow transition-all cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-amber-200" />
              <span>{t?.navAssistant || "Ask Centers via Voice"}</span>
            </button>
          </div>
        </div>

        {/* Search & Location Bar with Explicit Search Button */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-slate-200 mb-6">
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              handleSearch();
            }}
            className="flex flex-col sm:flex-row items-center gap-3"
          >
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder={mTrans.searchPlaceholder || "Search district or rural block (e.g. Sehore, Barwani)..."}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-slate-900 focus:ring-2 focus:ring-orange-500 focus:outline-none"
              />
            </div>

            {/* Quick District Select Dropdown */}
            <select
              value={activeDistrict.id}
              onChange={(e) => {
                const dist = mpDistrictsHyperlocal.find(d => d.id === e.target.value);
                if (dist) handleSelectDistrictPill(dist);
              }}
              className="w-full sm:w-56 bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-xs sm:text-sm font-semibold text-slate-800 focus:ring-2 focus:ring-orange-500 focus:outline-none cursor-pointer"
            >
              {mpDistrictsHyperlocal.map(d => (
                <option key={d.id} value={d.id}>
                  📍 {d.nameHi} ({d.name})
                </option>
              ))}
            </select>

            {/* Explicit Search Button as requested by user */}
            <button
              type="submit"
              className="w-full sm:w-auto bg-gov-navy hover:bg-slate-800 text-white font-bold text-xs sm:text-sm px-6 py-2.5 rounded-xl shadow flex items-center justify-center gap-2 transition-all shrink-0 cursor-pointer"
            >
              <Search className="w-4 h-4" />
              <span>{mTrans.searchBtn || "Search Location"}</span>
            </button>
          </form>

          {/* Quick Click District Pills */}
          <div className="mt-3.5 pt-3 border-t border-slate-100 flex items-center gap-1.5 flex-wrap">
            <span className="text-[11px] font-bold text-slate-500 mr-1">
              {lang === 'hi' ? "प्रमुख ग्रामीण जिले:" : lang === 'mr' ? "प्रमुख ग्रामीण जिल्हे:" : lang === 'bn' ? "প্রধান গ্রামীণ জেলা:" : lang === 'te' ? "ముఖ్య గ్రామీణ జిల్లాలు:" : "Popular Districts:"}
            </span>
            {mpDistrictsHyperlocal.map(dist => (
              <button
                key={dist.id}
                type="button"
                onClick={() => handleSelectDistrictPill(dist)}
                className={`text-[11px] font-semibold px-2.5 py-1 rounded-lg border transition-all cursor-pointer ${
                  activeDistrict.id === dist.id
                    ? 'bg-orange-600 text-white border-orange-600 shadow-xs'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
                }`}
              >
                {dist.nameHi}
              </button>
            ))}
          </div>

          {locationError && (
            <p className="text-[11px] text-amber-700 mt-2 font-medium">
              ℹ️ {locationError}
            </p>
          )}
        </div>

        {/* Area Overview Banner */}
        <div className="bg-gradient-to-r from-slate-900 via-gov-navy to-slate-900 text-white rounded-2xl p-5 sm:p-6 mb-6 shadow-md border border-slate-700 relative overflow-hidden">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="bg-orange-500 text-white text-[10px] font-black px-2.5 py-0.5 rounded uppercase tracking-wider">
                  {isMr ? "निवडलेल्या ग्रामीण भागाचा तपशील" : isHi ? "चयनित ग्रामीण क्षेत्र का विवरण" : "District Profile"}
                </span>
                <span className="text-xs text-orange-300 font-mono">
                  {activeDistrict.state}
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white mt-1">
                {activeDistrict.nameHi} ({activeDistrict.name})
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 mt-0.5 font-medium">
                {isMr ? (activeDistrict.overview.taglineMr || activeDistrict.overview.tagline) : isHi ? activeDistrict.overview.tagline : activeDistrict.overview.taglineEn}
              </p>
            </div>

            {/* Live Count Badges */}
            <div className="flex items-center gap-2.5 self-start md:self-auto">
              <div className="bg-white/10 border border-white/15 px-3 py-2 rounded-xl text-center">
                <span className="text-lg sm:text-xl font-black text-orange-400 block">
                  {filteredSkillCenters.length}
                </span>
                <span className="text-[10px] text-slate-300 uppercase font-semibold">
                  {isMr ? "कौशल्य केंद्रे" : isHi ? "कौशल केंद्र" : "Skill Centers"}
                </span>
              </div>
              <div className="bg-white/10 border border-white/15 px-3 py-2 rounded-xl text-center">
                <span className="text-lg sm:text-xl font-black text-emerald-400 block">
                  {filteredJobs.length}
                </span>
                <span className="text-[10px] text-slate-300 uppercase font-semibold">
                  {isMr ? "उपलब्ध रोजगार" : isHi ? "उपलब्ध रोजगार" : "Open Vacancies"}
                </span>
              </div>
            </div>
          </div>

          {/* 4 Demographics & Livelihood Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs border-t border-slate-700/80 pt-3.5 mb-3.5">
            <div className="bg-white/5 p-2.5 rounded-lg border border-white/10">
              <span className="text-slate-400 text-[10px] block">{isMr ? "ग्रामीण लोकसंख्या" : isHi ? "ग्रामीण आबादी" : "Rural Population"}</span>
              <span className="font-extrabold text-amber-300 text-sm">{activeDistrict.overview.ruralPct}%</span>
            </div>
            <div className="bg-white/5 p-2.5 rounded-lg border border-white/10">
              <span className="text-slate-400 text-[10px] block">{isMr ? "आदिवासी लोकसंख्या" : isHi ? "जनजातीय आबादी" : "Tribal Population"}</span>
              <span className="font-extrabold text-amber-300 text-sm">{activeDistrict.overview.tribalPct}%</span>
            </div>
            <div className="bg-white/5 p-2.5 rounded-lg border border-white/10">
              <span className="text-slate-400 text-[10px] block">{isMr ? "साक्षरता दर" : isHi ? "साक्षरता दर" : "Literacy Rate"}</span>
              <span className="font-extrabold text-amber-300 text-sm">{activeDistrict.overview.literacyPct}%</span>
            </div>
            <div className="bg-white/5 p-2.5 rounded-lg border border-white/10">
              <span className="text-slate-400 text-[10px] block">{isMr ? "एकूण ग्रामपंचायती / गावे" : isHi ? "कुल ग्राम पंचायतें / गांव" : "Total Villages"}</span>
              <span className="font-extrabold text-emerald-300 text-sm">{activeDistrict.overview.totalVillages}</span>
            </div>
          </div>

          {/* Major Crops & Schemes Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px] text-slate-300 bg-black/25 p-3 rounded-xl border border-white/10">
            <div>
              <span className="font-bold text-amber-300">{isMr ? "प्रमुख पिके आणि उपजीविका: " : isHi ? "प्रमुख फसलें व आजीविका: " : "Major Crops: "}</span>
              <span>{activeDistrict.overview.majorCrops}</span>
            </div>
            <div className="flex items-center gap-1.5 flex-wrap">
              {activeDistrict.overview.activeSchemes.map((scm, idx) => (
                <span key={idx} className="bg-orange-500/20 text-orange-200 border border-orange-400/30 px-2 py-0.5 rounded font-medium text-[10px]">
                  ✓ {scm}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Sector Filter Bar */}
        <div className="bg-white rounded-xl p-2.5 border border-slate-200 mb-3 flex items-center justify-between gap-2 flex-wrap shadow-2xs">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
            <span>🎯</span>
            <span>{lang === 'hi' ? "क्षेत्र फ़िल्टर:" : lang === 'mr' ? "क्षेत्र फिल्टर:" : lang === 'bn' ? "ক্ষেত্র ফিল্টার:" : lang === 'te' ? "రంగాల వారీగా:" : "Filter by Sector:"}</span>
          </div>
          <div className="flex items-center gap-1.5 flex-wrap">
            {[
              { id: 'all', label: mTrans.sectors?.all || "All Sectors" },
              { id: 'drone_agri', label: mTrans.sectors?.drone_agri || "Agri & Drone" },
              { id: 'solar', label: mTrans.sectors?.solar || "Solar & Energy" },
              { id: 'dairy', label: mTrans.sectors?.dairy || "Dairy & Livestock" },
              { id: 'crafts', label: mTrans.sectors?.crafts || "Crafts & Handloom" }
            ].map(sec => (
              <button
                key={sec.id}
                onClick={() => setSelectedSector(sec.id)}
                className={`text-xs px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                  selectedSector === sec.id
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200'
                }`}
              >
                {sec.label}
              </button>
            ))}
          </div>
        </div>

        {/* Map View Mode & Satellite Switcher Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mb-3 bg-white p-3 rounded-xl border border-slate-200 shadow-xs">
          {/* View Mode Buttons (Skill Centers vs Jobs vs Both) */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            {/* 1. Skill Centers Toggle */}
            <button
              onClick={() => {
                setMapViewMode('centers');
                setActiveListTab('centers');
              }}
              className={`flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                mapViewMode === 'centers'
                  ? 'bg-orange-600 text-white shadow-md'
                  : 'bg-orange-50 hover:bg-orange-100 text-orange-950 border border-orange-200'
              }`}
            >
              <span>🎓</span>
              <span>{mTrans.showCenters || "Skill Centers"}</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-extrabold ${mapViewMode === 'centers' ? 'bg-white text-orange-700' : 'bg-orange-200 text-orange-900'}`}>
                {filteredSkillCenters.length}
              </span>
            </button>

            {/* 2. Jobs Toggle */}
            <button
              onClick={() => {
                setMapViewMode('jobs');
                setActiveListTab('jobs');
              }}
              className={`flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                mapViewMode === 'jobs'
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-950 border border-emerald-200'
              }`}
            >
              <span>💼</span>
              <span>{mTrans.showJobs || "Rural Jobs"}</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-extrabold ${mapViewMode === 'jobs' ? 'bg-white text-emerald-700' : 'bg-emerald-200 text-emerald-900'}`}>
                {filteredJobs.length}
              </span>
            </button>

            {/* 3. Both Toggle */}
            <button
              onClick={() => setMapViewMode('both')}
              className={`hidden md:flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                mapViewMode === 'both'
                  ? 'bg-gov-navy text-white shadow-md'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>{mTrans.showBoth || "View Both"}</span>
            </button>
          </div>
        </div>

        {/* Focused Center Proximity Linkage Notification */}
        {focusedCenter && (
          <div className="mb-3 bg-gradient-to-r from-orange-50 via-amber-50 to-emerald-50 border-2 border-orange-300 rounded-xl p-3 flex items-center justify-between gap-3 text-xs animate-fadeIn">
            <div className="flex items-center gap-2">
              <span className="text-base">📍</span>
              <div>
                <span className="font-extrabold text-orange-950 block">
                  {focusedCenter.nameHi || focusedCenter.name} ({focusedCenter.village})
                </span>
                <span className="text-slate-600 text-[11px]">
                  {isMr
                    ? `या केंद्राच्या २५ किमी परिसरात ${filteredJobs.length} स्थानिक रोजगार उपलब्ध आहेत.`
                    : isHi 
                    ? `इस केंद्र के 25 किमी के दायरे में ${filteredJobs.length} ग्रामीण रोजगार उपलब्ध हैं।`
                    : `${filteredJobs.length} local jobs linked within 25 km catchment area.`}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => openGoogleMaps(focusedCenter.lat, focusedCenter.lng, focusedCenter.nameHi || focusedCenter.name)}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-[11px] px-3 py-1.5 rounded-lg shadow-xs flex items-center gap-1 cursor-pointer"
              >
                🧭 {isMr ? "मार्ग पहा" : isHi ? "रास्ता देखें" : "Navigate"}
              </button>
              <button
                onClick={() => setFocusedCenter(null)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>
          </div>
        )}

        {/* Interactive Leaflet Map Box with 3D Teardrop Pins */}
        <div className="bg-white rounded-2xl p-2 sm:p-3 shadow-md border-2 border-slate-200 mb-8 relative">
          <div
            ref={mapContainerRef}
            className="w-full h-[400px] sm:h-[480px] rounded-xl z-0"
            style={{ minHeight: '400px' }}
          />

          {/* Map Legend Overlay with 3D Pin representation */}
          <div className="absolute bottom-6 left-6 z-10 bg-white/95 backdrop-blur-xs p-3 rounded-xl shadow-xl border border-slate-200 text-[11px] space-y-1.5 pointer-events-auto">
            <span className="font-extrabold text-slate-900 block text-[10px] uppercase tracking-wider">
              {isMr ? "3D नकाशा निर्देशक (Pins):" : isHi ? "3D मैप संकेतक (Pins):" : "Map Pins Legend:"}
            </span>
            <div className="flex items-center gap-2 text-slate-800">
              <div style={{ width: 14, height: 18, background: '#ea580c', borderRadius: '50% 50% 50% 0', transform: 'rotate(-45deg)', display: 'inline-block' }} />
              <span><b>{isMr ? "कौशल्य केंद्र (KVK/PMKK)" : isHi ? "कौशल केंद्र (KVK/PMKK)" : "Skill Center Pin"}</b></span>
            </div>
            <div className="flex items-center gap-2 text-slate-800">
              <div style={{ width: 14, height: 18, background: '#059669', borderRadius: '50% 50% 50% 0', transform: 'rotate(-45deg)', display: 'inline-block' }} />
              <span><b>{isMr ? "ग्रामीण रोजगार (Job Vacancy)" : isHi ? "ग्रामीण रोजगार (Job Vacancy)" : "Rural Job Pin"}</b></span>
            </div>
            {userLocation && (
              <div className="flex items-center gap-2 text-slate-800">
                <span className="w-3.5 h-3.5 rounded-full bg-blue-600 border-2 border-white inline-block shrink-0 shadow-2xs animate-pulse" />
                <span>{isMr ? "तुमचे स्थान (GPS)" : isHi ? "आपकी लोकेशन (GPS)" : "Your Location (GPS)"}</span>
              </div>
            )}
          </div>
        </div>

        {/* Detailed Rural Listings Section with Tabs */}
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3 flex-wrap gap-2">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setActiveListTab('centers')}
                className={`text-sm sm:text-base font-extrabold pb-1 border-b-2 transition-all cursor-pointer ${
                  activeListTab === 'centers'
                    ? 'text-orange-600 border-orange-600'
                    : 'text-slate-500 border-transparent hover:text-slate-800'
                }`}
              >
                🎓 {isMr ? `कौशल्य प्रशिक्षण केंद्रे (${filteredSkillCenters.length})` : isHi ? `कौशल प्रशिक्षण केंद्र (${filteredSkillCenters.length})` : `Skill Centers (${filteredSkillCenters.length})`}
              </button>

              <button
                onClick={() => setActiveListTab('jobs')}
                className={`text-sm sm:text-base font-extrabold pb-1 border-b-2 transition-all cursor-pointer ${
                  activeListTab === 'jobs'
                    ? 'text-emerald-600 border-emerald-600'
                    : 'text-slate-500 border-transparent hover:text-slate-800'
                }`}
              >
                💼 {isMr ? `उपलब्ध ग्रामीण रोजगार (${filteredJobs.length})` : isHi ? `उपलब्ध ग्रामीण रोजगार (${filteredJobs.length})` : `Rural Vacancies (${filteredJobs.length})`}
              </button>
            </div>

            <span className="text-xs text-slate-500 font-medium">
              📍 {isMr ? `${activeDistrict.nameHi} च्या ग्रामीण भागातील पडताळणी प्रमाणित` : isHi ? `${activeDistrict.nameHi} के ग्रामीण अंचलों में सत्यापन प्रमाणित` : `Verified in rural zones of ${activeDistrict.name}`}
            </span>
          </div>

          {/* TAB 1: Skill Centers List */}
          {activeListTab === 'centers' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredSkillCenters.map(center => {
                const distKm = userLocation
                  ? calculateHaversineDistance(userLocation.lat, userLocation.lng, center.lat, center.lng)
                  : null;

                return (
                  <div
                    key={center.id}
                    className={`bg-white rounded-2xl border p-4 shadow-xs hover:shadow-md transition-all flex flex-col justify-between ${
                      focusedCenter?.id === center.id ? 'border-orange-500 ring-2 ring-orange-200' : 'border-slate-200 hover:border-orange-300'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-orange-100 text-orange-900 border border-orange-200">
                          {center.type}
                        </span>
                        {distKm !== null && (
                          <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                            🚗 {distKm} {isMr ? "किमी अंतरावर" : isHi ? "किमी दूर" : "km away"}
                          </span>
                        )}
                      </div>

                      <h3 className="font-extrabold text-sm sm:text-base text-slate-900 leading-snug">
                        {isMr ? (center.nameMr || center.nameHi || center.name) : (center.nameHi || center.name)}
                      </h3>

                      <div className="text-xs text-slate-600 mt-1 flex items-start gap-1 font-medium">
                        <MapPin className="w-3.5 h-3.5 text-orange-600 shrink-0 mt-0.5" />
                        <span><b>{center.village}</b>, {center.block}</span>
                      </div>

                      <p className="text-[11px] text-slate-500 mt-1">
                        {center.address}
                      </p>

                      <div className="mt-3 pt-2.5 border-t border-slate-100 space-y-1.5 text-xs">
                        <div className="text-[11px] font-bold text-slate-700">
                          {isMr ? "सक्रिय एनएसक्यूएफ अभ्यासक्रम:" : isHi ? "सक्रिय एनएसक्यूएफ पाठ्यक्रम:" : "Key NSQF Courses:"}
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {center.courses.map((crs, i) => (
                            <span key={i} className="bg-slate-100 text-slate-800 text-[10px] font-semibold px-2 py-0.5 rounded">
                              • {crs}
                            </span>
                          ))}
                        </div>

                        <div className="flex items-center justify-between text-[11px] font-semibold text-slate-600 pt-1">
                          <span className="text-emerald-700 font-bold">💰 {center.stipend}</span>
                          <span>⏱️ {center.duration}</span>
                        </div>

                        <div className="text-[10px] text-purple-700 font-semibold">
                          🏠 {center.boarding}
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-100 space-y-2">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleFlyToLocation(center, 'center')}
                          className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold py-2 rounded-xl transition-all flex items-center justify-center gap-1 cursor-pointer"
                        >
                          <MapPin className="w-3.5 h-3.5 text-orange-600" />
                          <span>{isMr ? "नकाशावर पहा" : isHi ? "मैप पर देखें" : "View Pin"}</span>
                        </button>

                        <button
                          onClick={() => openGoogleMaps(center.lat, center.lng, center.nameHi || center.name)}
                          className="bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 text-xs font-bold py-2 px-2.5 rounded-xl transition-all flex items-center justify-center gap-1 cursor-pointer"
                          title="दिशा-निर्देश देखें"
                        >
                          🧭 <span>{isMr ? "दिशा-निर्देश" : isHi ? "दिशा-निर्देश" : "Directions"}</span>
                        </button>
                      </div>

                      <button
                        onClick={() => handleOpenBooking(center, 'center')}
                        className="w-full bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold py-2 rounded-xl transition-all flex items-center justify-center gap-1 shadow cursor-pointer"
                      >
                        <GraduationCap className="w-3.5 h-3.5" />
                        <span>{isMr ? "मोफत जागा आरक्षित करा" : isHi ? "निःशुल्क सीट बुक करें" : "Book Free Seat"}</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* TAB 2: Rural Jobs List */}
          {activeListTab === 'jobs' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredJobs.map(job => {
                const distKm = userLocation
                  ? calculateHaversineDistance(userLocation.lat, userLocation.lng, job.lat, job.lng)
                  : null;

                return (
                  <div
                    key={job.id}
                    className="bg-white rounded-2xl border border-slate-200 hover:border-emerald-300 p-4 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-emerald-100 text-emerald-900 border border-emerald-200">
                          {job.vacancies} {isMr ? "जागा रिक्त उपलब्ध" : isHi ? "रिक्तियां उपलब्ध" : "Vacancies"}
                        </span>
                        {distKm !== null && (
                          <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                            🚗 {distKm} {isMr ? "किमी अंतरावर" : isHi ? "किमी दूर" : "km away"}
                          </span>
                        )}
                      </div>

                      <h3 className="font-extrabold text-sm sm:text-base text-slate-900 leading-snug">
                        {isMr ? (job.titleMr || job.titleHi || job.title) : (job.titleHi || job.title)}
                      </h3>

                      <div className="text-emerald-700 font-extrabold text-sm mt-0.5">
                        {job.salary}
                      </div>

                      <div className="text-xs text-slate-700 mt-2 font-semibold">
                        🏢 {job.employer}
                      </div>

                      <div className="text-xs text-slate-600 mt-0.5 flex items-start gap-1 font-medium">
                        <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span><b>{job.village}</b>, {job.block}</span>
                      </div>

                      <div className="mt-3 pt-2.5 border-t border-slate-100 space-y-1 text-xs">
                        <div className="text-[11px] text-slate-700">
                          <b>{isMr ? "पात्रता:" : isHi ? "पात्रता:" : "Eligibility:"}</b> {job.eligibility}
                        </div>
                        <div className="text-[10px] text-emerald-800 font-semibold">
                          🎁 {job.perks}
                        </div>
                        <div className="text-[10px] text-slate-500">
                          👤 {job.contactPerson} ({job.phone})
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-100 space-y-2">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleFlyToLocation(job, 'job')}
                          className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold py-2 rounded-xl transition-all flex items-center justify-center gap-1 cursor-pointer"
                        >
                          <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                          <span>{isMr ? "नकाशावर पहा" : isHi ? "मैप पर देखें" : "View Pin"}</span>
                        </button>

                        <button
                          onClick={() => openGoogleMaps(job.lat, job.lng, job.titleHi || job.title)}
                          className="bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 text-xs font-bold py-2 px-2.5 rounded-xl transition-all flex items-center justify-center gap-1 cursor-pointer"
                          title="दिशा-निर्देश देखें"
                        >
                          🧭 <span>{isMr ? "दिशा-निर्देश" : isHi ? "दिशा-निर्देश" : "Directions"}</span>
                        </button>
                      </div>

                      <button
                        onClick={() => handleOpenBooking(job, 'job')}
                        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold py-2 rounded-xl transition-all flex items-center justify-center gap-1 shadow cursor-pointer"
                      >
                        <Briefcase className="w-3.5 h-3.5" />
                        <span>{isMr ? "थेट अर्ज करा" : isHi ? "सीधा आवेदन करें" : "Apply Now"}</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Booking / Application Modal */}
        {bookingModal.isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs animate-fadeIn">
            <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
              
              {/* Modal Header */}
              <div className={`text-white px-5 py-3.5 flex items-center justify-between ${
                bookingModal.type === 'center' ? 'bg-orange-600' : 'bg-emerald-700'
              }`}>
                <div className="flex items-center gap-2 font-bold text-sm sm:text-base">
                  {bookingModal.type === 'center' ? <GraduationCap className="w-5 h-5" /> : <Briefcase className="w-5 h-5" />}
                  <span>
                    {bookingModal.type === 'center' 
                      ? (isMr ? "मोफत प्रशिक्षण समुपदेशन जागा आरक्षण" : isHi ? "निःशुल्क प्रशिक्षण परामर्श सीट आरक्षण" : "Book Free Training Counseling Seat")
                      : (isMr ? "ग्रामीण रोजगारासाठी थेट अर्ज" : isHi ? "ग्रामीण रोजगार हेतु सीधा आवेदन" : "Direct Job Application")}
                  </span>
                </div>
                <button
                  onClick={() => setBookingModal(prev => ({ ...prev, isOpen: false, confirmedRef: null }))}
                  className="text-white hover:text-slate-200 p-1 text-xl font-bold cursor-pointer"
                >
                  ✕
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-5">
                {bookingModal.confirmedRef ? (
                  <div className="text-center py-4 space-y-3">
                    <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-xs">
                      <Check className="w-8 h-8 stroke-[3]" />
                    </div>
                    <h3 className="text-lg font-extrabold text-slate-900">
                      {bookingModal.type === 'center' 
                        ? (mTrans.modalConfirmed || "Seat Successfully Reserved!")
                        : (mTrans.modalConfirmed || "Application Successfully Submitted!")}
                    </h3>
                    <p className="text-xs text-slate-600 max-w-xs mx-auto">
                      {mTrans.modalRefId || "Reference ID:"} {bookingModal.confirmedRef.id}
                    </p>
                    <div className="bg-slate-50 border border-slate-200 p-3 rounded-xl text-xs font-mono font-bold text-slate-800">
                      ID: {bookingModal.confirmedRef.id} • {bookingModal.confirmedRef.time}
                    </div>
                    <button
                      onClick={() => setBookingModal(prev => ({ ...prev, isOpen: false, confirmedRef: null }))}
                      className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-2.5 rounded-xl text-xs transition-all cursor-pointer"
                    >
                      {t?.common?.close || "Close"}
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleConfirmBooking} className="space-y-3.5">
                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs">
                      <span className="text-slate-500 block text-[10px] uppercase font-bold">
                        {bookingModal.type === 'center' ? (mTrans.showCenters || "Center:") : (mTrans.showJobs || "Job:")}
                      </span>
                      <span className="font-extrabold text-slate-900 block text-sm">
                        {bookingModal.item?.nameHi || bookingModal.item?.titleHi || bookingModal.item?.name || bookingModal.item?.title}
                      </span>
                      <span className="text-slate-600 text-[11px] block mt-0.5">
                        📍 {bookingModal.item?.village}, {bookingModal.item?.block}
                      </span>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        {mTrans.applicantName || "Applicant Name"}:
                      </label>
                      <input
                        type="text"
                        required
                        value={bookingModal.userName}
                        onChange={(e) => setBookingModal(prev => ({ ...prev, userName: e.target.value }))}
                        placeholder="e.g. Ramesh Kumar"
                        className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs sm:text-sm focus:ring-2 focus:ring-orange-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        {mTrans.applicantMobile || "Mobile Number"}:
                      </label>
                      <input
                        type="tel"
                        required
                        pattern="[0-9]{10}"
                        value={bookingModal.userPhone}
                        onChange={(e) => setBookingModal(prev => ({ ...prev, userPhone: e.target.value }))}
                        placeholder="10-digit mobile"
                        className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs sm:text-sm focus:ring-2 focus:ring-orange-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        {mTrans.preferredDate || "Preferred Date"}:
                      </label>
                      <input
                        type="date"
                        required
                        value={bookingModal.preferredDate}
                        onChange={(e) => setBookingModal(prev => ({ ...prev, preferredDate: e.target.value }))}
                        className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs sm:text-sm focus:ring-2 focus:ring-orange-500 focus:outline-none"
                      />
                    </div>

                    <button
                      type="submit"
                      className={`w-full text-white font-bold py-3 rounded-xl text-xs sm:text-sm shadow transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                        bookingModal.type === 'center'
                          ? 'bg-orange-600 hover:bg-orange-700'
                          : 'bg-emerald-600 hover:bg-emerald-700'
                      }`}
                    >
                      <CheckCircle className="w-4 h-4" />
                      <span>
                        {bookingModal.type === 'center' 
                          ? (mTrans.bookSeat || "Confirm Seat Reservation")
                          : (mTrans.applyJob || "Submit Job Application")}
                      </span>
                    </button>
                  </form>
                )}
              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
}
