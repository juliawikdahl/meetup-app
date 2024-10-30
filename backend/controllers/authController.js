
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const AWS = require("aws-sdk");

AWS.config.update({
    region: process.env.AWS_REGION,
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});
console.log("AWS_REGION:", process.env.AWS_REGION);


const dynamoDB = new AWS.DynamoDB.DocumentClient();
const USERS_TABLE = "Users"; 

// Registreringsfunktion
exports.register = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: "Email och lösenord krävs." });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        // Kontrollera om användaren redan finns
        const existingUser = await dynamoDB.get({
            TableName: USERS_TABLE,
            Key: { email },
        }).promise();

        if (existingUser.Item) {
            return res.status(400).json({ error: "Användare finns redan." });
        }

        // Spara användaren i DynamoDB
        await dynamoDB.put({
            TableName: USERS_TABLE,
            Item: { email, password: hashedPassword },
        }).promise();

        res.status(201).json({ message: "Användare registrerad framgångsrikt!" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Användarregistrering misslyckades." });
    }
};

exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await dynamoDB.get({
            TableName: USERS_TABLE,
            Key: { email },
        }).promise();

        if (!user.Item) return res.status(400).json({ error: "Felaktig email eller lösenord." });

        const isPasswordValid = await bcrypt.compare(password, user.Item.password);
        if (!isPasswordValid) return res.status(400).json({ error: "Felaktig email eller lösenord." });

        const token = jwt.sign({ email: user.Item.email }, process.env.JWT_SECRET, {
            expiresIn: "1h",
        });

        res.json({ message: "Inloggning lyckades!", token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Inloggning misslyckades." });
    }
};
