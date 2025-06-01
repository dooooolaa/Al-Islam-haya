import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Compass, AlertTriangle, LocateFixed, Info } from 'lucide-react';
import { Coordinates } from 'adhan';
import LoadingSpinner from '../../components/shared/LoadingSpinner';
import ErrorMessage from '../../components/shared/ErrorMessage';
import React from 'react';

interface QiblaDirection {
  latitude: number;
  longitude: number;
  qiblaDirection: number;
}

const KAABA_COORDINATES = new Coordinates(21.422487, 39.826206);

const QiblaPage = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [qiblaData, setQiblaData] = useState<QiblaDirection | null>(null);
  const [compassHeading, setCompassHeading] = useState<number | null>(null);
  const [permissionDenied, setPermissionDenied] = useState(false);
  const [deviceHasCompass, setDeviceHasCompass] = useState(true);
  const compassRef = useRef<HTMLDivElement>(null);
  const qiblaArrowRef = useRef<HTMLDivElement>(null);

  const handleDeviceOrientation = (event: DeviceOrientationEvent) => {
    let heading: number | null = null;
    
    if ('webkitCompassHeading' in event) {
      // iOS devices
      heading = (event as any).webkitCompassHeading;
    } else if (event.absolute && event.alpha !== null) {
      // Android devices
      heading = 360 - event.alpha;
    } else if (event.alpha !== null) {
      // Fallback for other devices
      heading = 360 - event.alpha;
    }

    if (heading !== null) {
      setCompassHeading(heading);
      
      if (compassRef.current) {
        // Rotate the compass to show true north
        compassRef.current.style.transform = `rotate(${-heading}deg)`; // Rotate opposite to heading
      }
      
      // Update Qibla arrow if we have qibla data
      if (qiblaData && qiblaArrowRef.current) {
        // Calculate the relative angle to Qibla based on device orientation
        const relativeQiblaAngle = qiblaData.qiblaDirection - heading;
        qiblaArrowRef.current.style.transform = `rotate(${relativeQiblaAngle}deg)`;
      }
    }
  };

  const requestOrientationPermission = async () => {
    if (typeof (DeviceOrientationEvent as any).requestPermission === 'function') {
      try {
        const permission = await (DeviceOrientationEvent as any).requestPermission();
        if (permission === 'granted') {
          setPermissionDenied(false);
          window.addEventListener('deviceorientationabsolute', handleDeviceOrientation, true);
          window.addEventListener('deviceorientation', handleDeviceOrientation, true);
        } else {
          setPermissionDenied(true);
        }
      } catch (err) {
        console.error('Error requesting device orientation permission:', err);
        setPermissionDenied(true);
      }
    }
  };

  useEffect(() => {
    // Check if device has orientation sensors
    const hasOrientationSensor = 'DeviceOrientationEvent' in window;
    setDeviceHasCompass(hasOrientationSensor);
    
    const getLocationAndOrientation = async () => {
       // Request orientation permission first (important for iOS)
      if (typeof (DeviceOrientationEvent as any).requestPermission === 'function') {
         await requestOrientationPermission();
      } else if (hasOrientationSensor) {
         // If no explicit permission needed but sensor exists, add listener directly
         window.addEventListener('deviceorientationabsolute', handleDeviceOrientation, true);
         window.addEventListener('deviceorientation', handleDeviceOrientation, true);
      }

      // Then get location
      getLocation();
    };

    getLocationAndOrientation();

    return () => {
      window.removeEventListener('deviceorientationabsolute', handleDeviceOrientation, true);
      window.removeEventListener('deviceorientation', handleDeviceOrientation, true);
    };
  }, []); // Empty dependency array means this runs once on mount

  const calculateQiblaDirection = (latitude: number, longitude: number): number => {
    // Convert coordinates to radians
    const lat1 = latitude * (Math.PI / 180);
    const lon1 = longitude * (Math.PI / 180);
    const lat2 = KAABA_COORDINATES.latitude * (Math.PI / 180);
    const lon2 = KAABA_COORDINATES.longitude * (Math.PI / 180);

    // Calculate the qibla direction using the great circle formula
    const y = Math.sin(lon2 - lon1);
    const x = Math.cos(lat1) * Math.tan(lat2) - Math.sin(lat1) * Math.cos(lon2 - lon1);
    let qiblaDirection = Math.atan2(y, x) * (180 / Math.PI);
    
    // Normalize to 0-360 degrees
    qiblaDirection = (qiblaDirection + 360) % 360;
    
    return qiblaDirection;
  };

  const handlePositionSuccess = (position: GeolocationPosition) => {
    const { latitude, longitude } = position.coords;
    
    // Calculate Qibla direction using our own implementation
    const qiblaDirection = calculateQiblaDirection(latitude, longitude);
    
    setQiblaData({
      latitude,
      longitude,
      qiblaDirection
    });
    setLoading(false);
  };

  const handlePositionError = (err: GeolocationPositionError) => {
    setLoading(false);
    
    switch (err.code) {
      case 1: // PERMISSION_DENIED
        setError('تم رفض إذن الموقع. يرجى السماح بالوصول إلى موقعك في إعدادات المتصفح لتحديد اتجاه القبلة.');
        break;
      case 2: // POSITION_UNAVAILABLE
        setError('تعذر تحديد موقعك الحالي. يرجى التأكد من تفعيل خدمة تحديد الموقع في جهازك والمحاولة مرة أخرى.');
        break;
      case 3: // TIMEOUT
        setError('انتهت مهلة تحديد الموقع. يرجى التحقق من اتصال الإنترنت والمحاولة مرة أخرى.');
        break;
      default:
        setError('حدث خطأ غير متوقع أثناء تحديد موقعك. يرجى المحاولة مرة أخرى.');
        break;
    }
  };

  const getLocation = () => {
    if (!navigator.geolocation) {
      setError('متصفحك لا يدعم تحديد الموقع الجغرافي. يرجى تحديث المتصفح أو استخدام متصفح آخر.');
      return;
    }

    setLoading(true);
    setError(null);
    
    const options = {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0
    };

    navigator.geolocation.getCurrentPosition(
      handlePositionSuccess,
      handlePositionError,
      options
    );
  };

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
              <Compass className="text-light-accent dark:text-dark-accent h-16 w-16 mb-4" />
              <h2 className="text-2xl font-bold mb-6">تحديد اتجاه القبلة</h2>
              
              {!loading && !qiblaData && !error && (
                <p className="mb-6 text-gray-600 dark:text-gray-400">
                  قم بالسماح بالوصول إلى موقعك لتحديد اتجاه القبلة بدقة
                </p>
              )}
              
              {loading && (
                <div className="my-8">
                  <LoadingSpinner size="lg" />
                  <p className="mt-4 text-gray-600 dark:text-gray-400">جاري تحديد اتجاه القبلة...</p>
                </div>
              )}
              
              {error && (
                <div className="mb-6">
                  <ErrorMessage message={error} retry={getLocation} />
                </div>
              )}
              
              {permissionDenied && deviceHasCompass && (
                <div className="mb-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-300 rounded-md">
                  <div className="flex">
                    <AlertTriangle className="h-5 w-5 ml-2 flex-shrink-0" />
                    <div>
                      <p className="font-medium">تم رفض إذن الوصول إلى اتجاه الجهاز</p>
                      <p className="mt-1 text-sm">يرجى السماح بالوصول لاستخدام البوصلة</p>
                      <button
                        onClick={requestOrientationPermission}
                        className="mt-2 px-3 py-1 text-sm bg-yellow-100 dark:bg-yellow-800 rounded"
                      >
                        طلب الإذن مرة أخرى
                      </button>
                    </div>
                  </div>
                </div>
              )}
              
              {!deviceHasCompass && qiblaData && (
                <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300 rounded-md">
                  <div className="flex">
                    <Info className="h-5 w-5 ml-2 flex-shrink-0" />
                    <div>
                      <p className="font-medium">جهازك لا يدعم البوصلة</p>
                      <p className="mt-1 text-sm">
                        يمكنك استخدام اتجاه القبلة المعروض ({Math.round(qiblaData.qiblaDirection)}°) كمرجع مع بوصلة خارجية
                      </p>
                    </div>
                  </div>
                </div>
              )}
              
              {qiblaData && (
                <div className="mb-8">
                  <div className="relative w-64 h-64 mx-auto mb-6">
                    {/* Compass background */}
                    <div 
                      className="w-full h-full rounded-full border-4 border-gray-300 dark:border-gray-700 flex items-center justify-center relative"
                    >
                      {/* Rotating compass */}
                      <div 
                        ref={compassRef}
                        className="w-full h-full absolute top-0 left-0 transition-transform duration-200"
                      >
                        {/* Cardinal directions */}
                        <div className="absolute top-2 left-1/2 -translate-x-1/2 font-bold text-red-600">N</div>
                        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 font-bold">S</div>
                        <div className="absolute top-1/2 right-2 -translate-y-1/2 font-bold">E</div>
                        <div className="absolute top-1/2 left-2 -translate-y-1/2 font-bold">W</div>
                        
                        {/* Compass rose */}
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-3/4 h-3/4 border-2 border-gray-300 dark:border-gray-700 rounded-full"></div>
                        </div>
                        
                        {/* Compass needle */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1 h-full">
                          <div className="w-1 h-1/2 bg-red-600"></div>
                          <div className="w-1 h-1/2 bg-gray-600 dark:bg-gray-400"></div>
                        </div>
                      </div>
                      
                      {/* Fixed Qibla direction arrow */}
                      <div 
                        ref={qiblaArrowRef}
                        className="absolute top-1/2 left-1/2 w-full h-full -translate-x-1/2 -translate-y-1/2 transition-transform duration-200"
                        style={{ transform: compassHeading ? `rotate(${qiblaData.qiblaDirection - compassHeading}deg)` : `rotate(${qiblaData.qiblaDirection}deg)` }}
                      >
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 h-1/2 flex flex-col items-center">
                          <div className="w-0 h-0 border-l-8 border-r-8 border-b-16 border-l-transparent border-r-transparent border-b-green-600 dark:border-b-green-500"></div>
                          <div className="h-[calc(100%-16px)] w-1.5 bg-green-600 dark:bg-green-500"></div>
                        </div>
                      </div>
                      
                      {/* Center dot */}
                      <div className="w-4 h-4 rounded-full bg-gray-800 dark:bg-gray-200 z-10"></div>
                    </div>
                  </div>
                  
                  <div className="text-center">
                    <p className="text-xl font-bold mb-2">
                      اتجاه القبلة: {Math.round(qiblaData.qiblaDirection)}°
                    </p>
                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                      {compassHeading !== null 
                        ? "قم بتوجيه السهم الأخضر نحو الكعبة المشرفة" 
                        : "استخدم بوصلة خارجية واتجه نحو الزاوية المعروضة"}
                    </p>
                    
                    {compassHeading === null && deviceHasCompass && (
                      <p className="text-yellow-600 dark:text-yellow-400 text-sm">
                        البوصلة غير متاحة. يرجى التأكد من تفعيل مستشعرات الجهاز.
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
            <p className="mb-4 text-gray-600 dark:text-gray-400">
              القبلة هي اتجاه الكعبة المشرفة في مكة المكرمة، وهي الاتجاه الذي يتجه إليه المسلمون في صلاتهم.
            </p>
            <p className="mb-4 text-gray-600 dark:text-gray-400">
              قال تعالى: ﴿فَوَلِّ وَجْهَكَ شَطْرَ الْمَسْجِدِ الْحَرَامِ وَحَيْثُ مَا كُنتُمْ فَوَلُّوا وُجُوهَكُمْ شَطْرَهُ﴾
            </p>
            <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-md">
              <p className="text-yellow-800 dark:text-yellow-300 text-sm">
                ملاحظة: تعتمد دقة تحديد اتجاه القبلة على دقة جهاز الاستشعار في جهازك ودقة تحديد الموقع.
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
