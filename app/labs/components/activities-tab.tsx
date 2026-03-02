import { useMemo, useState } from 'react';
import { Card, Badge, Button, Timeline, TimelineBody, TimelineContent, TimelineItem, TimelinePoint, TimelineTime, TimelineTitle } from 'flowbite-react';
import { Activity, ActivityStatus } from '@/types/activity';
import { mockActivityTypes } from '@/mocks/activities';
import {
    CalendarIcon,
    ClockIcon,
    VideoCameraIcon,
    MapPinIcon,
    StarIcon,
    CheckCircleIcon,
    XCircleIcon,
    DocumentTextIcon,
} from '@heroicons/react/24/outline';

interface ActivitiesTabProps {
    activities: Activity[];
}

const getStatusColor = (status: ActivityStatus): 'success' | 'warning' | 'failure' | 'info' | 'gray' => {
    switch (status) {
        case 'FUTURE':
            return 'success';
        case 'COMPLETED':
            return 'info';
        case 'CANCELLED':
            return 'failure';
        case 'DRAFT':
            return 'gray';
        default:
            return 'gray';
    }
};

const getStatusIcon = (status: ActivityStatus) => {
    switch (status) {
        case 'FUTURE':
            return CalendarIcon;
        case 'COMPLETED':
            return CheckCircleIcon;
        case 'CANCELLED':
            return XCircleIcon;
        case 'DRAFT':
            return DocumentTextIcon;
        default:
            return CalendarIcon;
    }
};

const formatDuration = (minutes: number): string => {
    if (minutes < 60) {
        return `${minutes} min`;
    } else if (minutes < 1440) {
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        return mins > 0 ? `${hours}h ${mins}min` : `${hours}h`;
    } else {
        const days = Math.floor(minutes / 1440);
        const hours = Math.floor((minutes % 1440) / 60);
        return hours > 0 ? `${days}d ${hours}h` : `${days}d`;
    }
};

export function ActivitiesTab({ activities }: ActivitiesTabProps) {
    const [visibleCount, setVisibleCount] = useState(10);
    const INITIAL_COUNT = 10;

    // Get activity types map
    const activityTypesMap = useMemo(() => {
        const map = new Map();
        mockActivityTypes.forEach(type => {
            map.set(type.id, type);
        });
        return map;
    }, []);

    // Sort activities: future activities first (descending), then past activities (descending)
    // Within each group, featured activities come first
    const sortedActivities = useMemo(() => {
        const now = new Date();
        const sorted = [...activities].sort((a, b) => {
            // First, separate future and past activities
            const aIsPast = a.startDate < now;
            const bIsPast = b.startDate < now;

            // Future activities come before past activities
            if (aIsPast && !bIsPast) return 1;
            if (!aIsPast && bIsPast) return -1;

            // Both same category (both future or both past)
            // Within same category, featured activities first
            if (a.isFeatured && !b.isFeatured) return -1;
            if (!a.isFeatured && b.isFeatured) return 1;

            // Both same category and same featured status, sort by date
            if (!aIsPast && !bIsPast) {
                // Both future, sort descending (most future first)
                return b.startDate.getTime() - a.startDate.getTime();
            } else {
                // Both past, sort descending (most recent first)
                return b.startDate.getTime() - a.startDate.getTime();
            }
        });
        return sorted;
    }, [activities]);

    // Get visible activities based on visibleCount
    const visibleActivities = sortedActivities.slice(0, visibleCount);
    const hasMore = sortedActivities.length > INITIAL_COUNT;
    const showAll = visibleCount >= sortedActivities.length;

    if (sortedActivities.length === 0) {
        return (
            <div>
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                            <CalendarIcon className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                            Lab Activities
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400 mt-2">
                            Explore upcoming and past activities, workshops, and events organized by the lab
                        </p>
                    </div>
                </div>
                <Card className="bg-white dark:bg-gray-800">
                    <p className="text-gray-500 dark:text-gray-400 italic text-center py-8">
                        No activities available at this time.
                    </p>
                </Card>
            </div>
        );
    }

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                        <CalendarIcon className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                        Lab Activities
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 mt-2">
                        Explore upcoming and past activities, workshops, and events organized by the lab
                    </p>
                </div>
                <Badge color="blue" className="text-sm px-3 py-1">
                    {sortedActivities.length} {sortedActivities.length === 1 ? 'activity' : 'activities'}
                </Badge>
            </div>

            <Timeline>
                {visibleActivities.map((activity) => {
                    const activityType = activityTypesMap.get(activity.activityTypeId);
                    const StatusIcon = getStatusIcon(activity.status);

                    return (
                        <TimelineItem key={activity.id}>
                            <TimelinePoint icon={StatusIcon} />
                            <TimelineContent>
                                <TimelineTime className="mb-1 text-sm font-normal leading-none text-gray-400 dark:text-gray-500">
                                    {activity.startDate.toLocaleDateString('en-US', {
                                        weekday: 'short',
                                        year: 'numeric',
                                        month: 'short',
                                        day: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit',
                                    })}
                                </TimelineTime>
                                <TimelineTitle className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2 flex-wrap">
                                    {activity.isFeatured && (
                                        <StarIcon className="w-5 h-5 text-yellow-500 dark:text-yellow-400" />
                                    )}
                                    <span>{activity.title}</span>
                                </TimelineTitle>
                                <TimelineBody className="text-base font-normal text-gray-500 dark:text-gray-400">
                                    {activity.summary}
                                </TimelineBody>

                                {/* Activity Details */}
                                <div className="mt-4 space-y-2">
                                    {/* Badges Row */}
                                    <div className="flex flex-wrap items-center gap-2">
                                        <Badge color={getStatusColor(activity.status)} className="text-xs">
                                            {activity.status}
                                        </Badge>
                                        {activityType && (
                                            <Badge color="info" className="text-xs">
                                                {activityType.name}
                                            </Badge>
                                        )}
                                        {activity.isFeatured && (
                                            <Badge color="warning" className="text-xs">
                                                <span className="inline-flex items-center gap-1">
                                                    <StarIcon className="w-3 h-3" />
                                                    Featured
                                                </span>
                                            </Badge>
                                        )}
                                    </div>

                                    {/* Metadata Row */}
                                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                                        <div className="flex items-center gap-1.5">
                                            <ClockIcon className="w-4 h-4" />
                                            <span>{formatDuration(activity.duration)}</span>
                                        </div>
                                        {activity.isOnline ? (
                                            <div className="flex items-center gap-1.5">
                                                <VideoCameraIcon className="w-4 h-4" />
                                                <span>Online</span>
                                                {activity.meetUrl && (
                                                    <a
                                                        href={activity.meetUrl}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-blue-600 dark:text-blue-400 hover:underline"
                                                    >
                                                        Join Meeting
                                                    </a>
                                                )}
                                            </div>
                                        ) : (
                                            <div className="flex items-center gap-1.5">
                                                <MapPinIcon className="w-4 h-4" />
                                                <span>In-Person</span>
                                            </div>
                                        )}
                                        {!activity.isPublic && (
                                            <Badge color="gray" className="text-xs">
                                                Private
                                            </Badge>
                                        )}
                                    </div>

                                    {/* Full Content Preview (optional, can be expanded) */}
                                    {activity.content && (
                                        <div className="mt-2 text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                                            {activity.content}
                                        </div>
                                    )}
                                </div>
                            </TimelineContent>
                        </TimelineItem>
                    );
                })}
            </Timeline>

            {/* Show More / Show Less Button */}
            {hasMore && (
                <div className="mt-6 flex justify-center">
                    <Button
                        color="blue"
                        onClick={() => {
                            if (showAll) {
                                setVisibleCount(INITIAL_COUNT);
                            } else {
                                setVisibleCount(sortedActivities.length);
                            }
                        }}
                        className="inline-flex items-center gap-2"
                    >
                        {showAll ? 'Show Less' : 'Show More'}
                    </Button>
                </div>
            )}
        </div>
    );
}
