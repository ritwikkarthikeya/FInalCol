// TournamentResult.js
import { useState } from 'react';
import { Button } from '@/components/ui/button'; // Assuming you are using the ShadCN Button component

const TournamentResult = ({ tournament }) => {
  const [joining, setJoining] = useState(false);
  const [message, setMessage] = useState('');

  const handleJoinTournament = async () => {
    setJoining(true); // Show loading state
    const token = localStorage.getItem('user_jwt'); // Get token from localStorage

    try {
      const response = await fetch(`http://localhost:5000/api/tournament/join/${tournament.tid}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      if (response.ok) {
        setMessage('Successfully joined the tournament!');
      } else {
        const data = await response.json();
        setMessage(data.message || 'Error joining tournament.');
      }
    } catch (error) {
      setMessage('Error joining the tournament.');
      console.error('Error joining tournament:', error);
    } finally {
      setJoining(false); // Hide loading state
    }
  };

  return (
    <div className="tournament-result p-4 border-2 border-gray-200 rounded-lg shadow-sm mb-4">
      <h3 className="text-xl font-bold">{tournament.name}</h3>
      <p><strong>Status:</strong> {tournament.status}</p>
      <p><strong>Description:</strong> {tournament.description}</p>
      <p><strong>Prize Pool:</strong> {tournament.prizePool}</p>

      {/* Join Tournament Button */}
      <div className="mt-4">
        {message && <p className="text-sm text-gray-600">{message}</p>}
        <Button
          onClick={handleJoinTournament}
          disabled={joining || tournament.status !== 'Approved'}
          className="bg-blue-500 text-white hover:bg-blue-600"
        >
          {joining ? 'Joining...' : 'Join Tournament'}
        </Button>
      </div>
    </div>
  );
};

export default TournamentResult;
