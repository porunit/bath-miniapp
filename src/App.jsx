import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, AnimateSharedLayout } from 'framer-motion';
import DatePicker from 'react-datepicker';
import { format, addDays, isToday, isTomorrow } from 'date-fns';
import { ru } from 'date-fns/locale';
import 'react-datepicker/dist/react-datepicker.css';
import './App.css';

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: 'spring',
      stiffness: 100,
      damping: 10
    }
  }
};

function App() {
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState('');
  const [availableSlots, setAvailableSlots] = useState([]);
  const [isBookingConfirmed, setIsBookingConfirmed] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const datePickerRef = useRef(null);
  
  const handleDateInputClick = () => {
    setShowDatePicker(true);
  };
  
  const handleDateChange = (date) => {
    setSelectedDate(date);
    setShowDatePicker(false);
    setSelectedTime('');
  };
  
  const handleClickOutside = (event) => {
    if (datePickerRef.current && !datePickerRef.current.contains(event.target)) {
      setShowDatePicker(false);
    }
  };
  
  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Generate time slots from 10:00 to 22:00 with 2-hour intervals
  useEffect(() => {
    const slots = [];
    for (let hour = 10; hour < 22; hour += 2) {
      const startHour = hour.toString().padStart(2, '0');
      const endHour = (hour + 2).toString().padStart(2, '0');
      slots.push(`${startHour}:00 - ${endHour}:00`);
    }
    setAvailableSlots(slots);
  }, []);

  const formatDate = (date) => {
    if (!date) return '';
    
    if (isToday(date)) {
      return 'Сегодня';
    }
    if (isTomorrow(date)) {
      return 'Завтра';
    }
    
    return format(date, 'EEEE, d MMMM yyyy', { locale: ru });
  };
  
  // Custom date button for the date picker
  const CustomDateInput = ({ value, onClick }) => (
    <motion.button 
      className="custom-date-input"
      onClick={onClick}
      whileTap={{ scale: 0.98 }}
    >
      {value || 'Выберите дату'}
    </motion.button>
  );

  const handleBooking = () => {
    if (selectedDate && selectedTime) {
      // In a real app, you would send this data to your backend
      // and handle the response
      setIsBookingConfirmed(true);
      
      // Reset after 3 seconds
      setTimeout(() => {
        setIsBookingConfirmed(false);
        setSelectedDate('');
        setSelectedTime('');
      }, 3000);
    }
  };

  // Set minimum date to today
  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="app">
      <AnimatePresence>
        {isBookingConfirmed ? (
            <motion.div 
              className="success-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div 
                className="success-message"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{ type: 'spring', damping: 20, stiffness: 300 }}
              >
                <motion.div
                  className="checkmark"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <svg viewBox="0 0 52 52" className="checkmark__circle">
                    <circle cx="26" cy="26" r="25" fill="none" className="checkmark__circle-bg"/>
                    <motion.path 
                      fill="none" 
                      d="M14.1 27.2l7.1 7.2 16.7-16.8"
                      stroke="#2E7D32"
                      strokeWidth="3"
                      strokeLinecap="round"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 0.5, delay: 0.4 }}
                    />
                  </svg>
                </motion.div>
                <h2>Бронирование подтверждено!</h2>
                <p className="booking-details">
                  {formatDate(selectedDate)}<br />
                  {selectedTime}
                </p>
              </motion.div>
            </motion.div>
          ) : (
            <>
              <motion.header
                initial="hidden"
                animate="visible"
                variants={containerVariants}
              >
                <motion.h1 variants={itemVariants}>Банный комплекс</motion.h1>
                <motion.p variants={itemVariants}>Выберите дату и время</motion.p>
              </motion.header>
              
              <motion.main
                initial="hidden"
                animate="visible"
                variants={containerVariants}
              >
                <motion.div 
                  className="form-group date-group"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <label htmlFor="date" className="form-label">
                    <svg className="calendar-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M19 4H5C3.89543 4 3 4.89543 3 6V20C3 21.1046 3.89543 22 5 22H19C20.1046 22 21 21.1046 21 20V6C21 4.89543 20.1046 4 19 4Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M16 2V6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M8 2V6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M3 10H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <span>Выберите дату</span>
                  </label>
                  <div className="date-input-container" ref={datePickerRef}>
                    <motion.div 
                      className={`date-input ${selectedDate ? 'has-value' : ''}`}
                      onClick={handleDateInputClick}
                      whileTap={{ scale: 0.98 }}
                    >
                      <input
                        type="text"
                        id="date"
                        value={selectedDate ? format(selectedDate, 'd MMMM yyyy', { locale: ru }) : ''}
                        readOnly
                        placeholder="Нажмите для выбора даты"
                        className="input-field"
                      />
                      {selectedDate && (
                        <motion.span 
                          className="clear-date"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedDate(null);
                            setSelectedTime('');
                          }}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          ×
                        </motion.span>
                      )}
                    </motion.div>
                    <AnimatePresence>
                      {showDatePicker && (
                        <motion.div 
                          className="date-picker-popup"
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ type: 'spring', damping: 20, stiffness: 300 }}
                        >
                          <DatePicker
                            selected={selectedDate}
                            onChange={handleDateChange}
                            minDate={new Date()}
                            maxDate={addDays(new Date(), 30)}
                            inline
                            locale={ru}
                            calendarClassName="custom-calendar"
                            renderCustomHeader={({
                              date,
                              decreaseMonth,
                              increaseMonth,
                              prevMonthButtonDisabled,
                              nextMonthButtonDisabled,
                            }) => (
                              <div className="custom-header">
                                <button
                                  type="button"
                                  onClick={decreaseMonth}
                                  disabled={prevMonthButtonDisabled}
                                  className="nav-arrow"
                                >
                                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                  </svg>
                                </button>
                                <div className="month-title">
                                  {format(date, 'MMMM yyyy', { locale: ru })}
                                </div>
                                <button
                                  type="button"
                                  onClick={increaseMonth}
                                  disabled={nextMonthButtonDisabled}
                                  className="nav-arrow"
                                >
                                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                  </svg>
                                </button>
                              </div>
                            )}
                          />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>
                
                <motion.div 
                  className="time-slots"
                  variants={containerVariants}
                  layout
                >
                  {availableSlots.map((slot) => (
                    <motion.div 
                      key={slot}
                      className={`time-slot ${selectedTime === slot ? 'selected' : ''}`}
                      onClick={() => setSelectedTime(slot)}
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.98 }}
                      variants={itemVariants}
                      layout
                    >
                      {slot}
                    </motion.div>
                  ))}
                </motion.div>
                
                <motion.div 
                  className="booking-summary"
                  variants={itemVariants}
                  layout
                >
                  <h3>Выбрано:</h3>
                  <p>Дата: {selectedDate ? formatDate(selectedDate) : 'не выбрано'}</p>
                  <p>Время: {selectedTime || 'не выбрано'}</p>
                  <motion.button 
                    className="btn" 
                    disabled={!selectedDate || !selectedTime}
                    onClick={handleBooking}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    layout
                  >
                    Забронировать
                  </motion.button>
                </motion.div>
              </motion.main>
            </>
          )}
        </AnimatePresence>
      <motion.footer
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <p> 2025 Банный комплекс</p>
      </motion.footer>
    </div>
  );
}

export default App;
