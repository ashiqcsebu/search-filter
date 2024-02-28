// Search doctors by location
app.get('/search-doctor', async (req, res) => {
  try {
    const {
      search = "",
      location = "",
    } = req.query;
    
    const query = {};
    if (search) {
      query.specialty = { $regex: search, $options: "i" };
    }
    if (location) {
      query.location = location;
    }
  
    const doctors = await doctorsCollection.find(query).toArray();
    
    res.json({ doctors });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: true, message: "Internal server error" });
  }
})
