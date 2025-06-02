import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Compass, AlertTriangle, LocateFixed, Info } from 'lucide-react';
import { Coordinates } from 'adhan';
import LoadingSpinner from '../../components/shared/LoadingSpinner';
import ErrorMessage from '../../components/shared/ErrorMessage';

const KAABA_COORDINATES = new Coordinates(21.422487, 39.826206);

interface QiblaDirection {
  latitude: number;
  longitude: number;
  qiblaDirection: number;
}

const QiblaPage = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [qiblaData, setQiblaData] = useState<QiblaDirection | null>(null);
  const [compassHeading, setCompassHeading] = useState<number | null>(null);
  const [permissionDenied, setPermissionDenied] = useState(false);
  const [deviceHasCompass, setDeviceHasCompass] = useState(true);
  const compassRef = useRef<HTMLDivElement>(null);
  const qiblaArrowRef = useRef<HTMLDivElement>(null);

  // دالة محسنة لحساب اتجاه القبلة
  const calculateQiblaDirection = (lat: number, lng: number): number => {
    const phiK = KAABA_COORDINATES.latitude * Math.PI / 180.0;
    const lambdaK = KAABA_COORDINATES.longitude * Math.PI / 180.0;
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
        } else if (orientation === -90 || orientation === 270) {
          heading = (heading + 90) % 360;
        } else if (orientation === 180) {
          heading = (heading + 180) % 360;
        }
      }
    }

    if (heading !== null) {
      setCompassHeading(heading);
      
      // Update compass and qibla arrow
      updateCompass(heading);
    }
  };

  const updateCompass = (heading: number) => {
    if (compassRef.current) {
      compassRef.current.style.transform = `rotate(${-heading}deg)`;
    }
    
    if (qiblaData && qiblaArrowRef.current) {
      const relativeAngle = (qiblaData.qiblaDirection - heading + 360) % 360;
      qiblaArrowRef.current.style.transform = `rotate(${relativeAngle}deg)`;
    }
  };

  const requestOrientationPermission = async () => {
    if (typeof (DeviceOrientationEvent as any).requestPermission === 'function') {
      try {
        const permission = await (DeviceOrientationEvent as any).requestPermission();
        if (permission === 'granted') {
          setPermissionDenied(false);
          startCompass();
        } else {
          setPermissionDenied(true);
        }
      } catch (err) {
        console.error('Error requesting permission:', err);
        setPermissionDenied(true);
      }
    } else {
      startCompass();
    }
  };

  const startCompass = () => {
    if ('DeviceOrientationEvent' in window) {
      window.addEventListener('deviceorientationabsolute', handleDeviceOrientation, true);
      window.addEventListener('deviceorientation', handleDeviceOrientation, true);
    } else {
      setDeviceHasCompass(false);
    }
  };

  const getLocation = () => {
    setLoading(true);
    setError(null);
    
    if (!navigator.geolocation) {
      setError('متصفحك لا يدعم تحديد الموقع الجغرافي');
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const qiblaDirection = calculateQiblaDirection(latitude, longitude);
        
        setQiblaData({
          latitude,
          longitude,
          qiblaDirection
        });
        setLoading(false);
      },
      (err) => {
        setLoading(false);
        switch (err.code) {
          case 1: setError('تم رفض إذن الموقع'); break;
          case 2: setError('تعذر تحديد الموقع'); break;
          case 3: setError('انتهت مهلة تحديد الموقع'); break;
          default: setError('حدث خطأ غير متوقع');
        }
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  useEffect(() => {
    requestOrientationPermission();
    return () => {
      window.removeEventListener('deviceorientationabsolute', handleDeviceOrientation, true);
      window.removeEventListener('deviceorientation', handleDeviceOrientation, true);
    };
  }, []);

  return (
    <div className="container-page">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="section-title">اتجاه القبلة</h1>
        
        <div className="max-w-xl mx-auto">
          <div className="card text-center mb-6">
            <div className="flex justify-center items-center flex-col">
              <Compass className="text-primary-500 h-16 w-16 mb-4" />
              <h2 className="text-2xl font-bold mb-6">تحديد اتجاه القبلة</h2>
              
              {loading && (
                <div className="my-8">
                  <LoadingSpinner size="lg" />
                  <p className="mt-4 text-gray-600">جاري تحديد اتجاه القبلة...</p>
                </div>
              )}
              
              {error && <ErrorMessage message={error} retry={getLocation} />}
              
              {permissionDenied && (
                <div className="mb-6 p-4 bg-yellow-50 text-yellow-800 rounded-md">
                  <div className="flex">
                    <AlertTriangle className="h-5 w-5 ml-2 flex-shrink-0" />
                    <div>
                      <p className="font-medium">تم رفض إذن الوصول إلى البوصلة</p>
                      <button
                        onClick={requestOrientationPermission}
                        className="mt-2 px-3 py-1 text-sm bg-yellow-100 rounded"
                      >
                        طلب الإذن مرة أخرى
                      </button>
                    </div>
                  </div>
                </div>
              )}
              
              {qiblaData && (
                <div className="mb-8">
                  <div className="relative w-64 h-64 mx-auto mb-6">
                    <div className="w-full h-full rounded-full border-4 border-gray-300 relative">
                      {/* Compass Background */}
                      <div ref={compassRef} className="w-full h-full absolute top-0 left-0 transition-transform">
                        {/* Compass Markings */}
                        <div className="absolute top-2 left-1/2 transform -translate-x-1/2 font-bold text-red-600">N</div>
                        <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 font-bold">S</div>
                        <div className="absolute top-1/2 right-2 transform -translate-y-1/2 font-bold">E</div>
                        <div className="absolute top-1/2 left-2 transform -translate-y-1/2 font-bold">W</div>
                      </div>
                      
                      {/* Qibla Arrow */}
                      <div 
                        ref={qiblaArrowRef}
                        className="absolute top-1/2 left-1/2 w-full h-full transform -translate-x-1/2 -translate-y-1/2"
                      >
                        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 h-1/2 flex flex-col items-center">
                          <div className="w-0 h-0 border-l-8 border-r-8 border-b-16 border-l-transparent border-r-transparent border-b-green-500"></div>
                          <div className="h-[calc(100%-16px)] w-1.5 bg-green-500"></div>
                        </div>
                      </div>
                      
                      {/* Center Dot */}
                      <div className="absolute top-1/2 left-1/2 w-4 h-4 rounded-full bg-gray-800 transform -translate-x-1/2 -translate-y-1/2 z-10"></div>
                    </div>
                  </div>
                  
                  <div className="text-center">
                    <p className="text-xl font-bold mb-2">
                      اتجاه القبلة: {Math.round(qiblaData.qiblaDirection)}°
                    </p>
                    <p className="text-gray-600 text-sm mb-4">
                      {compassHeading !== null 
                        ? "قم بتوجيه السهم الأخضر نحو الكعبة المشرفة" 
                        : "استخدم بوصلة خارجية واتجه نحو الزاوية المعروضة"}
                    </p>
                    
                    {!deviceHasCompass && (
                      <p className="text-yellow-600 text-sm">
                        ملاحظة: جهازك لا يدعم البوصلة الداخلية
                      </p>
                    )}
                  </div>
                </div>
              )}
              
              <button
                onClick={getLocation}
                disabled={loading}
                className="btn btn-primary flex items-center justify-center"
              >
                <LocateFixed className="ml-2" size={18} />
                {qiblaData ? 'تحديث الموقع' : 'تحديد موقعي'}
              </button>
            </div>
          </div>
          
          <div className="card">
            <h3 className="text-xl font-bold mb-4">معلومات عن القبلة</h3>
            <p className="mb-4 text-gray-600">
              القبلة هي اتجاه الكعبة المشرفة في مكة المكرمة، وهي الاتجاه الذي يتجه إليه المسلمون في صلاتهم.
            </p>
            <div className="bg-yellow-50 p-4 rounded-md">
              <p className="text-yellow-800 text-sm">
                للحصول على أفضل النتائج، استخدم الجهاز في منطقة مفتوحة بعيدة عن المجالات المغناطيسية.
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default QiblaPage;