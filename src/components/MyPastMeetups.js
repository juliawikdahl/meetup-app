
import React, { useEffect, useState } from 'react';
import { getPastUserMeetups } from '../api';

const MyPastMeetups = () => {
    const [pastMeetups, setPastMeetups] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPastMeetups = async () => {
            try {
                const response = await getPastUserMeetups();
                setPastMeetups(response.data);
            } catch (err) {
                setError('Kunde inte hämta tidigare meetups.');
            }
        };

        fetchPastMeetups();
    }, []);

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div className="container">
            <h1>Mina Tidigare Meetups</h1>
            {pastMeetups.length > 0 ? (
                <ul>
                    {pastMeetups.map(meetup => (
                        <li key={meetup.id}>
                            <h2>{meetup.title}</h2>
                            <p>{meetup.description}</p>
                            <p>Datum: {new Date(meetup.date).toLocaleDateString()}</p>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>Inga tidigare meetups funna.</p>
            )}
        </div>
    );
};

export default MyPastMeetups;
