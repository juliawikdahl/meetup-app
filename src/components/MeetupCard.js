
import React from 'react';
import { Link } from 'react-router-dom';


const MeetupCard = ({ meetup }) => {
  return (
    <div className="meetup-card">
      <h3>{meetup.title}</h3>
      <p>{meetup.description}</p>
      <Link to={`/meetups/${meetup.id}`}>Läs mer</Link>
    </div>
  );
};

export default MeetupCard;
