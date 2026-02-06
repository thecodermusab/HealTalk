"use client";

import { Calendar, Clock, Users, DollarSign, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { format } from "date-fns";

interface SessionCardProps {
  session: {
    id: string;
    title: string;
    description?: string;
    type: string;
    maxParticipants: number;
    startTime: Date | string;
    duration: number;
    pricePerPerson: number;
    status: string;
    psychologist: {
      user: {
        name: string;
        image: string | null;
      };
    };
    _count?: {
      participants: number;
    };
    availableSpots?: number;
    isFull?: boolean;
  };
  onJoin?: (sessionId: string) => void;
  showJoinButton?: boolean;
  isLoading?: boolean;
}

export function SessionCard({ session, onJoin, showJoinButton = true, isLoading = false }: SessionCardProps) {
  const startTime = new Date(session.startTime);
  const participantCount = session._count?.participants || 0;
  const availableSpots = session.availableSpots ?? (session.maxParticipants - participantCount);
  const isFull = session.isFull ?? (participantCount >= session.maxParticipants);

  return (
    <div className="bg-white border border-gray-200 rounded-[24px] p-6 hover:shadow-lg transition-all">
      {/* Header */}
      <div className="flex items-start gap-4 mb-4">
        <div className="relative w-12 h-12 rounded-full overflow-hidden bg-gray-100 flex-shrink-0">
          {session.psychologist.user.image ? (
            <Image
              src={session.psychologist.user.image}
              alt={session.psychologist.user.name}
              fill
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Users className="text-gray-400" size={20} />
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-bold text-lg text-gray-900 mb-1">{session.title}</h3>
            {session.type === "GROUP" && (
              <span className="px-3 py-1 bg-purple-100 text-purple-700 text-xs font-medium rounded-full flex-shrink-0">
                Group
              </span>
            )}
          </div>
          <p className="text-sm text-gray-600">with {session.psychologist.user.name}</p>
        </div>
      </div>

      {/* Description */}
      {session.description && (
        <p className="text-sm text-gray-600 mb-4 line-clamp-2">{session.description}</p>
      )}

      {/* Details */}
      <div className="space-y-2 mb-4">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Calendar size={16} className="text-gray-400" />
          <span>{format(startTime, "EEEE, MMMM d, yyyy")}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Clock size={16} className="text-gray-400" />
          <span>
            {format(startTime, "h:mm a")} • {session.duration} minutes
          </span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Users size={16} className="text-gray-400" />
          <span>
            {participantCount} / {session.maxParticipants} participants
            {availableSpots > 0 && (
              <span className="text-green-600 ml-1">
                ({availableSpots} spot{availableSpots !== 1 ? "s" : ""} left)
              </span>
            )}
          </span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <DollarSign size={16} className="text-gray-400" />
          <span className="font-semibold text-gray-900">
            ${(session.pricePerPerson / 100).toFixed(2)} per person
          </span>
        </div>
      </div>

      {/* Participants Preview */}
      {participantCount > 0 && (
        <div className="flex items-center gap-2 mb-4">
          <div className="flex -space-x-2">
            {[...Array(Math.min(participantCount, 3))].map((_, i) => (
              <div
                key={i}
                className="w-8 h-8 rounded-full bg-gray-200 border-2 border-white"
              />
            ))}
          </div>
          {participantCount > 3 && (
            <span className="text-xs text-gray-500">+{participantCount - 3} more</span>
          )}
        </div>
      )}

      {/* Action Button */}
      {showJoinButton && session.status === "SCHEDULED" && (
        <Button
          onClick={() => onJoin?.(session.id)}
          disabled={isFull || isLoading}
          className="w-full rounded-full"
          size="lg"
        >
          {isLoading ? (
            <>
              <Loader2 className="animate-spin mr-2" size={16} />
              Joining...
            </>
          ) : isFull ? (
            "Session Full"
          ) : (
            "Join Session"
          )}
        </Button>
      )}

      {session.status === "CANCELLED" && (
        <div className="text-center py-2 text-red-600 font-medium">Cancelled</div>
      )}
    </div>
  );
}
