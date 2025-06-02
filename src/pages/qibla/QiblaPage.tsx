import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Compass, AlertTriangle, LocateFixed, Info } from 'lucide-react';
import LoadingSpinner from '../../components/shared/LoadingSpinner';
import ErrorMessage from '../../components/shared/ErrorMessage';

// إحداثيات الكعبة المشرفة
const KAABA_LAT = 21.422487;
const KAABA_LNG = 39.826206;

const QiblaPage = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [qiblaAngle, setQiblaAngle] = useState<number | null>(null);
  const [compassHeading, setCompassHeading] = useState<number | null>(null);
  const [permissionGranted, setPermissionGranted] = useState(false);
  const [deviceSupportsCompass, setDeviceSupportsCompass] = useState(true);
  const compassRef = useRef<HTMLDivElement>(null);
  const arrowRef = useRef<HTMLDivElement>(null);

  // دالة محسنة لحساب اتجاه القبلة
  const calculateQiblaDirection = (lat: number, lng: number): number => {
    const phiK = KAABA_LAT * Math.PI / 180.0;
    const lambdaK = KAABA_LNG * Math.PI / 180.0;
    const phi = lat * Math.PI / 180.0;
    const lambda = lng * Math.PI / 180.0;
    
    const psi = 180.0 / Math.PI * Math.atan2(
      Math.sin(lambdaK - lambda),
      Math.cos(phi) * Math.tan(phiK) - Math.sin(phi) * Math.cos(lambdaK - lambda)
    );
    
    return (psi + 360.0) % 360.0;
  };

  const handleDeviceOrientation = (event: DeviceOrientationEvent) => {
    let heading: number | null = null;
    
    // Handle iOS devices
    if ('webkitCompassHeading' in event) {
      heading = (event as any).webkitCompassHeading;
    } 
    // Handle Android and other devices
    else if (event.alpha !== null) {
      heading = event.alpha;
      
      // Adjust for device orientation
      if (typeof window.orientation !== 'undefined') {
        const orientation = window.orientation;
        if (orientation === 90) {
          heading = (heading + 270) % 360;
        } else if (orientation === -90) {
          heading = (heading + 90) % 360;
        } else if (orientation === 180) {
          heading = (heading + 180) % 360;
        }
      }
    }

    if (heading !== null) {
      setCompassHeading(heading);
      updateCompass(heading);
    }
  };

  const updateCompass = (heading: number) => {
    if (compassRef.current) {
      compassRef.current.style.transform = `rotate(${-heading}deg)`;
    }
    
    if (qiblaAngle !== null && arrowRef.current) {
      const relativeAngle = (qiblaAngle - heading + 360) % 360;
      arrowRef.current.style.transform = `rotate(${relativeAngle}deg)`;
    }
  };

  const requestCompassPermission = async () => {
    try {
      // For iOS 13+ devices
      if (typeof (DeviceOrientationEvent as any).requestPermission === 'function') {
        const permission = await (DeviceOrientationEvent as any).requestPermission();
        if (permission === 'granted') {
          setPermissionGranted(true);
          window.addEventListener('deviceorientation', handleDeviceOrientation);
        }
      } 
      // For other devices
      else if ('DeviceOrientationEvent' in window) {
        setPermissionGranted(true);
        window.addEventListener('deviceorientation', handleDeviceOrientation);
      } else {
        setDeviceSupportsCompass(false);
      }
    } catch (err) {
      console.error('Error requesting compass permission:', err);
      setDeviceSupportsCompass(false);
    }
  };

  const getLocation = () => {
    setLoading(true);
    setError(null);
    
    if (!navigator.geolocation) {
      setError('متصفحك لا يدعم خدمة تحديد الموقع');
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const angle = calculateQiblaDirection(
          position.coords.latitude,
          position.coords.longitude
        );
        setQiblaAngle(angle);
        setLoading(false);
      },
      (err) => {
        setLoading(false);
        switch (err.code) {
          case 1: setError('تم رفض إذن الوصول إلى الموقع'); break;
          case 2: setError('تعذر الحصول على الموقع'); break;
          case 3: setError('انتهت مهلة الحصول على الموقع'); break;
          default: setError('حدث خطأ أثناء تحديد الموقع');
        }
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  useEffect(() => {
    requestCompassPermission();
    return () => {
      window.removeEventListener('deviceorientation', handleDeviceOrientation);
    };
  }, []);

  return (
    <div className="container mx-auto p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-2xl font-bold text-center my-4">اتجاه القبلة</h1>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          {loading && (
            <div className="flex flex-col items-center">
              <LoadingSpinner size="lg" />
              <p className="mt-4 text-gray-600">جاري تحديد الاتجاه...</p>
            </div>
          )}
          
          {error && (
            <ErrorMessage message={error} retry={getLocation} />
          )}
          
          {!permissionGranted && deviceSupportsCompass && (
            <div className="bg-yellow-50 p-4 rounded-md mb-4 flex items-start">
              <AlertTriangle className="text-yellow-600 mt-1 mr-2" size={20} />
              <div>
                <p className="font-medium">يجب السماح بالوصول إلى البوصلة</p>
                <button 
                  onClick={requestCompassPermission}
                  className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded mt-2 text-sm"
                >
                  منح الإذن
                </button>
              </div>
            </div>
          )}
          
          {!deviceSupportsCompass && (
            <div className="bg-blue-50 p-4 rounded-md mb-4 flex items-start">
              <Info className="text-blue-600 mt-1 mr-2" size={20} />
              <p>جهازك لا يدعم البوصلة الداخلية</p>
            </div>
          )}
          
          {qiblaAngle !== null && (
            <div className="text-center">
              <div className="relative w-64 h-64 mx-auto my-6">
                {/* Compass Base */}
                <div className="w-full h-full rounded-full border-4 border-gray-200 bg-gray-50 relative">
                  {/* Rotating Compass */}
                  <div 
                    ref={compassRef}
                    className="w-full h-full absolute top-0 left-0 transition-transform duration-100"
                  >
                    {/* Cardinal Directions */}
                    <div className="absolute top-2 left-1/2 transform -translate-x-1/2 font-bold text-red-600">N</div>
                    <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 font-bold">S</div>
                    <div className="absolute left-2 top-1/2 transform -translate-y-1/2 font-bold">W</div>
                    <div className="absolute right-2 top-1/2 transform -translate-y-1/2 font-bold">E</div>
                    
                    {/* Compass Markings */}
                    {[...Array(8)].map((_, i) => (
                      <div 
                        key={i}
                        className="absolute top-0 left-1/2 w-px h-8 bg-gray-300 transform -translate-x-1/2"
                        style={{ transform: `rotate(${i * 45}deg) translateY(-50%)` }}
                      />
                    ))}
                  </div>
                  
                  {/* Qibla Arrow */}
                  <div 
                    ref={arrowRef}
                    className="absolute top-1/2 left-1/2 w-full h-full transform -translate-x-1/2 -translate-y-1/2"
                  >
                    <div className="absolute top-0 left-1/2 transform -translate-x-1/2 h-1/2 flex flex-col items-center">
                      <div className="w-0 h-0 border-l-8 border-r-8 border-b-16 border-l-transparent border-r-transparent border-b-green-500 mx-auto"></div>
                      <div className="h-[calc(100%-16px)] w-2 bg-green-500 mx-auto rounded-full"></div>
                    </div>
                  </div>
                  
                  {/* Center Dot */}
                  <div className="absolute top-1/2 left-1/2 w-4 h-4 bg-black rounded-full transform -translate-x-1/2 -translate-y-1/2 z-10"></div>
                </div>
              </div>
              
              <p className="text-xl font-bold my-2">
                اتجاه القبلة: {Math.round(qiblaAngle)}°
              </p>
              
              {compassHeading !== null ? (
                <p className="text-gray-600 text-sm mb-4">
                  قم بتوجيه السهم الأخضر نحو الكعبة المشرفة
                </p>
              ) : (
                <p className="text-gray-600 text-sm mb-4">
                  استخدم بوصلة خارجية واتجه نحو الزاوية المعروضة
                </p>
              )}
              
              <button
                onClick={getLocation}
                disabled={loading}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md mt-4 transition-colors flex items-center justify-center mx-auto"
              >
                <LocateFixed className="ml-2" size={18} />
                {qiblaAngle ? 'تحديث الموقع' : 'تحديد موقعي'}
              </button>
            </div>
          )}
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6 mt-4">
          <h3 className="text-xl font-bold mb-3">معلومات عن القبلة</h3>
          <p className="mb-3 text-gray-600">
            القبلة هي اتجاه الكعبة المشرفة في مكة المكرمة، وهي الاتجاه الذي يتجه إليه المسلمون في صلاتهم.
          </p>
          <p className="mb-3 text-gray-600">
            قال تعالى: ﴿فَوَلِّ وَجْهَكَ شَطْرَ الْمَسْجِدِ الْحَرَامِ وَحَيْثُ مَا كُنتُمْ فَوَلُّوا وُجُوهَكُمْ شَطْرَهُ﴾ [البقرة: 144]
          </p>
          <div className="bg-yellow-50 p-4 rounded-md">
            <p className="text-yellow-800 text-sm">
              للحصول على أفضل النتائج:
              <ul className="list-disc list-inside mt-1">
                <li>استخدم الجهاز في منطقة مفتوحة</li>
                <li>ابتعد عن المجالات المغناطيسية</li>
                <li>احمل الجهاز بشكل مسطح</li>
              </ul>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default QiblaPage;