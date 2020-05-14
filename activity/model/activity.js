class Activity {
  constructor(aid, ownerId, title, time, location, organizer, participants, description) {
    this.aid = aid;
    this.ownerId = ownerId;
    this.title = title;
    this.time = time;
    this.location = location;
    this.organizer = organizer;
    this.participants = participants;
    this.description = description;
  }
}

export default Activity;