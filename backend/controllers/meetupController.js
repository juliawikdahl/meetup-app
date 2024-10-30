const AWS = require("aws-sdk");
const { v4: uuidv4 } = require("uuid");

AWS.config.update({ region: process.env.AWS_REGION });
const dynamoDB = new AWS.DynamoDB.DocumentClient();
const MEETUPS_TABLE = "Meetups"; 

// Hämta alla meetups
exports.getAllMeetups = async (req, res) => {
  try {
    const data = await dynamoDB.scan({ TableName: MEETUPS_TABLE }).promise();
    res.json(data.Items);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Kunde inte hämta meetups." });
  }
};

// Hämta en specifik meetup
exports.getMeetupById = async (req, res) => {
  const { id } = req.params;

  try {
    const meetup = await dynamoDB.get({
      TableName: MEETUPS_TABLE,
      Key: { id },
    }).promise();

    if (!meetup.Item) {
      return res.status(404).json({ error: "Meetup hittades inte." });
    }

    res.json(meetup.Item);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Kunde inte hämta meetup." });
  }
};

// Skapa en ny meetup
exports.createMeetup = async (req, res) => {
  const { title, date, location, description, host, capacity } = req.body;

  if (!title || !date || !location || !description || !host || !capacity) {
    return res.status(400).json({ error: "Alla fält krävs." });
  }

  const newMeetup = {
    id: uuidv4(),
    title,
    date,
    location,
    description,
    host,
    attendees: [],
    capacity,
  };

  try {
    await dynamoDB.put({
      TableName: MEETUPS_TABLE,
      Item: newMeetup,
    }).promise();

    res.status(201).json({ message: "Meetup skapad framgångsrikt!", meetup: newMeetup });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Kunde inte skapa meetup." });
  }
};

// Anmäl dig till en meetup
exports.attendMeetup = async (req, res) => {
  const { id } = req.params;
  const { userEmail } = req.body;
  const MAX_ATTENDEES = 100;

  if (!userEmail) {
    return res.status(400).json({ error: "Användarens email krävs." });
  }

  try {
    const meetup = await dynamoDB.get({
      TableName: MEETUPS_TABLE,
      Key: { id },
    }).promise();

    if (!meetup.Item) {
      return res.status(404).json({ error: "Meetup hittades inte." });
    }

    // Kontrollera om användaren redan är anmäld
    if (meetup.Item.attendees.includes(userEmail)) {
      return res.status(400).json({ error: "Du är redan anmäld till denna meetup." });
    }

    // Kontrollera kapacitet
    if (meetup.Item.attendees.length >= MAX_ATTENDEES) {
      return res.status(400).json({ error: "Meetup är full. Du kan inte anmäla dig." });
    }

    const updatedAttendees = [...meetup.Item.attendees, userEmail];

    await dynamoDB.update({
      TableName: MEETUPS_TABLE,
      Key: { id },
      UpdateExpression: "set attendees = :attendees",
      ExpressionAttributeValues: {
        ":attendees": updatedAttendees,
      },
    }).promise();

    res.status(200).json({ message: "Anmälan lyckades!", attendees: updatedAttendees });
  } catch (error) {
    console.error("Error attending meetup:", error);
    res.status(500).json({ error: "Anmälan misslyckades." });
  }
};

// Avregistrera från en meetup
exports.cancelAttendance = async (req, res) => {
  const { id } = req.params;
  const { userEmail } = req.body;

  if (!userEmail) {
    return res.status(400).json({ error: "Användarens email krävs." });
  }

  try {
    const meetup = await dynamoDB.get({
      TableName: MEETUPS_TABLE,
      Key: { id },
    }).promise();

    if (!meetup.Item) {
      return res.status(404).json({ error: "Meetup hittades inte." });
    }

    // Kontrollera om användaren är registrerad
    if (!meetup.Item.attendees.includes(userEmail)) {
      return res.status(400).json({ error: "Användaren är inte registrerad för denna meetup." });
    }

    const updatedAttendees = meetup.Item.attendees.filter(email => email !== userEmail);

    await dynamoDB.update({
      TableName: MEETUPS_TABLE,
      Key: { id },
      UpdateExpression: "set attendees = :attendees",
      ExpressionAttributeValues: {
        ":attendees": updatedAttendees,
      },
    }).promise();

    res.status(200).json({ message: "Avregistrering lyckades!", attendees: updatedAttendees });
  } catch (error) {
    console.error("Error canceling attendance:", error);
    res.status(500).json({ error: "Avregistrering misslyckades." });
  }
};

// Hämta användarens anmälningar
exports.getUserMeetups = async (req, res) => {
  const { email } = req.user;

  console.log("Fetching meetups for user:", email);
  try {
    const meetups = await dynamoDB.scan({ TableName: MEETUPS_TABLE }).promise();
    const userMeetups = meetups.Items.filter(meetup =>
      meetup.attendees.includes(email)
    );

    res.json(userMeetups);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Kunde inte hämta användarens anmälningar." });
  }
};

// Hämta användarens tidigare meetups
exports.getPastUserMeetups = async (req, res) => {
  const { email } = req.user;
  const currentDate = new Date();

  console.log("Fetching past meetups for user:", email);
  try {
    const meetups = await dynamoDB.scan({ TableName: MEETUPS_TABLE }).promise();
    const pastUserMeetups = meetups.Items.filter(meetup =>
      meetup.attendees.includes(email) && new Date(meetup.date) < currentDate
    );

    res.json(pastUserMeetups);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Kunde inte hämta användarens tidigare anmälningar." });
  }
};

// Sök efter meetups
exports.searchMeetups = async (req, res) => {
  const { query } = req.query;

  console.log("Search query:", query); 

  if (!query) {
    return res.status(400).json({ error: "Sökfrågan krävs." });
  }

  try {
    const meetups = await dynamoDB.scan({ TableName: MEETUPS_TABLE }).promise();
    const filteredMeetups = meetups.Items.filter(meetup => 
      meetup.title.toLowerCase().includes(query.toLowerCase()) ||
      meetup.description.toLowerCase().includes(query.toLowerCase())
    );
    res.json(filteredMeetups);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Kunde inte söka meetups." });
  }
};


