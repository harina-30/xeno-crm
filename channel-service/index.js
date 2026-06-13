const express = require('express');
const axios = require('axios');
const app = express();
app.use(express.json());

const CRM_RECEIPT_URL = 'https://xeno-crm-backend-juzy.onrender.com/api/receipt';

// Simulate delivery outcomes
const simulateOutcome = () => {
  const outcomes = ['delivered', 'delivered', 'delivered', 'opened', 'opened', 'clicked', 'failed'];
  return outcomes[Math.floor(Math.random() * outcomes.length)];
};

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

app.post('/send', async (req, res) => {
  const { communication_id, recipient, message, channel } = req.body;
  
  console.log(`📨 Received message for ${recipient} via ${channel}`);
  res.json({ success: true, message: 'Message queued for delivery' });

  // Simulate async delivery with random delay (2-8 seconds)
  const deliveryDelay = Math.floor(Math.random() * 6000) + 2000;
  
  await delay(deliveryDelay);
  
  const status = simulateOutcome();
  console.log(`📬 Delivery result for ${recipient}: ${status}`);

  // Call back the CRM with the result
  try {
    await axios.post(CRM_RECEIPT_URL, {
      communication_id,
      status
    });
    console.log(`✅ Receipt sent to CRM for communication ${communication_id}`);
  } catch (err) {
    console.log(`❌ Failed to send receipt: ${err.message}`);
  }
});

app.get('/health', (req, res) => {
  res.json({ status: 'channel service running' });
});

app.listen(5001, () => {
  console.log('Channel service running on port 5001');
});