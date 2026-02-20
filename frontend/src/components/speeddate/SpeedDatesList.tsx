import { useState } from 'react';
import SpeedDateCard, { SpeedDate } from './SpeedDateCard';

function SpeedDatesList() {
  const [activeTab, setActiveTab] = useState<'pending' | 'upcoming' | 'past'>('pending');

  // Mock data - in production, this would come from API
  const mockPendingSent: SpeedDate[] = [
    {
      id: '1',
      matchId: 'match-1',
      matchName: 'Priya',
      matchAge: 28,
      matchPhoto: 'https://picsum.photos/seed/1/200',
      matchLocation: 'Mumbai',
      status: 'pending_sent',
      requestedAt: '2 hours ago',
      hoursLeft: 46,
      suggestedSlots: ['Wed 6-9 PM', 'Thu 7-8 PM'],
    },
  ];

  const mockPendingReceived: SpeedDate[] = [
    {
      id: '2',
      matchId: 'match-2',
      matchName: 'Anjali',
      matchAge: 26,
      matchPhoto: 'https://picsum.photos/seed/2/200',
      matchLocation: 'Delhi',
      status: 'pending_received',
      requestedAt: '5 hours ago',
      hoursLeft: 43,
      suggestedSlots: ['Wed 6:00 PM', 'Wed 8:00 PM', 'Thu 7:00 PM'],
    },
  ];

  const mockUpcoming: SpeedDate[] = [
    {
      id: '3',
      matchId: 'match-3',
      matchName: 'Sneha',
      matchAge: 27,
      matchPhoto: 'https://picsum.photos/seed/3/200',
      matchLocation: 'Bangalore',
      status: 'confirmed',
      eventState: 'SCHEDULED',
      eventTime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000 + 5 * 60 * 60 * 1000).toISOString(),
      lockTime: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000 + 5 * 60 * 60 * 1000).toISOString(),
      confirmedDate: 'Wed, Feb 20',
      confirmedTime: '6:00 PM',
      startsIn: '2 days, 5 hours',
    },
  ];

  const mockPast: SpeedDate[] = [
    {
      id: '4',
      matchId: 'match-4',
      matchName: 'Kavita',
      matchAge: 29,
      matchPhoto: 'https://picsum.photos/seed/4/200',
      matchLocation: 'Pune',
      status: 'completed',
      feedbackGiven: false,
      mutualInterest: false,
    },
  ];

  const tabs = [
    { id: 'pending', label: 'Pending', count: mockPendingSent.length + mockPendingReceived.length },
    { id: 'upcoming', label: 'Upcoming', count: mockUpcoming.length },
    { id: 'past', label: 'Past', count: mockPast.length },
  ];

  return (
    <div className="min-h-screen bg-[#FAFAFA] pb-24">
      {/* Tabs */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="flex">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 py-4 px-4 text-sm font-semibold relative transition-colors
                ${
                  activeTab === tab.id
                    ? 'text-[#9B59B6]'
                    : 'text-[#6C757D] hover:text-[#1D3557]'
                }`}
            >
              {tab.label} ({tab.count})
              {activeTab === tab.id && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#9B59B6]" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-4">
        {activeTab === 'pending' && (
          <>
            {mockPendingSent.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-[#1D3557] mb-3">Requests Sent ({mockPendingSent.length})</h3>
                {mockPendingSent.map((date) => (
                  <SpeedDateCard
                    key={date.id}
                    speedDate={date}
                    onCancel={() => console.log('Cancel', date.id)}
                    onViewProfile={() => console.log('View profile', date.matchId)}
                  />
                ))}
              </div>
            )}

            {mockPendingReceived.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-[#1D3557] mb-3 mt-6">Requests Received ({mockPendingReceived.length})</h3>
                {mockPendingReceived.map((date) => (
                  <SpeedDateCard
                    key={date.id}
                    speedDate={date}
                    onAccept={() => console.log('Accept', date.id)}
                    onDecline={() => console.log('Decline', date.id)}
                  />
                ))}
              </div>
            )}
          </>
        )}

        {activeTab === 'upcoming' && (
          <>
            {mockUpcoming.length > 0 ? (
              mockUpcoming.map((date) => (
                <SpeedDateCard
                  key={date.id}
                  speedDate={date}
                  onJoin={() => console.log('Join call', date.id)}
                  onCancel={() => console.log('Cancel', date.id)}
                  onViewProfile={() => console.log('View profile', date.matchId)}
                />
              ))
            ) : (
              <div className="text-center py-12">
                <p className="text-[#6C757D]">No upcoming speed dates</p>
                <p className="text-sm text-[#9CA3AF] mt-1">Keep exploring matches!</p>
              </div>
            )}
          </>
        )}

        {activeTab === 'past' && (
          <>
            {mockPast.length > 0 ? (
              mockPast.map((date) => (
                <SpeedDateCard
                  key={date.id}
                  speedDate={date}
                  onGiveFeedback={() => console.log('Give feedback', date.id)}
                  onSendMessage={() => console.log('Send message', date.matchId)}
                  onViewProfile={() => console.log('View profile', date.matchId)}
                />
              ))
            ) : (
              <div className="text-center py-12">
                <p className="text-[#6C757D]">No past speed dates</p>
                <p className="text-sm text-[#9CA3AF] mt-1">Your history will appear here</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default SpeedDatesList;
