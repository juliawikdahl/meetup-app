const express = require("express");
const router = express.Router();
const meetupController = require("../controllers/meetupController");
const authenticateToken = require("../Middlewares/authenticateToken"); 


router.get("/my-meetups", authenticateToken, meetupController.getUserMeetups); // Hämta användarens anmälda meetups
router.get("/my-meetups/past", authenticateToken, meetupController.getPastUserMeetups); // Hämta användarens tidigare meetups


router.get("/", meetupController.getAllMeetups); // Hämta alla meetups
router.get("/search", meetupController.searchMeetups); // Sök efter meetups
router.get("/:id", meetupController.getMeetupById); // Hämta specifik meetup
router.post("/", meetupController.createMeetup); // Skapa ny meetup
router.post("/:id/attend", authenticateToken, meetupController.attendMeetup); // Anmäl dig till meetup, skyddad
router.delete("/:id/attend", authenticateToken, meetupController.cancelAttendance); // Avregistrera från meetup

module.exports = router;
