/**
 * Event Item Component
 */

import React from 'react';
import { formatTime, formatDate, isMultiDayEvent } from '../utils/date.utils';
import { Appointment } from '../types/api.types';
import { useI18n } from '../i18n';

interface EventItemProps {
    eventData: Appointment;
    expanded: boolean;
    setExpanded: (id: number | null) => void;
}

export const EventItem: React.FC<EventItemProps> = ({ eventData, expanded, setExpanded }) => {
    const t = useI18n();
    const event = eventData.base;
    const startTime = formatTime(eventData.calculated.startDate);
    const endTime = formatTime(eventData.calculated.endDate);
    const startDate = formatDate(eventData.calculated.startDate);
    const endDate = formatDate(eventData.calculated.endDate);
    const isMultiDay = isMultiDayEvent(eventData.calculated.startDate, eventData.calculated.endDate);
    const title = event.title || t.event;
    const color = event.calendar.color || 'var(--ct-accent)';

    const toggleExpanded = () => {
        setExpanded(event.id);
    };

    const renderTimeDisplay = () => {
        if (event.allDay) {
            if (isMultiDay) {
                return `${t.allDay}: ${startDate} - ${endDate}`;
            }
            return t.allDay;
        }
        
        if (isMultiDay) {
            return `${startDate} ${startTime} - ${endDate} ${endTime}`;
        }
        
        return `${startTime} - ${endTime}`;
    };
    return (
        <div className="event-item" onClick={toggleExpanded} role="button" tabIndex={0}>
            {event.image && (
                <div className="event-image">
                    <img src={event.image.imageUrl + '?w=645&h=323'} alt={event.image.name} />
                </div>
            )}

            <div className="event-header">

                <div className="event-time">
                    <svg
                        className="clock-icon"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                    >
                        <circle cx="12" cy="12" r="10" strokeWidth="2" />
                        <path d="M12 6v6l4 2" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                    <span>
                        {renderTimeDisplay()}
                    </span>
                </div>
                <h3 className="event-title" style={{ color }}>
                    {title}
                </h3>
                {event.subtitle &&
                <h3 className="event-subtitle">
                    {event.subtitle}
                </h3>
                }
            </div>

            {expanded && (event.description || event.address || event.link) && (
                <div className="event-details">
                    {event.address && (
                        <div className="event-address">
                            <svg
                                className="location-icon"
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                            >
                                <path
                                    d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"
                                    strokeWidth="2"
                                />
                                <circle cx="12" cy="10" r="3" strokeWidth="2" />
                            </svg>
                            <span>
                                {event.address.name && <strong>{event.address.name}</strong>}
                                {event.address.street && <span>{event.address.street}</span>}
                                {event.address.city && (
                                    <span>
                                        {event.address.zip} {event.address.city}
                                    </span>
                                )}
                            </span>
                        </div>
                    )}
                    {event.description && (
                        <div className="event-description">
                            <p style={{ whiteSpace: 'pre-line' }}>{event.description}</p>
                        </div>
                    )}
                    
                    {event.link && (
                        <a href={event.link} target="_blank" rel="noopener noreferrer">{event.link}</a>
                    )}
                </div>
            )}

            {!expanded && (event.description || event.address || event.link) && (
                <p className="event-hint">{t.tapForDetails}</p>
            )}
        </div>
    );
};
