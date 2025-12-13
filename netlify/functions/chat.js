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
      await fetch('https://raw.githubusercontent.com/ish0503/change-question/refs/heads/main/blank.txt')
      .then((data) => data.text())
      .then((text) => {
        console.log(text ? true : false)
        typesystem = text
      }
      );
  }
  else if (body.typesystem == 'grammer') {
      await fetch('https://raw.githubusercontent.com/ish0503/change-question/refs/heads/main/grammer.txt')
      .then((data) => data.text())
      .then((text) => {
        typesystem = text
      }
      );
  }
  else if (body.typesystem == 'meaning') {
      await fetch('https://raw.githubusercontent.com/ish0503/change-question/refs/heads/main/meaning.txt')
      .then((data) => data.text())
      .then((text) => {
        typesystem = text
      }
      );
  }
  else if (body.typesystem == 'order') {
      await fetch('https://raw.githubusercontent.com/ish0503/change-question/refs/heads/main/order.txt')
      .then((data) => data.text())
      .then((text) => {
        typesystem = text
      }
      );
  }

  const message = JSON.stringify({ type: typesystem, content: body.message })

  console.log(typesystem)

  console.log(JSON.stringify({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: typesystem },
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
        { role: "system", content: typesystem },
        { role: "user", content: message }
      ]
    })
  });

  const data = await openaiRes.choices[0].message.content

  console.log(data)

  return new Response(
    data,
    {
      status: 200,
      headers: { "Content-Type": "application/json" }
    }
  );
};