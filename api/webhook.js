module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  try {
    const fields = req.body?.data?.fields || [];
    let name = '', email = '', phone = '';
    for (const field of fields) {
      const label = field.label?.toLowerCase() || '';
      const value = field.value || '';
      if (label.includes('name')) name = value;
      if (label.includes('email')) email = value;
      if (label.includes('phone')) phone = value;
    }
    await fetch('https://api.notion.com/v1/pages', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.NOTION_API_KEY}`,
        'Content-Type': 'application/json',
        'Notion-Version': '2022-06-28'
      },
      body: JSON.stringify({
        parent: { database_id: process.env.NOTION_DB_ID },
        properties: {
          'Name': { title: [{ text: { content: name } }] },
          'Email': { email: email || null },
          'Phone Number': { phone_number: phone || null },
          'Status': { select: { name: 'New' } },
          'Date Added': { date: { start: new Date().toISOString().split('T')[0] } },
          'Member': { checkbox: false }
        }
      })
    });
    return res.status(200).json({ success: true });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
