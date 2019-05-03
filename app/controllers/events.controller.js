const Event = require('../models/events');

module.exports = {
    showEvents: showEvents,
    showSingle: showSingle,
    seedEvents: seedEvents
};
/**
 * Show all events
 */
function showEvents(req, res) {
    // get all events   
    Event.find({}, (err, events) => {
      if (err) {
        res.status(404);
        res.send('Events not found!');
      }
  
      // return a view with data
      res.render('pages/events', { 
        events: events,
        //success: req.success('success')
      });
    });
  }
  

  function showSingle(req, res) {
    // get a single event
    Event.findOne({ slug: req.params.slug }, (err, event) => {
      if (err) {
        res.status(404);
        res.send('Event not found!');
      }
  
      res.render('pages/single', { 
        event: event,
        //success: req.flash('success')
      });
    });
  }

function seedEvents(req, res) {
    const events = [
        { name: 'Basketball', description: 'Throwing into a basket.' },
        { name: 'Swimming', description: 'Michael Phelps is the fast fish.' },
        { name: 'Weightlifting', description: 'Lifting heavy things up' }
    ];

    Event.remove({}, () => {
        for (event of events) {
            var newEvent = new Event(event);
            newEvent.save();
        }
    });

    res.send('Database Seeded');
}
