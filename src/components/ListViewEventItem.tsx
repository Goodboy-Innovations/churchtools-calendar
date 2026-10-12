/**
 * List View Event Item Component
 * Simplified event item for list view without images
 */

import React from 'react';
import { formatTime, formatDate, isMultiDayEvent } from '../utils/date.utils';
import { Appointment } from '../types/api.types';
import { useI18n } from '../i18n';

interface ListViewEventItemProps {
    eventData: Appointment;
    expanded: boolean;
    setExpanded: (id: number | null) => void;
    disableFlags: {
        description: boolean;
        location: boolean;
        link: boolean;
    };
}

export const ListViewEventItem: React.FC<ListViewEventItemProps> = ({
    eventData,
    expanded,
    setExpanded,
    disableFlags,
}) => {
    const t = useI18n();
    const event = eventData.base;
    const startTime = formatTime(eventData.calculated.startDate);
    const endTime = formatTime(eventData.calculated.endDate);
    const startDate = formatDate(eventData.calculated.startDate);
    const endDate = formatDate(eventData.calculated.endDate);
    const isMultiDay = isMultiDayEvent(
        eventData.calculated.startDate,
        eventData.calculated.endDate
    );
    const title = event.title || t.event;
    const color = event.calendar.color || 'var(--ct-accent)';

    // Only allow interaction if description is not disabled
    const canExpand = !disableFlags.description && (event.description || event.address || event.link);

    const toggleExpanded = () => {
        if (canExpand) {
            setExpanded(expanded ? null : event.id);
        }
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
        <div
            className={`listview-event-item ${canExpand ? 'expandable' : 'non-expandable'}`}
            onClick={toggleExpanded}
            role={canExpand ? 'button' : undefined}
            tabIndex={canExpand ? 0 : undefined}
        >
            <div className="event-header">
                <div className="event-time">
                    <span>{renderTimeDisplay()}</span>
                </div>
                <h3 className="event-title" style={{ color }}>
                    {title}
                </h3>
                {event.subtitle && (
                    <h3 className="event-subtitle">
                        {event.subtitle}
                    </h3>
                )}
            </div>
            {!disableFlags.description && !expanded && canExpand && (
                <div className="dropdown-icon">
                    <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        aria-hidden="true"
                    >
                        <path
                            d="M6 9l6 6 6-6"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                </div>
            )}

            {!disableFlags.description && expanded && (event.description || event.address || event.link) && (
                <div className="event-details">
                    {!disableFlags.location && event.address && (
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
                                {event.address && (
                                    <span>
                                        {event.address?.name} {event.address?.street} {event.address?.zip} {event.address?.city}
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

                    {!disableFlags.link && event.link && (
                        <a href={event.link} target="_blank" rel="noopener noreferrer">
                            {event.link}
                        </a>
                    )}
                </div>
            )}


        </div>
    );
};
