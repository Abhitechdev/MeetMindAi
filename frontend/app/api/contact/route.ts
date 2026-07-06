import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { name, email, subject, message } = await request.json();

    if (!name || !email || !subject || !message) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const accessKey = process.env.WEB3FORMS_ACCESS_KEY;
    if (!accessKey) {
      console.error("Missing WEB3FORMS_ACCESS_KEY");
      return NextResponse.json({ error: 'Server misconfiguration' }, { status: 500 });
    }

    // ponytail: native fetch, no dependencies
    const response = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({
        access_key: accessKey,
        name: name,
        email: email,
        subject: `[Contact Form] ${subject} from ${name}`,
        message: message,
        from_name: "MeetMind AI Contact Form"
      })
    });

    const data = await response.json();
    if (!response.ok || !data.success) {
      throw new Error(data.message || 'Failed to send');
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Web3Forms Error:', error);
    return NextResponse.json(
      { error: 'Failed to send email. Please try again later.' },
      { status: 500 }
    );
  }
}
