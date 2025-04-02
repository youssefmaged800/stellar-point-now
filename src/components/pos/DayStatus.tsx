
import React from 'react';
import { usePOS } from '@/contexts/POSContext';
import { Clock, SunMoon, Sunrise, Sunset } from 'lucide-react';
import { format } from 'date-fns';

const DayStatus: React.FC = () => {
  const { dayOpen, currentTime, dayStartTime, openDay, closeDay } = usePOS();
  
  const formatTime = (date: Date) => {
    return format(date, 'hh:mm:ss a');
  };
  
  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Business Day Status</h3>
        <div className="flex items-center">
          <Clock className="w-5 h-5 mr-2 text-gray-600" />
          <span className="text-gray-700 font-mono">{formatTime(currentTime)}</span>
        </div>
      </div>
      
      <div className="flex flex-col space-y-3">
        <div className="flex items-center">
          <div className={`w-3 h-3 rounded-full mr-2 ${dayOpen ? 'bg-green-500' : 'bg-red-500'}`}></div>
          <span className="font-medium">Status: {dayOpen ? 'Open' : 'Closed'}</span>
        </div>
        
        {dayOpen && dayStartTime && (
          <div className="text-sm text-gray-600">
            <span>Opened: {format(dayStartTime, 'hh:mm:ss a')}</span>
            <span className="ml-2">({format(dayStartTime, 'PP')})</span>
          </div>
        )}
        
        <div className="flex space-x-2 mt-2">
          <button
            onClick={openDay}
            disabled={dayOpen}
            className="flex items-center bg-green-600 text-white px-3 py-1 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Sunrise className="w-4 h-4 mr-1" />
            Open Day
          </button>
          
          <button
            onClick={closeDay}
            disabled={!dayOpen}
            className="flex items-center bg-red-600 text-white px-3 py-1 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Sunset className="w-4 h-4 mr-1" />
            Close Day
          </button>
        </div>
      </div>
    </div>
  );
};

export default DayStatus;
