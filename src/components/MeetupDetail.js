import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getMeetupById, attendMeetup, cancelAttendance } from '../api';

const MeetupDetail = () => {
    const { id } = useParams();
    const [meetup, setMeetup] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [userEmail, setUserEmail] = useState(''); 

    useEffect(() => {
        const fetchMeetup = async () => {
            try {
                const response = await getMeetupById(id);
                setMeetup(response.data);
            } catch (error) {
                setError(error.response?.data?.error || 'Något gick fel med att hämta meetup-detaljer');
            } finally {
                setLoading(false);
            }
        };

        fetchMeetup();
    }, [id]);

    const handleAttend = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            alert('Du måste vara inloggad för att anmäla dig till meetups.');
            return;
        }
    
        if (meetup.attendees.length >= meetup.capacity) {
            alert('Tyvärr, denna meetup är fullt. Du kan inte anmäla dig.');
            return;
        }
    
        if (!userEmail) {
            alert('Användarens e-post krävs.');
            return;
        }
    
        console.log("E-post innan anmälan:", userEmail);
    
        try {
            const response = await attendMeetup(id, userEmail);
            alert(response.data.message);
        } catch (error) {
            console.error(`Fel vid anmälan: ${error.response?.data?.error}`);
            alert(`Fel vid anmälan: ${error.response?.data?.error || 'Anmälan misslyckades.'}`);
        }
    };
    

    const handleCancel = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            alert('Du måste vara inloggad för att avregistrera dig från meetups.');
            return;
        }
    
        try {
            const response = await cancelAttendance(id);
            alert(response.data.message);
        } catch (error) {
            console.error(`Fel vid avanmälan: ${error.response?.data?.error}`);
            alert(`Avregistrering misslyckades: ${error.response?.data?.error || 'Något gick fel.'}`);
        }
    };
    

    if (loading) return <div>Laddar...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div className="meetup-detail ">
            {meetup ? (
                <>
                    <h2>{meetup.title}</h2>
                    <p>{meetup.description}</p>
                    <p><strong>Datum:</strong> {new Date(meetup.date).toLocaleString()}</p>
                    <p><strong>Plats:</strong> {meetup.location}</p>
                    <p><strong>Värd:</strong> {meetup.host}</p>
                    <p><strong>Antal anmälda:</strong> {meetup.attendees.length} / {meetup.capacity}</p>
                    
                    
                    <input 
                        type="email" 
                        value={userEmail} 
                        onChange={(e) => setUserEmail(e.target.value)} 
                        placeholder="E-post innan anmälan"
                        required 
                    />
                    <button onClick={handleAttend}>Anmäl dig</button>
                    <button onClick={handleCancel}>Avregistrera</button>
                </>
            ) : (
                <div>Ingen meetup hittades.</div>
            )}
        </div>
    );
};

export default MeetupDetail;
