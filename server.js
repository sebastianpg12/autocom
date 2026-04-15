const express = require('express');
const cors = require('cors');
const mockLeads = require('./mockLeads');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Log requests
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

/**
 * GET /lead/:id
 * Simulates Creatio OData Lead query
 */
app.get('/lead/:id', (req, res) => {
  const leadId = req.params.id;
  
  // 1. Try to find in our static list of 5 users
  const existingLead = mockLeads.find(l => l.Id === leadId);
  
  if (existingLead) {
    // Return a copy without the internal Id if preferred, 
    // but the user asked for specific fields in the JSON.
    const { Id, ...leadData } = existingLead;
    return res.json(leadData);
  }

  // 2. If not found, generate a dynamic response based on the ID
  // This satisfies the "dynamic response" optional requirement
  const dynamicLead = {
    "CreatedOn": new Date().toISOString(),
    "MobilePhone": `+521${leadId.slice(-9).padEnd(9, '0')}`,
    "Email": `user_${leadId.slice(-4)}@autocom-mock.com`,
    "ContactName": `Cliente Dinámico (${leadId})`,
    "QualifiedAccountId": `guid-${leadId.slice(0, 4)}`,
    "AutocomMake": "Generic",
    "AutocomVehicleTypeId": "type-dynamic",
    "AutocomModel": "Model X",
    "AutocomYear": "2025",
    "MeetingDate": new Date(Date.now() + 86400000).toISOString(), // Tomorrow
    "Notes": `Dynamic lead generated for ID: ${leadId}`,
    "AutocomVehicleVIN": `VIN${leadId.toUpperCase().slice(-10)}`
  };

  res.json(dynamicLead);
});

app.listen(PORT, () => {
  console.log(`\x1b[32m%s\x1b[0m`, `Mock API running on http://localhost:${PORT}`);
  console.log(`Try: http://localhost:${PORT}/lead/lead-001`);
  console.log(`Try: http://localhost:${PORT}/lead/un-id-cualquiera`);
});
