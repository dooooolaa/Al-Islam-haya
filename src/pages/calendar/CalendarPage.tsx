import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar as CalendarIcon, ChevronRight, ChevronLeft, Moon } from 'lucide-react';
import HijriDate from 'hijri-date';

interface IslamicEvent {
  name: string;
  date: string; // Format: MM-DD for Gregorian, MM-DD for Hijri
  description: string;
  type: 'hijri' | 'gregorian';
}

interface HijriMonthData {
  hijriMonth: number;
  hijriYear: number;
  gregorianStart: string; // Format: YYYY-MM-DD
  gregorianEnd: string; // Format: YYYY-MM-DD
  daysMapping: {
    hijriDay: number;
    gregorianDate: string; // Format: YYYY-MM-DD
    weekDay: string;
  }[];
}

const CalendarPage: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [hijriDate, setHijriDate] = useState<any>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [events, setEvents] = useState<IslamicEvent[]>([]);
  const [selectedEvents, setSelectedEvents] = useState<IslamicEvent[]>([]);
  const [hijriCalendarData, setHijriCalendarData] = useState<HijriMonthData[]>([]);

  useEffect(() => {
    // Initialize Hijri date
    const today = new Date();
    const hijri = new HijriDate(today);
    setHijriDate(hijri);
    
    // Load Islamic events
    loadIslamicEvents();
    
    // Load Hijri calendar data
    loadHijriCalendarData();
  }, []);

  useEffect(() => {
    if (selectedDate) {
      const hijriSelected = new HijriDate(selectedDate);
      const selectedDateEvents = getEventsForDate(selectedDate, hijriSelected);
      setSelectedEvents(selectedDateEvents);
    } else {
      setSelectedEvents([]);
    }
  }, [selectedDate, events]);

  const loadHijriCalendarData = () => {
    // This function would typically fetch data from an API
    // For now, we'll use static data based on hijridates.com
    
    // Example data structure for Dhul-Qi'dah 1445
    const dhulQidah1445: HijriMonthData = {
      hijriMonth: 11,
      hijriYear: 1445,
      gregorianStart: '2024-05-09',
      gregorianEnd: '2024-06-07',
      daysMapping: [
        { hijriDay: 1, gregorianDate: '2024-05-09', weekDay: 'الخميس' },
        { hijriDay: 2, gregorianDate: '2024-05-10', weekDay: 'الجمعة' },
        { hijriDay: 3, gregorianDate: '2024-05-11', weekDay: 'السبت' },
        { hijriDay: 4, gregorianDate: '2024-05-12', weekDay: 'الأحد' },
        { hijriDay: 5, gregorianDate: '2024-05-13', weekDay: 'الإثنين' },
        { hijriDay: 6, gregorianDate: '2024-05-14', weekDay: 'الثلاثاء' },
        { hijriDay: 7, gregorianDate: '2024-05-15', weekDay: 'الأربعاء' },
        { hijriDay: 8, gregorianDate: '2024-05-16', weekDay: 'الخميس' },
        { hijriDay: 9, gregorianDate: '2024-05-17', weekDay: 'الجمعة' },
        { hijriDay: 10, gregorianDate: '2024-05-18', weekDay: 'السبت' },
        { hijriDay: 11, gregorianDate: '2024-05-19', weekDay: 'الأحد' },
        { hijriDay: 12, gregorianDate: '2024-05-20', weekDay: 'الإثنين' },
        { hijriDay: 13, gregorianDate: '2024-05-21', weekDay: 'الثلاثاء' },
        { hijriDay: 14, gregorianDate: '2024-05-22', weekDay: 'الأربعاء' },
        { hijriDay: 15, gregorianDate: '2024-05-23', weekDay: 'الخميس' },
        { hijriDay: 16, gregorianDate: '2024-05-24', weekDay: 'الجمعة' },
        { hijriDay: 17, gregorianDate: '2024-05-25', weekDay: 'السبت' },
        { hijriDay: 18, gregorianDate: '2024-05-26', weekDay: 'الأحد' },
        { hijriDay: 19, gregorianDate: '2024-05-27', weekDay: 'الإثنين' },
        { hijriDay: 20, gregorianDate: '2024-05-28', weekDay: 'الثلاثاء' },
        { hijriDay: 21, gregorianDate: '2024-05-29', weekDay: 'الأربعاء' },
        { hijriDay: 22, gregorianDate: '2024-05-30', weekDay: 'الخميس' },
        { hijriDay: 23, gregorianDate: '2024-05-31', weekDay: 'الجمعة' },
        { hijriDay: 24, gregorianDate: '2024-06-01', weekDay: 'السبت' },
        { hijriDay: 25, gregorianDate: '2024-06-02', weekDay: 'الأحد' },
        { hijriDay: 26, gregorianDate: '2024-06-03', weekDay: 'الإثنين' },
        { hijriDay: 27, gregorianDate: '2024-06-04', weekDay: 'الثلاثاء' },
        { hijriDay: 28, gregorianDate: '2024-06-05', weekDay: 'الأربعاء' },
        { hijriDay: 29, gregorianDate: '2024-06-06', weekDay: 'الخميس' },
        { hijriDay: 30, gregorianDate: '2024-06-07', weekDay: 'الجمعة' }
      ]
    };
    
    // Example data for Dhul-Hijjah 1445
    const dhulHijjah1445: HijriMonthData = {
      hijriMonth: 12,
      hijriYear: 1445,
      gregorianStart: '2024-06-08',
      gregorianEnd: '2024-07-07',
      daysMapping: [
        { hijriDay: 1, gregorianDate: '2024-06-08', weekDay: 'السبت' },
        { hijriDay: 2, gregorianDate: '2024-06-09', weekDay: 'الأحد' },
        { hijriDay: 3, gregorianDate: '2024-06-10', weekDay: 'الإثنين' },
        { hijriDay: 4, gregorianDate: '2024-06-11', weekDay: 'الثلاثاء' },
        { hijriDay: 5, gregorianDate: '2024-06-12', weekDay: 'الأربعاء' },
        { hijriDay: 6, gregorianDate: '2024-06-13', weekDay: 'الخميس' },
        { hijriDay: 7, gregorianDate: '2024-06-14', weekDay: 'الجمعة' },
        { hijriDay: 8, gregorianDate: '2024-06-15', weekDay: 'السبت' },
        { hijriDay: 9, gregorianDate: '2024-06-16', weekDay: 'الأحد' },
        { hijriDay: 10, gregorianDate: '2024-06-17', weekDay: 'الإثنين' },
        { hijriDay: 11, gregorianDate: '2024-06-18', weekDay: 'الثلاثاء' },
        { hijriDay: 12, gregorianDate: '2024-06-19', weekDay: 'الأربعاء' },
        { hijriDay: 13, gregorianDate: '2024-06-20', weekDay: 'الخميس' },
        { hijriDay: 14, gregorianDate: '2024-06-21', weekDay: 'الجمعة' },
        { hijriDay: 15, gregorianDate: '2024-06-22', weekDay: 'السبت' },
        { hijriDay: 16, gregorianDate: '2024-06-23', weekDay: 'الأحد' },
        { hijriDay: 17, gregorianDate: '2024-06-24', weekDay: 'الإثنين' },
        { hijriDay: 18, gregorianDate: '2024-06-25', weekDay: 'الثلاثاء' },
        { hijriDay: 19, gregorianDate: '2024-06-26', weekDay: 'الأربعاء' },
        { hijriDay: 20, gregorianDate: '2024-06-27', weekDay: 'الخميس' },
        { hijriDay: 21, gregorianDate: '2024-06-28', weekDay: 'الجمعة' },
        { hijriDay: 22, gregorianDate: '2024-06-29', weekDay: 'السبت' },
        { hijriDay: 23, gregorianDate: '2024-06-30', weekDay: 'الأحد' },
        { hijriDay: 24, gregorianDate: '2024-07-01', weekDay: 'الإثنين' },
        { hijriDay: 25, gregorianDate: '2024-07-02', weekDay: 'الثلاثاء' },
        { hijriDay: 26, gregorianDate: '2024-07-03', weekDay: 'الأربعاء' },
        { hijriDay: 27, gregorianDate: '2024-07-04', weekDay: 'الخميس' },
        { hijriDay: 28, gregorianDate: '2024-07-05', weekDay: 'الجمعة' },
        { hijriDay: 29, gregorianDate: '2024-07-06', weekDay: 'السبت' },
        { hijriDay: 30, gregorianDate: '2024-07-07', weekDay: 'الأحد' }
      ]
    };
    
    // Add more months as needed
    setHijriCalendarData([dhulQidah1445, dhulHijjah1445]);
  };

  const loadIslamicEvents = () => {
    // These are major Islamic events with approximate Hijri dates
    // In a real app, these would be calculated precisely for each year
    const islamicEvents: IslamicEvent[] = [
      // رأس السنة الهجرية removed as per user request
      {
        name: 'يوم عاشوراء',
        date: '01-10', // Muharram 10
        description: 'يوم صيام وذكرى استشهاد الإمام الحسين',
        type: 'hijri'
      },
      {
        name: 'المولد النبوي الشريف',
        date: '03-12', // Rabi' al-Awwal 12
        description: 'ذكرى مولد النبي محمد صلى الله عليه وسلم',
        type: 'hijri'
      },
      {
        name: 'ليلة الإسراء والمعراج',
        date: '07-27', // Rajab 27
        description: 'ذكرى رحلة النبي محمد من مكة إلى القدس ثم إلى السماء',
        type: 'hijri'
      },
      {
        name: 'بداية شهر رمضان',
        date: '09-01', // Ramadan 1
        description: 'بداية شهر الصيام المبارك',
        type: 'hijri'
      },
      {
        name: 'ليلة القدر',
        date: '09-27', // Ramadan 27 (approximate)
        description: 'الليلة المباركة التي أنزل فيها القرآن',
        type: 'hijri'
      },
      {
        name: 'عيد الفطر',
        date: '10-01', // Shawwal 1
        description: 'عيد الفطر المبارك، نهاية شهر رمضان',
        type: 'hijri'
      },
      {
        name: 'يوم عرفة',
        date: '12-09', // Dhu al-Hijjah 9
        description: 'يوم الوقوف بعرفة، أهم أيام الحج',
        type: 'hijri'
      },
      {
        name: 'عيد الأضحى',
        date: '12-10', // Dhu al-Hijjah 10
        description: 'عيد الأضحى المبارك، ذكرى تضحية النبي إبراهيم',
        type: 'hijri'
      }
    ];
    
    setEvents(islamicEvents);
  };

  const getEventsForDate = (date: Date, hijriDate: any): IslamicEvent[] => {
    const gregorianMonth = (date.getMonth() + 1).toString().padStart(2, '0');
    const gregorianDay = date.getDate().toString().padStart(2, '0');
    const gregorianDateStr = `${gregorianMonth}-${gregorianDay}`;
    
    const hijriMonth = hijriDate.getMonth().toString().padStart(2, '0');
    const hijriDay = hijriDate.getDate().toString().padStart(2, '0');
    const hijriDateStr = `${hijriMonth}-${hijriDay}`;
    
    return events.filter(event => 
      (event.type === 'gregorian' && event.date === gregorianDateStr) ||
      (event.type === 'hijri' && event.date === hijriDateStr)
    );
  };

  const getDaysInMonth = (year: number, month: number): number => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year: number, month: number): number => {
    return new Date(year, month, 1).getDay();
  };

  const handlePrevMonth = () => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(newDate.getMonth() - 1);
      return newDate;
    });
  };

  const handleNextMonth = () => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(newDate.getMonth() + 1);
      return newDate;
    });
  };

  const handleDateClick = (day: number) => {
    const selectedDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    setSelectedDate(selectedDate);
  };

  const renderCalendar = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInMonth = getDaysInMonth(year, month);
    const firstDayOfMonth = getFirstDayOfMonth(year, month);
    
    const days = [];
    const today = new Date();
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<div key={`empty-${i}`} className="h-10 w-10"></div>);
    }
    
    // Add cells for each day of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const hijriForDay = new HijriDate(date);
      const isToday = today.getDate() === day && today.getMonth() === month && today.getFullYear() === year;
      const isSelected = selectedDate?.getDate() === day && selectedDate?.getMonth() === month && selectedDate?.getFullYear() === year;
      
      // Check if this date has any events
      const dateEvents = getEventsForDate(date, hijriForDay);
      const hasEvents = dateEvents.length > 0;
      
      days.push(
        <div 
          key={day} 
          className={`h-10 w-10 flex flex-col items-center justify-center rounded-full cursor-pointer relative
            ${isToday ? 'bg-[var(--color-accent)] dark:bg-[var(--color-dark-accent)] text-white' : ''}
            ${isSelected && !isToday ? 'bg-[var(--color-hover-bg)] dark:bg-[var(--color-dark-hover-bg)]' : ''}
            ${!isToday && !isSelected ? 'hover:bg-[var(--color-hover-bg)] dark:hover:bg-[var(--color-dark-hover-bg)]' : ''}
          `}
          onClick={() => handleDateClick(day)}
        >
          <span>{day}</span>
          {hijriForDay.getDate() === 1 && (
            <div className="absolute -top-1 -right-1">
              <Moon size={12} className="text-[var(--color-accent)] dark:text-[var(--color-dark-accent)]" />
            </div>
          )}
          {hasEvents && (
            <div className="absolute -bottom-1 w-1.5 h-1.5 rounded-full bg-[var(--color-accent)] dark:bg-[var(--color-dark-accent)]"></div>
          )}
        </div>
      );
    }
    
    return days;
  };

  const formatHijriDate = (date: Date): string => {
    if (!hijriDate) return '';
    
    const hijri = new HijriDate(date);
    const hijriMonths = [
      'محرم', 'صفر', 'ربيع الأول', 'ربيع الثاني',
      'جمادى الأولى', 'جمادى الآخرة', 'رجب', 'شعبان',
      'رمضان', 'شوال', 'ذو القعدة', 'ذو الحجة'
    ];
    
    return `${hijri.getDate()} ${hijriMonths[hijri.getMonth() - 1]} ${hijri.getFullYear()} هـ`;
  };

  const formatGregorianDate = (date: Date): string => {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    return date.toLocaleDateString('ar-SA', options);
  };

  return (
    <div className="container-page">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="section-title">التقويم الهجري</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Calendar Section */}
          <div className="card">
            <div className="flex justify-between items-center mb-6">
              <button 
                onClick={handlePrevMonth}
                className="p-2 rounded-full hover:bg-[var(--color-hover-bg)] dark:hover:bg-[var(--color-dark-hover-bg)] transition-theme"
                aria-label="Previous month"
              >
                <ChevronRight size={20} />
              </button>
              
              <div className="text-center">
                <h2 className="text-xl font-medium">
                  {currentDate.toLocaleDateString('ar-SA', { month: 'long', year: 'numeric' })}
                </h2>
                <p className="text-sm text-[var(--color-text)] dark:text-[var(--color-dark-text)]">
                  {formatHijriDate(new Date(currentDate.getFullYear(), currentDate.getMonth(), 1))}
                </p>
              </div>
              
              <button 
                onClick={handleNextMonth}
                className="p-2 rounded-full hover:bg-[var(--color-hover-bg)] dark:hover:bg-[var(--color-dark-hover-bg)] transition-theme"
                aria-label="Next month"
              >
                <ChevronLeft size={20} />
              </button>
            </div>
            
            <div className="grid grid-cols-7 gap-1 text-center mb-2">
              <div className="text-sm font-medium text-[var(--color-text)] dark:text-[var(--color-dark-text)]">الأحد</div>
              <div className="text-sm font-medium text-[var(--color-text)] dark:text-[var(--color-dark-text)]">الإثنين</div>
              <div className="text-sm font-medium text-[var(--color-text)] dark:text-[var(--color-dark-text)]">الثلاثاء</div>
              <div className="text-sm font-medium text-[var(--color-text)] dark:text-[var(--color-dark-text)]">الأربعاء</div>
              <div className="text-sm font-medium text-[var(--color-text)] dark:text-[var(--color-dark-text)]">الخميس</div>
              <div className="text-sm font-medium text-[var(--color-text)] dark:text-[var(--color-dark-text)]">الجمعة</div>
              <div className="text-sm font-medium text-[var(--color-text)] dark:text-[var(--color-dark-text)]">السبت</div>
            </div>
            
            <div className="grid grid-cols-7 gap-1 justify-items-center">
              {renderCalendar()}
            </div>
            
            <div className="mt-6 text-center">
              <div className="flex items-center justify-center space-x-4 space-x-reverse">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-[var(--color-accent)] dark:bg-[var(--color-dark-accent)] mr-2"></div>
                  <span className="text-sm">اليوم</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full border border-[var(--color-accent)] dark:border-[var(--color-dark-accent)] mr-2"></div>
                  <span className="text-sm">مناسبة إسلامية</span>
                </div>
                <div className="flex items-center">
                  <Moon size={16} className="text-[var(--color-accent)] dark:text-[var(--color-dark-accent)] mr-2" />
                  <span className="text-sm">بداية الشهر الهجري</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Date Details Section */}
          <div>
            {selectedDate ? (
              <div className="card">
                <div className="mb-6">
                  <h2 className="text-xl font-medium mb-1">
                    {formatGregorianDate(selectedDate)}
                  </h2>
                  <p className="text-[var(--color-text)] dark:text-[var(--color-dark-text)]">
                    {formatHijriDate(selectedDate)}
                  </p>
                </div>
                
                {selectedEvents.length > 0 ? (
                  <div>
                    <h3 className="text-lg font-medium mb-4 flex items-center">
                      <CalendarIcon size={18} className="ml-2 text-[var(--color-accent)] dark:text-[var(--color-dark-accent)]" />
                      المناسبات الإسلامية
                    </h3>
                    
                    <div className="space-y-4">
                      {selectedEvents.map((event, index) => (
                        <div key={index} className="p-4 bg-[var(--color-hover-bg)] dark:bg-[var(--color-dark-hover-bg)] rounded-md">
                          <h4 className="font-medium text-[var(--color-accent)] dark:text-[var(--color-dark-accent)] mb-2">
                            {event.name}
                          </h4>
                          <p className="text-[var(--color-text)] dark:text-[var(--color-dark-text)] text-sm">
                            {event.description}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <p className="text-[var(--color-text)] dark:text-[var(--color-dark-text)]">
                    لا توجد مناسبات إسلامية في هذا اليوم
                  </p>
                )}
              </div>
            ) : (
              <div className="card flex flex-col items-center justify-center min-h-[300px]">
                <CalendarIcon size={48} className="text-[var(--color-text)] dark:text-[var(--color-dark-text)] mb-4" />
                <p className="text-[var(--color-text)] dark:text-[var(--color-dark-text)]">
                  اختر يوماً من التقويم لعرض التفاصيل
                </p>
              </div>
            )}
            
            {/* Islamic Events List */}
            <div className="card mt-6">
              <h3 className="text-lg font-medium mb-4">المناسبات الإسلامية القادمة</h3>
              
              <div className="space-y-3">
                {events.slice(0, 5).map((event, index) => {
                  // In a real app, we would calculate the actual date for each event
                  // based on the current Hijri year
                  return (
                    <div key={index} className="flex justify-between items-center p-3 bg-[var(--color-hover-bg)] dark:bg-[var(--color-dark-hover-bg)] rounded-md">
                      <span className="font-medium">{event.name}</span>
                      <span className="text-sm text-[var(--color-text)] dark:text-[var(--color-dark-text)]">
                        {event.type === 'hijri' ? 
                          `${event.date.split('-')[0]}/${event.date.split('-')[1]} هـ` : 
                          `${event.date.split('-')[0]}/${event.date.split('-')[1]} م`}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
        
        {/* Hijri-Gregorian Calendar Table */}
        <div className="mt-8">
          <div className="card">
            <h3 className="text-lg font-medium mb-4">جدول التقويم الهجري والميلادي</h3>
            
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 dark:bg-gray-800">
                    <th className="p-2 text-right">التاريخ الهجري</th>
                    <th className="p-2 text-right">اليوم</th>
                    <th className="p-2 text-right">التاريخ الميلادي</th>
                  </tr>
                </thead>
                <tbody>
                  {hijriCalendarData.length > 0 && hijriCalendarData[0].daysMapping.slice(0, 10).map((day, index) => (
                    <tr key={index} className="border-b border-gray-100 dark:border-gray-800">
                      <td className="p-2">{day.hijriDay}/{hijriCalendarData[0].hijriMonth}/{hijriCalendarData[0].hijriYear}</td>
                      <td className="p-2">{day.weekDay}</td>
                      <td className="p-2">{day.gregorianDate.split('-').reverse().join('/')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <div className="mt-4 text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                * بيانات التقويم مستمدة من حسابات فلكية دقيقة وقد تختلف عن الرؤية الشرعية للهلال
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default CalendarPage;
