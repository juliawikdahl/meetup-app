
import React, { useEffect, useState } from 'react';
import { getAllMeetups } from '../api'; 
import MeetupCard from './MeetupCard';

const MeetupList = () => {
  const [meetups, setMeetups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredMeetups, setFilteredMeetups] = useState([]); 

  useEffect(() => {
    const fetchMeetups = async () => {
      try {
        const response = await getAllMeetups();
        const now = new Date(); 
        const upcomingMeetups = response.data.filter(meetup => new Date(meetup.date) > now); 
        setMeetups(upcomingMeetups);
        setFilteredMeetups(upcomingMeetups); 
      } catch (error) {
        setError(error.response?.data?.error || 'Något gick fel med att hämta meetups');
      } finally {
        setLoading(false);
      }
    };

    fetchMeetups();
  }, []);

 
  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    

    const filtered = meetups.filter(meetup =>
      meetup.title.toLowerCase().includes(query) || 
      meetup.description.toLowerCase().includes(query) 
    );
    setFilteredMeetups(filtered);
  };

  if (loading) return <div>Laddar...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="meetup-list">
      <input
        type="text"
        placeholder="Sök efter meetups..."
        value={searchQuery}
        onChange={handleSearch} 
      />
      {filteredMeetups.length > 0 ? ( 
        filteredMeetups.map(meetup => (
          <MeetupCard key={meetup.id} meetup={meetup} />
        ))
      ) : (
        <div>Inga kommande meetups att visa.</div>
      )}
    </div>
  );
};

export default MeetupList;
