import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Plus, X, Save } from 'lucide-react';

const DoctorAvailability = ({ doctor, onSave }) => {
  const [availability, setAvailability] = useState({});
  const [selectedDay, setSelectedDay] = useState('monday');
  const [newSlot, setNewSlot] = useState({ start: '', end: '' });

  const days = [
    { key: 'monday', label: 'Monday' },
    { key: 'tuesday', label: 'Tuesday' },
    { key: 'wednesday', label: 'Wednesday' },
    { key: 'thursday', label: 'Thursday' },
    { key: 'friday', label: 'Friday' },
    { key: 'saturday', label: 'Saturday' },
    { key: 'sunday', label: 'Sunday' }
  ];

  useEffect(() => {
    // Load existing availability from localStorage
    const savedAvailability = localStorage.getItem(`doctor_availability_${doctor.email}`);
    if (savedAvailability) {
      setAvailability(JSON.parse(savedAvailability));
    }
  }, [doctor.email]);

  const addTimeSlot = () => {
    if (!newSlot.start || !newSlot.end) return;

    const updatedAvailability = { ...availability };
    if (!updatedAvailability[selectedDay]) {
      updatedAvailability[selectedDay] = [];
    }

    updatedAvailability[selectedDay].push({
      id: Date.now(),
      start: newSlot.start,
      end: newSlot.end
    });

    setAvailability(updatedAvailability);
    setNewSlot({ start: '', end: '' });
  };

  const removeTimeSlot = (day, slotId) => {
    const updatedAvailability = { ...availability };
    updatedAvailability[day] = updatedAvailability[day].filter(slot => slot.id !== slotId);
    setAvailability(updatedAvailability);
  };

  const saveAvailability = () => {
    localStorage.setItem(`doctor_availability_${doctor.email}`, JSON.stringify(availability));
    onSave && onSave(availability);
    alert('Availability saved successfully!');
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-medium text-gray-900">Set Your Availability</h3>
        <button
          onClick={saveAvailability}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
        >
          <Save className="w-4 h-4 mr-2" />
          Save Changes
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Day Selection */}
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-3">Select Day</h4>
          <div className="space-y-2">
            {days.map((day) => (
              <button
                key={day.key}
                onClick={() => setSelectedDay(day.key)}
                className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium ${
                  selectedDay === day.key
                    ? 'bg-indigo-100 text-indigo-700'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                {day.label}
              </button>
            ))}
          </div>
        </div>

        {/* Time Slots */}
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-3">
            Time Slots for {days.find(d => d.key === selectedDay)?.label}
          </h4>

          {/* Add New Slot */}
          <div className="mb-4 p-3 bg-gray-50 rounded-lg">
            <div className="flex gap-2 mb-2">
              <input
                type="time"
                value={newSlot.start}
                onChange={(e) => setNewSlot({ ...newSlot, start: e.target.value })}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm"
                placeholder="Start time"
              />
              <input
                type="time"
                value={newSlot.end}
                onChange={(e) => setNewSlot({ ...newSlot, end: e.target.value })}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm"
                placeholder="End time"
              />
            </div>
            <button
              onClick={addTimeSlot}
              className="w-full inline-flex items-center justify-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
            >
              <Plus className="w-4 h-4 mr-1" />
              Add Slot
            </button>
          </div>

          {/* Existing Slots */}
          <div className="space-y-2">
            {availability[selectedDay]?.map((slot) => (
              <div key={slot.id} className="flex items-center justify-between p-2 bg-blue-50 rounded-md">
                <span className="text-sm text-gray-700">
                  {slot.start} - {slot.end}
                </span>
                <button
                  onClick={() => removeTimeSlot(selectedDay, slot.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )) || (
              <p className="text-sm text-gray-500 text-center py-4">
                No time slots set for this day
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorAvailability;