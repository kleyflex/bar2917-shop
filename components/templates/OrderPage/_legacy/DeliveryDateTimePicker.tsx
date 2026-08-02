import { useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './StyleDatePicker/DeliveryDateTimePicker.css';

const DeliveryDateTimePicker = ({ onDateTimeChange }: { onDateTimeChange: (date: Date | null) => void }) => {
    const [startDate, setStartDate] = useState<Date | null>(new Date());

    useEffect(() => {
        onDateTimeChange(startDate);
    }, [startDate]);

    // Запретить выбор дат позже, чем через неделю
    const filterDates = (date: Date) => {
        const now = new Date();
        const oneWeekFromNow = new Date(now.setDate(now.getDate() + 7));
        return date <= oneWeekFromNow;
    };

    // Запретить выбор времени вне диапазона 12:00 - 22:30
    const filterTimes = (time: Date) => {
        const hours = time.getHours();
        const minutes = time.getMinutes();
        return (hours >= 12 && (hours < 22 || (hours === 22 && minutes <= 30)));
    };

    return (
        <div className="date-picker-container">
            <label>Дата и время доставки</label>
            <DatePicker
                selected={startDate}
                onChange={(date) => setStartDate(date)}
                showTimeSelect
                timeFormat="HH:mm"
                timeIntervals={15}
                dateFormat="MMMM d, yyyy HH:mm"
                timeCaption="Время"
                filterDate={filterDates}
                filterTime={filterTimes}
                minDate={new Date()}
                className="date-picker-input"
                calendarClassName="date-picker-calendar"
            />
        </div>
    );
};

export default DeliveryDateTimePicker;
