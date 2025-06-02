import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Compass, AlertTriangle, LocateFixed, Info } from 'lucide-react';
import LoadingSpinner from '../../components/shared/LoadingSpinner';
import ErrorMessage from '../../components/shared/ErrorMessage';

const KAABA_LAT = 21.422487;
const KAABA_LNG = 39.826206;

const QiblaPage = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [qiblaAngle, setQiblaAngle] = useState<number | null>(null);
  const [compassHeading, setCompassHeading] = useState<number | null>(null);
  const [permissionGranted, setPermissionGranted] = useState(false);
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
    if (event.alpha !== null) {
      let heading = event.alpha;
      
      // تعديل حسب اتجاه الجهاز
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
      if (typeof (DeviceOrientationEvent as any).requestPermission === 'function') {
        const permission = await (DeviceOrientationEvent as any).requestPermission();
        if (permission === 'granted') {
          setPermissionGranted(true);
          window.addEventListener('deviceorientation', handleDeviceOrientation);
        }
      } else {
        setPermissionGranted(true);
        window.addEventListener('deviceorientation', handleDeviceOrientation);
      }
    } catch (err) {
      console.error('فشل في طلب الإذن:', err);
    }
  };

  const getLocation = () => {
    setLoading(true);
    setError(null);
    
    if (!navigator.geolocation) {
      setError('المتصفح لا يدعم خدمة الموقع');
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
        setError('فشل في تحديد الموقع: ' + err.message);
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
          {loading && <LoadingSpinner size="lg" />}
          
          {error && <ErrorMessage message={error} retry={getLocation} />}
          
          {!permissionGranted && (
            <div className="bg-yellow-50 p-4 rounded-md mb-4">
              <p>يجب السماح بالوصول إلى البوصلة</p>
              <button 
                onClick={requestCompassPermission}
                className="bg-yellow-100 px-3 py-1 rounded mt-2"
              >
                منح الإذن
              </button>
            </div>
          )}
          
          {qiblaAngle !== null && (
            <div className="text-center">
              <div className="relative w-64 h-64 mx-auto my-6">
                <div 
                  ref={compassRef}
                  className="w-full h-full rounded-full border-4 border-gray-200 bg-gray-50 relative"
                >
                  <div className="absolute top-2 left-1/2 transform -translate-x-1/2 font-bold">N</div>
                  <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 font-bold">S</div>
                  <div className="absolute left-2 top-1/2 transform -translate-y-1/2 font-bold">W</div>
                  <div className="absolute right-2 top-1/2 transform -translate-y-1/2 font-bold">E</div>
                  
                  <div 
                    ref={arrowRef}
                    className="absolute top-1/2 left-1/2 w-full h-full transform -translate-x-1/2 -translate-y-1/2"
                  >
                    <div className="absolute top-0 left-1/2 transform -translate-x-1/2 h-1/2">
                      <div className="w-0 h-0 border-l-8 border-r-8 border-b-16 border-l-transparent border-r-transparent border-b-green-500 mx-auto"></div>
                      <div className="w-1.5 h-full bg-green-500 mx-auto"></div>
                    </div>
                  </div>
                  
                  <div className="absolute top-1/2 left-1/2 w-3 h-3 bg-black rounded-full transform -translate-x-1/2 -translate-y-1/2"></div>
                </div>
              </div>
              
              <p className="text-xl font-bold my-2">
                اتجاه القبلة: {Math.round(qiblaAngle)}°
              </p>
              
              <button
                onClick={getLocation}
                className="bg-blue-500 text-white px-4 py-2 rounded-md mt-4"
              >
                تحديث الموقع
              </button>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default QiblaPage;