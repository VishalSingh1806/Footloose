import { useState } from 'react';

export interface TimeSlot {
  date: string;
  time: string;
  dateLabel: string;
  timeLabel: string;
}

interface SchedulePickerProps {
  onSlotsChange: (slots: TimeSlot[]) => void;
  maxSlots?: number;
  minSlots?: number;
}

function SchedulePicker({ onSlotsChange, maxSlots = 3, minSlots = 1 }: SchedulePickerProps) {
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedSlots, setSelectedSlots] = useState<TimeSlot[]>([]);

  // Generate next 7 days
  const generateDates = () => {
    const dates = [];
    const today = new Date();

    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);

      const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

      const dayName = i === 0 ? 'Today' : i === 1 ? 'Tomorrow' : dayNames[date.getDay()];
      const dateNum = date.getDate();
      const month = monthNames[date.getMonth()];

      dates.push({
        value: date.toISOString().split('T')[0],
        label: dayName,
        sublabel: `${month} ${dateNum}`,
        fullLabel: `${dayName}, ${month} ${dateNum}, 2026`,
      });
    }
    return dates;
  };

  const dates = generateDates();

  // Time slots
  const timeSlots = [
    { value: '09:00', label: '9:00 AM', period: 'Morning' },
    { value: '10:00', label: '10:00 AM', period: 'Morning' },
    { value: '11:00', label: '11:00 AM', period: 'Morning' },
    { value: '14:00', label: '2:00 PM', period: 'Afternoon' },
    { value: '15:00', label: '3:00 PM', period: 'Afternoon' },
    { value: '16:00', label: '4:00 PM', period: 'Afternoon' },
    { value: '17:00', label: '5:00 PM', period: 'Afternoon' },
    { value: '18:00', label: '6:00 PM', period: 'Evening' },
    { value: '19:00', label: '7:00 PM', period: 'Evening' },
    { value: '20:00', label: '8:00 PM', period: 'Evening' },
    { value: '21:00', label: '9:00 PM', period: 'Evening' },
  ];

  const handleDateSelect = (dateValue: string) => {
    setSelectedDate(dateValue);
  };

  const handleTimeSelect = (time: string) => {
    if (!selectedDate) {
      alert('Please select a date first');
      return;
    }

    const dateObj = dates.find((d) => d.value === selectedDate);
    const timeObj = timeSlots.find((t) => t.value === time);

    if (!dateObj || !timeObj) return;

    const slotKey = `${selectedDate}_${time}`;
    const existingSlotIndex = selectedSlots.findIndex(
      (s) => `${s.date}_${s.time}` === slotKey
    );

    let newSlots: TimeSlot[];

    if (existingSlotIndex > -1) {
      // Remove slot
      newSlots = selectedSlots.filter((_, index) => index !== existingSlotIndex);
    } else {
      // Add slot
      if (selectedSlots.length >= maxSlots) {
        alert(`You can only select up to ${maxSlots} time slots`);
        return;
      }

      newSlots = [
        ...selectedSlots,
        {
          date: selectedDate,
          time,
          dateLabel: dateObj.fullLabel,
          timeLabel: timeObj.label,
        },
      ];
    }

    setSelectedSlots(newSlots);
    onSlotsChange(newSlots);
  };

  const isSlotSelected = (date: string, time: string) => {
    return selectedSlots.some((s) => s.date === date && s.time === time);
  };

  const groupedTimeSlots = timeSlots.reduce((acc, slot) => {
    if (!acc[slot.period]) acc[slot.period] = [];
    acc[slot.period].push(slot);
    return acc;
  }, {} as Record<string, typeof timeSlots>);

  return (
    <div>
      {/* Date Selector */}
      <div className="mb-6">
        <h4 className="text-sm font-semibold text-[#1D3557] mb-3">Select Date</h4>
        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2">
          {dates.map((date) => (
            <button
              key={date.value}
              onClick={() => handleDateSelect(date.value)}
              className={`flex-shrink-0 w-20 py-3 px-2 rounded-xl text-center transition-all
                ${
                  selectedDate === date.value
                    ? 'bg-[#9B59B6] text-white shadow-lg'
                    : 'bg-white text-[#1D3557] border-2 border-gray-200 hover:border-[#9B59B6]'
                }`}
            >
              <div className="text-xs font-semibold">{date.label}</div>
              <div className="text-xs mt-0.5 opacity-90">{date.sublabel}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Time Slots */}
      {selectedDate && (
        <div className="mb-6">
          <h4 className="text-sm font-semibold text-[#1D3557] mb-3">Select Time Slots</h4>

          {Object.entries(groupedTimeSlots).map(([period, slots]) => (
            <div key={period} className="mb-4">
              <p className="text-xs text-[#6C757D] mb-2">{period}</p>
              <div className="grid grid-cols-3 gap-2">
                {slots.map((slot) => (
                  <button
                    key={slot.value}
                    onClick={() => handleTimeSelect(slot.value)}
                    className={`py-3 px-3 rounded-lg text-sm font-semibold transition-all
                      ${
                        isSlotSelected(selectedDate, slot.value)
                          ? 'bg-[#2A9D8F] text-white'
                          : 'bg-white text-[#1D3557] border-2 border-gray-200 hover:border-[#2A9D8F]'
                      }`}
                  >
                    {slot.label}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Selection Counter */}
      <div className="flex items-center justify-between text-sm mb-4">
        <span className="text-[#6C757D]">
          {selectedSlots.length} / {maxSlots} slots selected
        </span>
        <span className="text-xs text-[#6C757D]">Times shown in IST (GMT+5:30)</span>
      </div>

      {/* Selected Slots Preview */}
      {selectedSlots.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <p className="text-xs font-semibold text-blue-900 mb-2">Selected Slots:</p>
          {selectedSlots.map((slot, index) => (
            <div key={index} className="text-sm text-blue-800 flex items-center justify-between">
              <span>
                {slot.dateLabel} • {slot.timeLabel}
              </span>
              <button
                onClick={() => handleTimeSelect(slot.time)}
                className="text-red-600 hover:text-red-700 ml-2"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Info */}
      <p className="text-xs text-[#6C757D] text-center mt-4">
        Each speed date lasts 10 minutes
      </p>

      {/* Scrollbar hide styles */}
      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}

export default SchedulePicker;
