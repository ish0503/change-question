// https://wikidocs.net/228921
//토큰: https://platform.openai.com/usage

export default async (req) => {
  if (req.method !== "POST") {
    return new Response("Method Not Allowed", { status: 405 });
  }

  let body;
  try {
    body = await req.json();
  } catch {
    return new Response("Invalid JSON", { status: 400 });
  }

  console.log(body.typesystem)

  var typesystem = ""

  if (body.typesystem == 'blank') {
      fetch('https://raw.githubusercontent.com/ish0503/change-question/refs/heads/main/blank.txt')
      .then((data) => data.text())
      .then((text) => {
        console.log(text ? true : false)
        typesystem = text
      }
      );
  }
  else if (body.typesystem == 'grammer') {
      fetch('https://raw.githubusercontent.com/ish0503/change-question/refs/heads/main/grammer.txt')
      .then((data) => data.text())
      .then((text) => {
        typesystem = text
      }
      );
  }
  else if (body.typesystem == 'meaning') {
      fetch('https://raw.githubusercontent.com/ish0503/change-question/refs/heads/main/meaning.txt')
      .then((data) => data.text())
      .then((text) => {
        typesystem = text
      }
      );
  }
  else if (body.typesystem == 'order') {
      fetch('https://raw.githubusercontent.com/ish0503/change-question/refs/heads/main/order.txt')
      .then((data) => data.text())
      .then((text) => {
        typesystem = text
      }
      );
  }

  console.log(typesystem)

  const { message } = JSON.stringify({ type: body.typesystem, content: body.message })
  const { systemmessage } = typesystem

  console.log(systemmessage)

  console.log(JSON.stringify({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemmessage },
        { role: "user", content: message }
      ]
    }))

  const openaiRes = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemmessage },
        { role: "user", content: message }
      ]
    })
  });

  const data = await openaiRes.json();

  if (!openaiRes.ok || !data.choices || !data.choices[0]) {
    console.error("OpenAI API Error:", data);

    return new Response(
      JSON.stringify({
        error: "OpenAI API error",
        detail: data
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" }
      }
    );
  }

  return new Response(
    JSON.stringify({
      reply: data.choices[0].message.content
    }),
    {
      status: 200,
      headers: { "Content-Type": "application/json" }
    }
  );
};