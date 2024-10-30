import React, { useEffect, useState } from 'react';
import { getUserMeetups, cancelAttendance } from '../api'; 

const MyMeetups = () => {
    const [meetups, setMeetups] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchMeetups = async () => {
            try {
                const response = await getUserMeetups();
                setMeetups(response.data);
            } catch (err) {
                console.error("Error fetching user meetups:", err);
                setError(err.response?.data?.error || 'Något gick fel vid hämtning av meetups.');
            } finally {
                setLoading(false);
            }
        };

        fetchMeetups();
    }, []);

    const handleCancelAttendance = async (meetupId) => {
        try {
            await cancelAttendance(meetupId); 
            setMeetups(meetups.filter(meetup => meetup.id !== meetupId)); 
            alert("Du har avregistrerat dig från meetuppen.");
        } catch (err) {
            console.error("Error canceling attendance:", err);
            alert("Misslyckades att avregistrera dig. Försök igen.");
        }
    };

    if (loading) return <p>Laddar...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div className="container">
            <h2>Mina Anmälda Meetups</h2>
            {meetups.length === 0 ? (
                <p>Du har inga anmälda meetups.</p>
            ) : (
                <ul>
                    {meetups.map(meetup => (
                        <li key={meetup.id}>
                            <h3>{meetup.title}</h3>
                            <p>{meetup.description}</p>
                            <p><strong>Datum:</strong> {new Date(meetup.date).toLocaleString()}</p>
                            <button onClick={() => handleCancelAttendance(meetup.id)}>Avregistrera</button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default MyMeetups;
