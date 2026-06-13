const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { createClient } = require('@supabase/supabase-js');
const ws = require('ws');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY, {
  realtime: { transport: ws }
});

app.get('/api/customers', async (req, res) => {
  const { data, error } = await supabase.from('customers').select('*').order('created_at', { ascending: false });
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

app.get('/api/orders', async (req, res) => {
  const { data, error } = await supabase.from('orders').select('*, customers(name, email)').order('ordered_at', { ascending: false });
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

app.get('/api/campaigns', async (req, res) => {
  const { data, error } = await supabase.from('campaigns').select('*').order('created_at', { ascending: false });
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

app.post('/api/campaigns', async (req, res) => {
  const { name, message_template, channel } = req.body;
  const { data, error } = await supabase.from('campaigns').insert([{ name, message_template, channel, status: 'draft' }]).select().single();
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

app.post('/api/campaigns/:id/send', async (req, res) => {
  const { id } = req.params;
  const axios = require('axios');
  const { data: campaign, error: campError } = await supabase.from('campaigns').select('*').eq('id', id).single();
  if (campError) return res.status(500).json({ error: campError.message });
  const { data: customers, error: custError } = await supabase.from('customers').select('*');
  if (custError) return res.status(500).json({ error: custError.message });
  const communications = customers.map(c => ({
    campaign_id: id,
    customer_id: c.id,
    message: campaign.message_template.replace('{{name}}', c.name),
    status: 'sent'
  }));
  const { data: commsData, error: commsError } = await supabase.from('communications').insert(communications).select();
  if (commsError) return res.status(500).json({ error: commsError.message });
  await supabase.from('campaigns').update({ status: 'sent' }).eq('id', id);
  for (const comm of commsData) {
    const customer = customers.find(c => c.id === comm.customer_id);
    axios.post(`${process.env.CHANNEL_SERVICE_URL}/send`, {
      communication_id: comm.id,
      recipient: customer.email,
      message: comm.message,
      channel: campaign.channel
    }).catch(err => console.log('Channel service error:', err.message));
  }
  res.json({ success: true, sent_to: customers.length });
});

app.post('/api/receipt', async (req, res) => {
  const { communication_id, status } = req.body;
  const { error } = await supabase.from('communications').update({ status, updated_at: new Date() }).eq('id', communication_id);
  if (error) return res.status(500).json({ error: error.message });
  res.json({ success: true });
});

app.get('/api/campaigns/:id/stats', async (req, res) => {
  const { id } = req.params;
  const { data, error } = await supabase.from('communications').select('status').eq('campaign_id', id);
  if (error) return res.status(500).json({ error: error.message });
  const stats = data.reduce((acc, curr) => {
    acc[curr.status] = (acc[curr.status] || 0) + 1;
    return acc;
  }, {});
  res.json({ total: data.length, ...stats });
});

// ─── AI SUGGEST (Groq) ───────────────────────────────────
app.post('/api/ai/suggest', async (req, res) => {
  const { prompt } = req.body;
  console.log('AI request received:', prompt);

  try {
    const Groq = require('groq-sdk');
    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

    const { data: customers } = await supabase.from('customers').select('*');
    console.log('Customers fetched:', customers.length);

    const completion = await groq.chat.completions.create({
      model: 'llama-3.1-8b-instant',
      messages: [
        {
          role: 'system',
          content: 'You are an AI assistant for a marketing CRM. Always respond with valid JSON only, no markdown, no extra text.'
        },
        {
          role: 'user',
          content: `Marketer's goal: ${prompt}
Customer summary: ${customers.length} customers across cities like ${[...new Set(customers.map(c => c.city))].slice(0,5).join(', ')}

Respond ONLY in this exact JSON format:
{
  "segment_description": "description of who to target",
  "message_template": "message with {{name}} placeholder",
  "channel": "email",
  "campaign_name": "campaign name"
}`
        }
      ]
    });

    const text = completion.choices[0].message.content;
    console.log('Groq response:', text);
    const clean = text.replace(/```json|```/g, '').trim();
    const json = JSON.parse(clean);
    res.json(json);
  } catch (err) {
    console.log('AI ERROR:', err.message);
    res.status(500).json({ error: err.message });
  }
});

app.listen(process.env.PORT, () => {
  console.log(`Backend running on port ${process.env.PORT}`);
});