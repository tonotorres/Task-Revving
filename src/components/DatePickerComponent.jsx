import React, { useState, useEffect } from 'react';
import { DatePicker } from '@ark-ui/react/date-picker';
import './DatePickerComponent.css';
import calendar from '../assets/images/icons/calendar.svg';

const DatePickerComponent = ({ onDateRangeChange }) => {
    const [startDateDisplay, setStartDateDisplay] = useState('');
    const [endDateDisplay, setEndDateDisplay] = useState('');
    const [internalDates, setInternalDates] = useState([null, null]);

    useEffect(() => {
        // Fechas iniciales en formato dd-mm-yyyy
        const initialStartDate = '01-01-2023';
        const initialEndDate = '01-07-2023';

        setStartDateDisplay(initialStartDate);
        setEndDateDisplay(initialEndDate);
        setInternalDates([initialStartDate, initialEndDate]);

        onDateRangeChange([initialStartDate, initialEndDate]); // Notificar al padre
    }, [onDateRangeChange]); // El array de dependencias vacío asegura que esto se ejecute solo una vez

    const handleDateChange = (details) => {
        // Formatea las fechas usando valueAsString y el formato dd-mm-yyyy
        const formattedDates = details.valueAsString.map(dateString => {
            if (dateString) {
                const [month, day, year] = dateString.split('/');
                return `${day}-${month}-${year}`;
            }
            return null;
        });
        setInternalDates(formattedDates);
    };

    return (
        <div className="date-picker-container">
            <DatePicker.Root selectionMode="range" onValueChange={handleDateChange}>
                <div className="date-picker-inputs">
                    <DatePicker.Input
                        index={0}
                        placeholder="dd-mm-yyyy"
                        value={startDateDisplay}
                    />
                    <DatePicker.Input
                        index={1}
                        placeholder="dd-mm-yyyy"
                        value={endDateDisplay}
                    />
                    <DatePicker.Trigger><img src={calendar} alt="Filter Icon" className="calendar-icon" /></DatePicker.Trigger>
                </div>
                <DatePicker.Positioner>
                    <DatePicker.Content>
                        <DatePicker.View view="day">
                            <DatePicker.Context>
                                {(datePicker) => (
                                    <>
                                        <DatePicker.ViewControl>
                                            <DatePicker.PrevTrigger>Anterior</DatePicker.PrevTrigger>
                                            <DatePicker.ViewTrigger>
                                                <DatePicker.RangeText />
                                            </DatePicker.ViewTrigger>
                                            <DatePicker.NextTrigger>Siguiente</DatePicker.NextTrigger>
                                        </DatePicker.ViewControl>
                                        <DatePicker.Table>
                                            <DatePicker.TableHead>
                                                <DatePicker.TableRow>
                                                    {datePicker.weekDays.map((weekDay, id) => (
                                                        <DatePicker.TableHeader key={id}>{weekDay.short}</DatePicker.TableHeader>
                                                    ))}
                                                </DatePicker.TableRow>
                                            </DatePicker.TableHead>
                                            <DatePicker.TableBody>
                                                {datePicker.weeks.map((week, id) => (
                                                    <DatePicker.TableRow key={id}>
                                                        {week.map((day, id) => (
                                                            <DatePicker.TableCell key={id} value={day}>
                                                                <DatePicker.TableCellTrigger>{day.day}</DatePicker.TableCellTrigger>
                                                            </DatePicker.TableCell>
                                                        ))}
                                                    </DatePicker.TableRow>
                                                ))}
                                            </DatePicker.TableBody>
                                        </DatePicker.Table>
                                    </>
                                )}
                            </DatePicker.Context>
                        </DatePicker.View>
                        <DatePicker.View view="month">
                            <DatePicker.Context>
                                {(datePicker) => (
                                    <>
                                        <DatePicker.ViewControl>
                                            <DatePicker.PrevTrigger>Anterior</DatePicker.PrevTrigger>
                                            <DatePicker.ViewTrigger>
                                                <DatePicker.RangeText />
                                            </DatePicker.ViewTrigger>
                                            <DatePicker.NextTrigger>Siguiente</DatePicker.NextTrigger>
                                        </DatePicker.ViewControl>
                                        <DatePicker.Table>
                                            <DatePicker.TableBody>
                                                {datePicker.getMonthsGrid({ columns: 4, format: 'short' }).map((months, id) => (
                                                    <DatePicker.TableRow key={id}>
                                                        {months.map((month, id) => (
                                                            <DatePicker.TableCell key={id} value={month.value}>
                                                                <DatePicker.TableCellTrigger>{month.label}</DatePicker.TableCellTrigger>
                                                            </DatePicker.TableCell>
                                                        ))}
                                                    </DatePicker.TableRow>
                                                ))}
                                            </DatePicker.TableBody>
                                        </DatePicker.Table>
                                    </>
                                )}
                            </DatePicker.Context>
                        </DatePicker.View>
                        <DatePicker.View view="year">
                            <DatePicker.Context>
                                {(datePicker) => (
                                    <>
                                        <DatePicker.ViewControl>
                                            <DatePicker.PrevTrigger>Anterior</DatePicker.PrevTrigger>
                                            <DatePicker.ViewTrigger>
                                                <DatePicker.RangeText />
                                            </DatePicker.ViewTrigger>
                                            <DatePicker.NextTrigger>Siguiente</DatePicker.NextTrigger>
                                        </DatePicker.ViewControl>
                                        <DatePicker.Table>
                                            <DatePicker.TableBody>
                                                {datePicker.getYearsGrid({ columns: 4 }).map((years, id) => (
                                                    <DatePicker.TableRow key={id}>
                                                        {years.map((year, id) => (
                                                            <DatePicker.TableCell key={id} value={year.value}>
                                                                <DatePicker.TableCellTrigger>{year.label}</DatePicker.TableCellTrigger>
                                                            </DatePicker.TableCell>
                                                        ))}
                                                    </DatePicker.TableRow>
                                                ))}
                                            </DatePicker.TableBody>
                                        </DatePicker.Table>
                                    </>
                                )}
                            </DatePicker.Context>
                        </DatePicker.View>
                    </DatePicker.Content>
                </DatePicker.Positioner>
            </DatePicker.Root>
        </div>
    );
};

export default DatePickerComponent;
